const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export type ReviewResult = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';

export interface ReviewLog {
    id: string;
    flashcardId: string;
    userId: string;
    result: ReviewResult;
    easeFactor: number;
    interval: number;
    repetitions: number;
    nextReviewDate: string;
    reviewedAt: string;
}

async function reviewFetch<T>(
    endpoint: string,
    accessToken: string,
    options: RequestInit = {},
): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? `HTTP ${response.status}`);
    }

    return response.json();
}

export async function submitReview(
    accessToken: string,
    flashcardId: string,
    result: ReviewResult,
): Promise<ReviewLog> {
    return reviewFetch<ReviewLog>(`/flashcards/${flashcardId}/review`, accessToken, {
        method: 'POST',
        body: JSON.stringify({ result }),
    });
}

export async function getDueFlashcards(
    accessToken: string,
    collectionId: string,
): Promise<import('./flashcards').Flashcard[]> {
    return reviewFetch(`/collections/${collectionId}/due`, accessToken);
}