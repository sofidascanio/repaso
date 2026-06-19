import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { WorkspaceService } from '@/workspace/workspace.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from '@prisma/client';

@Injectable()
export class ProjectService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly workspaceService: WorkspaceService,
    ) {}

    async findAll(workspaceId: string, userId: string): Promise<Project[]> {
        await this.workspaceService.findOne(workspaceId, userId);

        return this.prisma.project.findMany({
            where: { workspaceId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, userId: string): Promise<Project> {
        const project = await this.prisma.project.findUnique({
            where: { id, deletedAt: null },
            include: { workspace: true },
        });

        if (!project) throw new NotFoundException('Project no encontrado');
        if (project.workspace.userId !== userId) throw new ForbiddenException();

        return project;
    }

    async create(
        workspaceId: string,
        userId: string,
        dto: CreateProjectDto,
    ): Promise<Project> {
        await this.workspaceService.findOne(workspaceId, userId);

        return this.prisma.project.create({
            data: {
                ...dto,
                workspaceId,
            },
        });
    }

    async update(
        id: string,
        userId: string,
        dto: UpdateProjectDto,
    ): Promise<Project> {
        await this.findOne(id, userId);

        return this.prisma.project.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string, userId: string): Promise<void> {
        await this.findOne(id, userId);

        await this.prisma.project.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}