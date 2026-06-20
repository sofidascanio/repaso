const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export interface Collection {
    id: string;
    name: string;
    description: string | null;
    iconEmoji: string | null;
    projectId: string;
    createdAt: string;
    updatedAt: string;
}

async function collectionFetch<T>(
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

export async function getCollections(
    accessToken: string,
    projectId: string,
): Promise<Collection[]> {
    return collectionFetch<Collection[]>(
        `/projects/${projectId}/collections`,
        accessToken,
    );
}

export async function createCollection(
    accessToken: string,
    projectId: string,
    data: { name: string; description?: string; iconEmoji?: string },
): Promise<Collection> {
    return collectionFetch<Collection>(
        `/projects/${projectId}/collections`,
        accessToken,
        { method: 'POST', body: JSON.stringify(data) },
    );
}

export async function updateCollection(
    accessToken: string,
    id: string,
    data: { name?: string; description?: string; iconEmoji?: string },
): Promise<Collection> {
    return collectionFetch<Collection>(`/collections/${id}`, accessToken, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deleteCollection(
    accessToken: string,
    id: string,
): Promise<void> {
    return collectionFetch<void>(`/collections/${id}`, accessToken, {
        method: 'DELETE',
    });
}