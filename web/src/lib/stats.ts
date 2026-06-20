const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export type ReviewResult = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';

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

async function statsFetch<T>(
    endpoint: string,
    accessToken: string,
): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? `HTTP ${response.status}`);
    }

    return response.json();
}

export async function getOverviewStats(
    accessToken: string,
): Promise<OverviewStats> {
    return statsFetch<OverviewStats>('/stats/overview', accessToken);
}

export async function getCollectionStats(
    accessToken: string,
    collectionId: string,
): Promise<CollectionStats> {
    return statsFetch<CollectionStats>(
        `/stats/collection/${collectionId}`,
        accessToken,
    );
}