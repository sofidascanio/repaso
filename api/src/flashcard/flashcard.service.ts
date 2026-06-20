// src/flashcard/flashcard.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CollectionService } from '@/collection/collection.service';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { Flashcard } from '@prisma/client';

@Injectable()
export class FlashcardService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly collectionService: CollectionService,
    ) {}

    async findAll(collectionId: string, userId: string): Promise<Flashcard[]> {
        await this.collectionService.findOne(collectionId, userId);

        return this.prisma.flashcard.findMany({
            where: { collectionId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, userId: string): Promise<Flashcard> {
        const flashcard = await this.prisma.flashcard.findUnique({
            where: { id, deletedAt: null },
            include: {
                collection: {
                    include: {
                        project: {
                            include: { workspace: true },
                        },
                    },
                },
            },
        });

        if (!flashcard) throw new NotFoundException('Flashcard no encontrada');
        if (flashcard.collection.project.workspace.userId !== userId)
        throw new ForbiddenException();

        return flashcard;
    }

    async create(
        collectionId: string,
        userId: string,
        dto: CreateFlashcardDto,
    ): Promise<Flashcard> {
        await this.collectionService.findOne(collectionId, userId);

        return this.prisma.flashcard.create({
            data: { ...dto, collectionId },
        });
    }

    async update(
        id: string,
        userId: string,
        dto: UpdateFlashcardDto,
    ): Promise<Flashcard> {
        await this.findOne(id, userId);

        return this.prisma.flashcard.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string, userId: string): Promise<void> {
        await this.findOne(id, userId);

        await this.prisma.flashcard.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async findForStudy(collectionId: string, userId: string): Promise<Flashcard[]> {
        await this.collectionService.findOne(collectionId, userId);

        return this.prisma.flashcard.findMany({
            where: { collectionId, deletedAt: null },
            orderBy: { updatedAt: 'asc' },
        });
    }
}