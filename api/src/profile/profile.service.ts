import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SafeUser } from '@/auth/auth.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
    constructor(private readonly prisma: PrismaService) {}

    async getProfile(userId: string): Promise<SafeUser> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId, deletedAt: null },
        });

        if (!user) throw new NotFoundException('Usuario no encontrado');
        return this.toSafeUser(user);
    }

    async updateProfile(
        userId: string,
        dto: UpdateProfileDto,
    ): Promise<SafeUser> {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: dto,
        });

        return this.toSafeUser(user);
    }

    async changePassword(
        userId: string,
        dto: ChangePasswordDto,
    ): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId, deletedAt: null },
        });

        if (!user) throw new NotFoundException('Usuario no encontrado');

        const passwordValid = await bcrypt.compare(
            dto.currentPassword,
            user.passwordHash,
        );

        if (!passwordValid)
        throw new UnauthorizedException('La contraseña actual es incorrecta');

        const newHash = await bcrypt.hash(dto.newPassword, 12);

        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash: newHash, refreshToken: null },
        });
    }

    async deleteAccount(userId: string, password: string): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId, deletedAt: null },
        });

        if (!user) throw new NotFoundException('Usuario no encontrado');

        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid)
        throw new UnauthorizedException('Contraseña incorrecta');

        await this.prisma.user.update({
            where: { id: userId },
            data: { deletedAt: new Date(), refreshToken: null },
        });
    }

    private toSafeUser(user: User): SafeUser {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
        };
    }
}