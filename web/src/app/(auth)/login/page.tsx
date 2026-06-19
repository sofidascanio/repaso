'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import styles from './page.module.css';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            router.push('/library');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <h1 className={styles.brandName}>Repaso</h1>
                    <p className={styles.brandTagline}>Acceso al Archivo Digital</p>
                </div>

                <div className={styles.card}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <Input label="Email institucional"
                            type="email"
                            placeholder="ejemplo@universidad.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon="school"
                            required/>

                        <Input label="Contraseña"
                            type="password"
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon="lock"
                            required/>

                        <div className={styles.forgotRow}>
                            <Link href="#" className={styles.forgotLink}>
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        {error && <p className={styles.errorMessage}>{error}</p>}

                        <Button type="submit"
                                variant="secondary"
                                fullWidth
                                isLoading={isLoading}>
                            Ingresar al Archivo
                        </Button>
                    </form>

                    <p className={styles.footer}>
                        ¿No tenes cuenta?{' '}
                        <Link href="/register" className={styles.footerLink}>
                            Registrate
                        </Link>
                    </p>
                </div>

                <div className={styles.quote}>
                    <div className={styles.quoteDivider} />
                    <blockquote>
                        <p className={styles.quoteText}>
                            "Las raíces de la educación son amargas, pero el fruto es dulce."
                        </p>
                        <cite className={styles.quoteCite}>- Aristóteles</cite>
                    </blockquote>
                </div>
            </div>
        </main>
    );
}