import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id, deletedAt: null },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email, deletedAt: null },
        });
    }

    async updateRefreshToken(
        id: string,
        refreshToken: string | null,
    ): Promise<void> {
        await this.prisma.user.update({
            where: { id },
            data: { refreshToken },
        });
    }
}