import {
    Controller,
    Get,
    Patch,
    Delete,
    Body,
    UseGuards,
    HttpCode,
    HttpStatus,
    Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { IsString } from 'class-validator';

class DeleteAccountDto {
    @IsString()
    password!: string;
}

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get()
    getProfile(@CurrentUser() user: User) {
        return this.profileService.getProfile(user.id);
    }

    @Patch()
    updateProfile(
        @Body() dto: UpdateProfileDto,
        @CurrentUser() user: User,
    ) {
        return this.profileService.updateProfile(user.id, dto);
    }

    @Patch('password')
    @HttpCode(HttpStatus.NO_CONTENT)
    changePassword(
        @Body() dto: ChangePasswordDto,
        @CurrentUser() user: User,
    ) {
        return this.profileService.changePassword(user.id, dto);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAccount(
        @Body() dto: DeleteAccountDto,
        @CurrentUser() user: User,
        @Res({ passthrough: true }) res: Response,
    ) {
        await this.profileService.deleteAccount(user.id, dto.password);
        res.clearCookie('refresh_token');
    }
}