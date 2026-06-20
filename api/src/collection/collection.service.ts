import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ProjectService } from '@/project/project.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from '@prisma/client';

@Injectable()
export class CollectionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly projectService: ProjectService,
    ) {}

    async findAll(projectId: string, userId: string): Promise<Collection[]> {
        await this.projectService.findOne(projectId, userId);

        return this.prisma.collection.findMany({
            where: { projectId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, userId: string): Promise<Collection> {
        const collection = await this.prisma.collection.findUnique({
        where: { id, deletedAt: null },
            include: {
                project: {
                    include: { workspace: true },
                },
            },
        });

        if (!collection) throw new NotFoundException('Collection no encontrada');
        if (collection.project.workspace.userId !== userId)
        throw new ForbiddenException();

        return collection;
    }

    async create(
        projectId: string,
        userId: string,
        dto: CreateCollectionDto,
    ): Promise<Collection> {
        await this.projectService.findOne(projectId, userId);

        return this.prisma.collection.create({
            data: { ...dto, projectId },
        });
    }

    async update(
        id: string,
        userId: string,
        dto: UpdateCollectionDto,
    ): Promise<Collection> {
        await this.findOne(id, userId);

        return this.prisma.collection.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string, userId: string): Promise<void> {
        await this.findOne(id, userId);

        await this.prisma.collection.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}