import {
    Controller,
    Post,
    Get,
    Body,
    UseGuards,
    HttpCode,
    HttpStatus,
    Req,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Registrar nuevo usuario' })
    @Post('register')
    async register(
        @Body() dto: RegisterDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { user, tokens } = await this.authService.register(dto);
        this.setRefreshTokenCookie(res, tokens.refreshToken);
        return { user, accessToken: tokens.accessToken };
    }

    @ApiOperation({ summary: 'Iniciar sesión' })
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { user, tokens } = await this.authService.login(dto);
        this.setRefreshTokenCookie(res, tokens.refreshToken);
        return { user, accessToken: tokens.accessToken };
    }

    @ApiOperation({ summary: 'Renovar access token con refresh token (cookie)' })
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req.cookies?.['refresh_token'];
        if (!refreshToken) throw new UnauthorizedException();

        // decodifica sin verificar solo para obtener el userId
        const payload = this.authService['jwtService'].decode(refreshToken) as {
            sub: string;
        } | null;

        if (!payload?.sub) throw new UnauthorizedException();

        const tokens = await this.authService.refresh(payload.sub, refreshToken);
        this.setRefreshTokenCookie(res, tokens.refreshToken);
        return { accessToken: tokens.accessToken };
    }

    @ApiOperation({ summary: 'Cerrar sesión' })
    @ApiBearerAuth('access-token')
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async logout(
        @CurrentUser() user: User,
        @Res({ passthrough: true }) res: Response,
    ) {
        await this.authService.logout(user.id);
        res.clearCookie('refresh_token');
        return { message: 'Sesión cerrada correctamente' };
    }

    @ApiOperation({ summary: 'Obtener usuario autenticado' })
    @ApiBearerAuth('access-token')
    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@CurrentUser() user: User) {
        return this.authService.toSafeUser(user);
    }

    private setRefreshTokenCookie(res: Response, token: string) {
        res.cookie('refresh_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias en ms
            path: '/',
        });
    }
}