const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export interface SearchResults {
    workspaces: {
        id: string;
        name: string;
        description: string | null;
        iconEmoji: string | null;
    }[];
    projects: {
        id: string;
        name: string;
        description: string | null;
        iconEmoji: string | null;
        workspaceId: string;
    }[];
    collections: {
        id: string;
        name: string;
        description: string | null;
        iconEmoji: string | null;
        projectId: string;
        workspaceId: string;
    }[];
    flashcards: {
        id: string;
        question: string;
        answer: string;
        tags: string[];
        collectionId: string;
        projectId: string;
        workspaceId: string;
    }[];
    total: number;
}

export async function searchAll(
    accessToken: string,
    query: string,
): Promise<SearchResults> {
    const response = await fetch(
        `${API_URL}/search?q=${encodeURIComponent(query)}`,
        {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? `HTTP ${response.status}`);
    }

    return response.json();
}