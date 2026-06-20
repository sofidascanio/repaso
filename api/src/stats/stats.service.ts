import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ReviewResult } from '@prisma/client';

export interface OverviewStats {
    totalFlashcards: number;
    totalReviews: number;
    totalCollections: number;
    totalProjects: number;
    totalWorkspaces: number;
    reviewsToday: number;
    dueToday: number;
    streak: number;
    accuracyRate: number;
    reviewsByResult: Record<ReviewResult, number>;
    reviewsLast7Days: { date: string; count: number }[];
}

export interface CollectionStats {
    collectionId: string;
    totalFlashcards: number;
    totalReviews: number;
    dueToday: number;
    masteredCount: number;
    accuracyRate: number;
    reviewsByResult: Record<ReviewResult, number>;
}

@Injectable()
export class StatsService {
	constructor(private readonly prisma: PrismaService) {}

	async getOverview(userId: string): Promise<OverviewStats> {
		const now = new Date();
		const todayStart = new Date(now);
		todayStart.setHours(0, 0, 0, 0);
		const todayEnd = new Date(now);
		todayEnd.setHours(23, 59, 59, 999);

		// conteos base
		const [
			totalWorkspaces,
			totalProjects,
			totalCollections,
			totalFlashcards,
			totalReviews,
			reviewsToday,
		] = await Promise.all([
			this.prisma.workspace.count({ where: { userId, deletedAt: null } }),
			this.prisma.project.count({
				where: { workspace: { userId }, deletedAt: null },
			}),
			this.prisma.collection.count({
				where: { project: { workspace: { userId } }, deletedAt: null },
			}),
			this.prisma.flashcard.count({
				where: {
					collection: { project: { workspace: { userId } } },
					deletedAt: null,
				},
			}),
			this.prisma.reviewLog.count({ where: { userId } }),
			this.prisma.reviewLog.count({
				where: {
					userId,
					reviewedAt: { gte: todayStart, lte: todayEnd },
				},
			}),
		]);

		// reviews por resultado
		const reviewsByResultRaw = await this.prisma.reviewLog.groupBy({
			by: ['result'],
			where: { userId },
			_count: { result: true },
		});

		const reviewsByResult = Object.values(ReviewResult).reduce(
			(acc, r) => ({ ...acc, [r]: 0 }),
			{} as Record<ReviewResult, number>,
		);

		for (const row of reviewsByResultRaw) {
			reviewsByResult[row.result] = row._count.result;
		}

		// accuracy: good + easy sobre el total
		const correct = (reviewsByResult[ReviewResult.GOOD] ?? 0) + (reviewsByResult[ReviewResult.EASY] ?? 0);
		const accuracyRate = totalReviews > 0 ? Math.round((correct / totalReviews) * 100) : 0;

		// flashcards pendientes hoy
		const dueToday = await this.countDueToday(userId, todayEnd);

		// streak de dias consecutivos
		const streak = await this.calculateStreak(userId);

		// reviews ultimos 7 dias
		const reviewsLast7Days = await this.getReviewsLast7Days(userId);

		return {
			totalFlashcards,
			totalReviews,
			totalCollections,
			totalProjects,
			totalWorkspaces,
			reviewsToday,
			dueToday,
			streak,
			accuracyRate,
			reviewsByResult,
			reviewsLast7Days,
		};
	}

	async getCollectionStats(
		collectionId: string,
		userId: string,
	): Promise<CollectionStats> {
		const now = new Date();
		const todayEnd = new Date(now);
		todayEnd.setHours(23, 59, 59, 999);

		const totalFlashcards = await this.prisma.flashcard.count({
			where: { collectionId, deletedAt: null },
		});

		const totalReviews = await this.prisma.reviewLog.count({
			where: { userId, flashcard: { collectionId } },
		});

		// reviews por resultado
		const reviewsByResultRaw = await this.prisma.reviewLog.groupBy({
			by: ['result'],
			where: { userId, flashcard: { collectionId } },
			_count: { result: true },
		});

		const reviewsByResult = Object.values(ReviewResult).reduce(
			(acc, r) => ({ ...acc, [r]: 0 }),
			{} as Record<ReviewResult, number>,
		);

		for (const row of reviewsByResultRaw) {
			reviewsByResult[row.result] = row._count.result;
		}

		const correct = (reviewsByResult[ReviewResult.GOOD] ?? 0) + (reviewsByResult[ReviewResult.EASY] ?? 0);
		const accuracyRate = totalReviews > 0 ? Math.round((correct / totalReviews) * 100) : 0;

		// tarjetas "dominadas": ultimo review fue good o easy y nextReviewDate > hoy
		const latestLogs = await this.prisma.reviewLog.findMany({
			where: { userId, flashcard: { collectionId } },
			orderBy: { reviewedAt: 'desc' },
			distinct: ['flashcardId'],
		});

		const masteredCount = latestLogs.filter(
			(log) =>
				(log.result === ReviewResult.GOOD ||
				log.result === ReviewResult.EASY) &&
				log.nextReviewDate > todayEnd,
		).length;

		// due today
		const dueToday = latestLogs.filter(
			(log) => log.nextReviewDate <= todayEnd,
		).length;

		// flashcards sin ningun review tambien cuentan como due
		const reviewedIds = new Set(latestLogs.map((l) => l.flashcardId));
		const allIds = await this.prisma.flashcard.findMany({
			where: { collectionId, deletedAt: null },
			select: { id: true },
		});
		const neverReviewed = allIds.filter((f) => !reviewedIds.has(f.id)).length;

		return {
			collectionId,
			totalFlashcards,
			totalReviews,
			dueToday: dueToday + neverReviewed,
			masteredCount,
			accuracyRate,
			reviewsByResult,
		};
	}

	// helpers
	private async countDueToday(userId: string, todayEnd: Date): Promise<number> {
		const latestLogs = await this.prisma.reviewLog.findMany({
			where: { userId },
			orderBy: { reviewedAt: 'desc' },
			distinct: ['flashcardId'],
		});

		const dueFromLogs = latestLogs.filter(
			(log) => log.nextReviewDate <= todayEnd,
		).length;

		const reviewedIds = new Set(latestLogs.map((l) => l.flashcardId));
		const totalCards = await this.prisma.flashcard.count({
			where: {
				collection: { project: { workspace: { userId } } },
				deletedAt: null,
			},
		});

		const neverReviewed = totalCards - reviewedIds.size;
		return dueFromLogs + neverReviewed;
	}

	private async calculateStreak(userId: string): Promise<number> {
		const logs = await this.prisma.reviewLog.findMany({
			where: { userId },
			orderBy: { reviewedAt: 'desc' },
			select: { reviewedAt: true },
		});

		if (logs.length === 0) return 0;

		const uniqueDays = new Set(
			logs.map((l) => l.reviewedAt.toISOString().split('T')[0]),
		);

		const days = Array.from(uniqueDays).sort((a, b) =>
			b.localeCompare(a),
		);

		const today = new Date().toISOString().split('T')[0];
		const yesterday = new Date(Date.now() - 86400000)
			.toISOString()
			.split('T')[0];

		if (days[0] !== today && days[0] !== yesterday) return 0;

		let streak = 1;
		for (let i = 1; i < days.length; i++) {
			const prev = new Date(days[i - 1]);
			const curr = new Date(days[i]);
			const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
			if (diff === 1) {
				streak++;
			} else {
				break;
			}
		}

		return streak;
	}

	private async getReviewsLast7Days(
		userId: string,
	): Promise<{ date: string; count: number }[]> {
		const days: { date: string; count: number }[] = [];

		for (let i = 6; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			const start = new Date(date);
			start.setHours(0, 0, 0, 0);
			const end = new Date(date);
			end.setHours(23, 59, 59, 999);

			const count = await this.prisma.reviewLog.count({
				where: { userId, reviewedAt: { gte: start, lte: end } },
			});

			days.push({ date: date.toISOString().split('T')[0], count });
		}

		return days;
	}
}