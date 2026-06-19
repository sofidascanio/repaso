const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export interface Workspace {
    id: string;
    name: string;
    description: string | null;
    iconEmoji: string | null;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

async function workspaceFetch<T>(
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

export async function getWorkspaces(accessToken: string): Promise<Workspace[]> {
    return workspaceFetch<Workspace[]>('/workspaces', accessToken);
}

export async function createWorkspace(
    accessToken: string,
    data: { name: string; description?: string; iconEmoji?: string },
): Promise<Workspace> {
    return workspaceFetch<Workspace>('/workspaces', accessToken, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateWorkspace(
    accessToken: string,
    id: string,
    data: { name?: string; description?: string; iconEmoji?: string },
): Promise<Workspace> {
    return workspaceFetch<Workspace>(`/workspaces/${id}`, accessToken, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deleteWorkspace(
    accessToken: string,
    id: string,
): Promise<void> {
    return workspaceFetch<void>(`/workspaces/${id}`, accessToken, {
        method: 'DELETE',
    });
}