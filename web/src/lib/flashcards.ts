const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export interface Flashcard {
    id: string;
    question: string;
    answer: string;
    tags: string[];
    imageUrl: string | null;
    isFavorite: boolean;
    isDifficult: boolean;
    collectionId: string;
    createdAt: string;
    updatedAt: string;
}

async function flashcardFetch<T>(
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

    if (response.status === 204) return undefined as T;
    return response.json();
}

export async function getFlashcards(
    accessToken: string,
    collectionId: string,
): Promise<Flashcard[]> {
    return flashcardFetch<Flashcard[]>(
        `/collections/${collectionId}/flashcards`,
        accessToken,
    );
}

export async function getFlashcardsForStudy(
    accessToken: string,
    collectionId: string,
): Promise<Flashcard[]> {
    return flashcardFetch<Flashcard[]>(
        `/collections/${collectionId}/flashcards/study`,
        accessToken,
    );
}

export async function createFlashcard(
    accessToken: string,
    collectionId: string,
    data: {
        question: string;
        answer: string;
        tags?: string[];
        isFavorite?: boolean;
        isDifficult?: boolean;
    },
): Promise<Flashcard> {
    return flashcardFetch<Flashcard>(
        `/collections/${collectionId}/flashcards`,
        accessToken,
        { method: 'POST', body: JSON.stringify(data) },
    );
}

export async function updateFlashcard(
    accessToken: string,
    id: string,
    data: {
        question?: string;
        answer?: string;
        tags?: string[];
        isFavorite?: boolean;
        isDifficult?: boolean;
    },
): Promise<Flashcard> {
    return flashcardFetch<Flashcard>(`/flashcards/${id}`, accessToken, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deleteFlashcard(
    accessToken: string,
    id: string,
): Promise<void> {
    return flashcardFetch<void>(`/flashcards/${id}`, accessToken, {
        method: 'DELETE',
    });
}