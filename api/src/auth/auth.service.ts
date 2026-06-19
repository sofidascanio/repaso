import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface SafeUser {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    createdAt: Date;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
    ) {}

    // registro 
    async register(dto: RegisterDto): Promise<{ user: SafeUser; tokens: AuthTokens }> {
        const existing = await this.userService.findByEmail(dto.email);
        if (existing) throw new ConflictException('El email ya está registrado');

        const passwordHash = await bcrypt.hash(dto.password, 12);

        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                passwordHash,
            },
        });

        const tokens = await this.generateTokens(user);
        await this.saveRefreshToken(user.id, tokens.refreshToken);

        return { user: this.toSafeUser(user), tokens };
    }

    // login 
    async login(dto: LoginDto): Promise<{ user: SafeUser; tokens: AuthTokens }> {
        const user = await this.userService.findByEmail(dto.email);
        if (!user) throw new UnauthorizedException('Credenciales inválidas');

        const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!passwordValid) throw new UnauthorizedException('Credenciales inválidas');

        const tokens = await this.generateTokens(user);
        await this.saveRefreshToken(user.id, tokens.refreshToken);

        return { user: this.toSafeUser(user), tokens };
    }

    // refresh 
    async refresh(userId: string, refreshToken: string): Promise<AuthTokens> {
        const user = await this.userService.findById(userId);
        if (!user || !user.refreshToken) throw new UnauthorizedException();

        const tokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!tokenValid) throw new UnauthorizedException();

        const tokens = await this.generateTokens(user);
        await this.saveRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    // logout 
    async logout(userId: string): Promise<void> {
        await this.userService.updateRefreshToken(userId, null);
    }

    // me
    toSafeUser(user: User): SafeUser {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
        };
    }

    // helpers  
    private async generateTokens(user: User): Promise<AuthTokens> {
        const payload = { sub: user.id, email: user.email };

        const accessExpires = this.config.get<string>('JWT_EXPIRES_IN') as StringValue;
        const refreshExpires = this.config.get<string>('JWT_REFRESH_EXPIRES_IN') as StringValue;

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.config.get<string>('JWT_SECRET'),
                expiresIn: accessExpires,
            }),
            this.jwtService.signAsync(payload, {
                secret: this.config.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: refreshExpires,
            }),
        ]);

        return { accessToken, refreshToken };
    }
    private async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
        const hashed = await bcrypt.hash(refreshToken, 10);
        await this.userService.updateRefreshToken(userId, hashed);
    }
}