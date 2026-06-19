'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from 'react';
import {
    AuthUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    getMe,
} from '@/lib/auth';

interface AuthContextValue {
    user: AuthUser | null;
    accessToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // cuando carga la app, intenta recuperar la sesion via refresh token (cookie)
    useEffect(() => {
        async function restoreSession() {
            try {
                const { accessToken: token } = await refreshAccessToken();
                const me = await getMe(token);
                setAccessToken(token);
                setUser(me);
            } catch {
                // no hay sesion activa
            } finally {
                setIsLoading(false);
            }
        }

        restoreSession();
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const { user, accessToken: token } = await loginUser({ email, password });
        setUser(user);
        setAccessToken(token);
    }, []);

    const register = useCallback(
        async (name: string, email: string, password: string) => {
            const { user, accessToken: token } = await registerUser({
                name,
                email,
                password,
            });
            setUser(user);
            setAccessToken(token);
        },
        [],
    );

    const logout = useCallback(async () => {
        try {
            await logoutUser();
        } finally {
            setUser(null);
            setAccessToken(null);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{ user,
                     accessToken,
                     isLoading,
                     isAuthenticated: !!user,
                     login,
                     register,
                     logout,
                }}
            >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return ctx;
}