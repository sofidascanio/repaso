import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Workspace } from '@prisma/client';

@Injectable()
export class WorkspaceService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(userId: string): Promise<Workspace[]> {
        return this.prisma.workspace.findMany({
            where: { userId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, userId: string): Promise<Workspace> {
        const workspace = await this.prisma.workspace.findUnique({
            where: { id, deletedAt: null },
        });

        if (!workspace) throw new NotFoundException('Workspace no encontrado');
        if (workspace.userId !== userId) throw new ForbiddenException();

        return workspace;
    }

    async create(userId: string, dto: CreateWorkspaceDto): Promise<Workspace> {
        return this.prisma.workspace.create({
            data: {
                ...dto,
                userId,
            },
        });
    }

    async update(
        id: string,
        userId: string,
        dto: UpdateWorkspaceDto,
    ): Promise<Workspace> {
        await this.findOne(id, userId);

        return this.prisma.workspace.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string, userId: string): Promise<void> {
        await this.findOne(id, userId);

        await this.prisma.workspace.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}