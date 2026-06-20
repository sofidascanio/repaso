import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { FlashcardService } from '@/flashcard/flashcard.service';
import { CollectionService } from '@/collection/collection.service';
import { SM2Service } from './sm2.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewLog, Flashcard } from '@prisma/client';

@Injectable()
export class ReviewService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly flashcardService: FlashcardService,
        private readonly collectionService: CollectionService,
        private readonly sm2: SM2Service,
    ) {}

    async review(
        flashcardId: string,
        userId: string,
        dto: CreateReviewDto,
    ): Promise<ReviewLog> {
        // verifica que la flashcard existe y pertenece al usuario
        await this.flashcardService.findOne(flashcardId, userId);

        // obtiene el ultimo review log para esta flashcard y usuario
        const lastLog = await this.prisma.reviewLog.findFirst({
            where: { flashcardId, userId },
            orderBy: { reviewedAt: 'desc' },
        });

        const currentState = {
            easeFactor: lastLog?.easeFactor ?? 2.5,
            interval: lastLog?.interval ?? 0,
            repetitions: lastLog?.repetitions ?? 0,
            result: dto.result,
        };

        const nextState = this.sm2.calculate(currentState);

        return this.prisma.reviewLog.create({
            data: {
                flashcardId,
                userId,
                result: dto.result,
                easeFactor: nextState.easeFactor,
                interval: nextState.interval,
                repetitions: nextState.repetitions,
                nextReviewDate: nextState.nextReviewDate,
            },
        });
    }

    async getDueFlashcards(
        collectionId: string,
        userId: string,
    ): Promise<Flashcard[]> {
        await this.collectionService.findOne(collectionId, userId);

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        // flashcards que nunca fueron repasadas
        const allFlashcards = await this.prisma.flashcard.findMany({
            where: { collectionId, deletedAt: null },
        });

        // ultimo review log por flashcard para este usuario
        const latestLogs = await this.prisma.reviewLog.findMany({
            where: {
                userId,
                flashcard: { collectionId },
            },
            orderBy: { reviewedAt: 'desc' },
            distinct: ['flashcardId'],
        });

        const logMap = new Map(latestLogs.map((log) => [log.flashcardId, log]));

        const due = allFlashcards.filter((card) => {
        const log = logMap.get(card.id);
        if (!log) return true; // nunca repasada, incluir
            return log.nextReviewDate <= today; // vence hoy, incluir
        });

        return due;
    }
}