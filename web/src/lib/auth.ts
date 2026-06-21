const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    createdAt: string;
}

export interface AuthResponse {
    user: AuthUser;
    accessToken: string;
}

async function authFetch<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? `HTTP ${response.status}`);
    }

    return response.json();
}

export async function registerUser(data: {
    name: string;
    email: string;
    password: string;
}): Promise<AuthResponse> {
    return authFetch<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function loginUser(data: {
    email: string;
    password: string;
}): Promise<AuthResponse> {
    return authFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function logoutUser(accessToken: string): Promise<void> {
    await authFetch('/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
    });
}

export async function refreshAccessToken(): Promise<{ accessToken: string }> {
    return authFetch<{ accessToken: string }>('/auth/refresh', {
        method: 'POST',
    });
}

export async function getMe(accessToken: string): Promise<AuthUser> {
    return authFetch<AuthUser>('/auth/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
}