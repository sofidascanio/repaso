import { PrismaClient, ReviewResult } from '@prisma/client';
import { SeededUsers } from './users.seed';
import { SeededFlashcards } from './flashcards.seed';

export async function seedReviews(
    prisma: PrismaClient,
    users: SeededUsers,
    flashcards: SeededFlashcards,
): Promise<void> {
    console.log('  → Creando historial de repasos...');

    const now = new Date();

    function daysAgo(n: number): Date {
        const d = new Date(now);
        d.setDate(d.getDate() - n);
        return d;
    }

    function daysFromNow(n: number): Date {
        const d = new Date(now);
        d.setDate(d.getDate() + n);
        return d;
    }

    // sofia tiene historial de repasos variado para mostrar estadísticas
    const sofiaReviews: {
        flashcardId: string;
        result: ReviewResult;
        easeFactor: number;
        interval: number;
        repetitions: number;
        nextReviewDate: Date;
        reviewedAt: Date;
    }[] = [
        // Verbos, dominados
        {
            flashcardId: flashcards.verbosIds[0],
            result: ReviewResult.EASY,
            easeFactor: 2.7,
            interval: 15,
            repetitions: 4,
            nextReviewDate: daysFromNow(15),
            reviewedAt: daysAgo(0),
        },
        {
            flashcardId: flashcards.verbosIds[1],
            result: ReviewResult.GOOD,
            easeFactor: 2.5,
            interval: 10,
            repetitions: 3,
            nextReviewDate: daysFromNow(10),
            reviewedAt: daysAgo(1),
        },
        {
            flashcardId: flashcards.verbosIds[2],
            result: ReviewResult.GOOD,
            easeFactor: 2.5,
            interval: 6,
            repetitions: 2,
            nextReviewDate: daysFromNow(6),
            reviewedAt: daysAgo(1),
        },
        {
            flashcardId: flashcards.verbosIds[3],
            result: ReviewResult.HARD,
            easeFactor: 2.18,
            interval: 1,
            repetitions: 0,
            nextReviewDate: daysFromNow(1),
            reviewedAt: daysAgo(0),
        },
        // Verbos, pendientes hoy
        {
            flashcardId: flashcards.verbosIds[4],
            result: ReviewResult.AGAIN,
            easeFactor: 2.3,
            interval: 1,
            repetitions: 0,
            nextReviewDate: daysFromNow(1),
            reviewedAt: daysAgo(2),
        },
        // Álgebra, algunos repasos recientes
        {
            flashcardId: flashcards.algebraIds[0],
            result: ReviewResult.GOOD,
            easeFactor: 2.5,
            interval: 6,
            repetitions: 2,
            nextReviewDate: daysFromNow(6),
            reviewedAt: daysAgo(0),
        },
        {
            flashcardId: flashcards.algebraIds[1],
            result: ReviewResult.EASY,
            easeFactor: 2.6,
            interval: 8,
            repetitions: 3,
            nextReviewDate: daysFromNow(8),
            reviewedAt: daysAgo(0),
        },
        {
            flashcardId: flashcards.algebraIds[3],
            result: ReviewResult.AGAIN,
            easeFactor: 2.2,
            interval: 1,
            repetitions: 0,
            nextReviewDate: daysFromNow(1),
            reviewedAt: daysAgo(1),
        },
        // Historia, repasos de días anteriores (para simular racha)
        {
            flashcardId: flashcards.historiaIds[0],
            result: ReviewResult.GOOD,
            easeFactor: 2.5,
            interval: 3,
            repetitions: 1,
            nextReviewDate: daysFromNow(3),
            reviewedAt: daysAgo(2),
        },
        {
            flashcardId: flashcards.historiaIds[1],
            result: ReviewResult.GOOD,
            easeFactor: 2.5,
            interval: 3,
            repetitions: 1,
            nextReviewDate: daysFromNow(3),
            reviewedAt: daysAgo(3),
        },
        {
            flashcardId: flashcards.historiaIds[2],
            result: ReviewResult.EASY,
            easeFactor: 2.7,
            interval: 5,
            repetitions: 2,
            nextReviewDate: daysFromNow(5),
            reviewedAt: daysAgo(4),
        },
        // Vocabulario, pendientes hoy
        {
            flashcardId: flashcards.vocabularioIds[0],
            result: ReviewResult.HARD,
            easeFactor: 2.18,
            interval: 1,
            repetitions: 0,
            nextReviewDate: daysAgo(0),
            reviewedAt: daysAgo(3),
        },
        {
            flashcardId: flashcards.vocabularioIds[2],
            result: ReviewResult.AGAIN,
            easeFactor: 2.0,
            interval: 1,
            repetitions: 0,
            nextReviewDate: daysAgo(1),
            reviewedAt: daysAgo(4),
        },
    ];

    await prisma.reviewLog.createMany({
        data: sofiaReviews.map((r) => ({
            ...r,
            userId: users.sofia.id,
        })),
    });

    // matias tiene algunos repasos de Node.js
    const matiasReviews = [
        {
            flashcardId: flashcards.nodeIds[0],
            result: ReviewResult.EASY,
            easeFactor: 2.7,
            interval: 12,
            repetitions: 3,
            nextReviewDate: daysFromNow(12),
            reviewedAt: daysAgo(0),
            userId: users.matias.id,
        },
        {
            flashcardId: flashcards.nodeIds[1],
            result: ReviewResult.GOOD,
            easeFactor: 2.5,
            interval: 6,
            repetitions: 2,
            nextReviewDate: daysFromNow(6),
            reviewedAt: daysAgo(1),
            userId: users.matias.id,
        },
        {
            flashcardId: flashcards.hooksIds[0],
            result: ReviewResult.GOOD,
            easeFactor: 2.5,
            interval: 6,
            repetitions: 2,
            nextReviewDate: daysFromNow(6),
            reviewedAt: daysAgo(0),
            userId: users.matias.id,
        },
        {
            flashcardId: flashcards.hooksIds[2],
            result: ReviewResult.AGAIN,
            easeFactor: 2.18,
            interval: 1,
            repetitions: 0,
            nextReviewDate: daysFromNow(1),
            reviewedAt: daysAgo(1),
            userId: users.matias.id,
        },
    ];

    await prisma.reviewLog.createMany({ data: matiasReviews });

    console.log(`     ✓ ${sofiaReviews.length} reviews para Sofía`, );
    console.log(`     ✓ ${matiasReviews.length} reviews para Matías`, );
}