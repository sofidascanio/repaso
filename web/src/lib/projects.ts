const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export interface Project {
    id: string;
    name: string;
    description: string | null;
    iconEmoji: string | null;
    workspaceId: string;
    createdAt: string;
    updatedAt: string;
}

async function projectFetch<T>(
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

export async function getProjects(
    accessToken: string,
    workspaceId: string,
): Promise<Project[]> {
    return projectFetch<Project[]>(
        `/workspaces/${workspaceId}/projects`,
        accessToken,
    );
}

export async function createProject(
    accessToken: string,
    workspaceId: string,
    data: { name: string; description?: string; iconEmoji?: string },
): Promise<Project> {
    return projectFetch<Project>(
        `/workspaces/${workspaceId}/projects`,
        accessToken,
        { method: 'POST', body: JSON.stringify(data) },
    );
}

export async function updateProject(
    accessToken: string,
    id: string,
    data: { name?: string; description?: string; iconEmoji?: string },
): Promise<Project> {
    return projectFetch<Project>(`/projects/${id}`, accessToken, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deleteProject(
    accessToken: string,
    id: string,
): Promise<void> {
    return projectFetch<void>(`/projects/${id}`, accessToken, {
        method: 'DELETE',
    });
}