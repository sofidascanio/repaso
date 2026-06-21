const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export interface Profile {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    createdAt: string;
}

async function profileFetch<T>(
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

export async function getProfile(accessToken: string): Promise<Profile> {
    return profileFetch<Profile>('/profile', accessToken);
}

export async function updateProfile(
    accessToken: string,
    data: { name?: string; avatarUrl?: string },
): Promise<Profile> {
    return profileFetch<Profile>('/profile', accessToken, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function changePassword(
    accessToken: string,
    data: { currentPassword: string; newPassword: string },
): Promise<void> {
    return profileFetch<void>('/profile/password', accessToken, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deleteAccount(
    accessToken: string,
    password: string,
): Promise<void> {
    return profileFetch<void>('/profile', accessToken, {
        method: 'DELETE',
        body: JSON.stringify({ password }),
    });
}