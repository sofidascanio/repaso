'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import styles from './page.module.css';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await register(name, email, password);
            router.push('/library');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al registrarse');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <h1 className={styles.brandName}>Repaso</h1>
                    <p className={styles.brandTagline}>Matriculación</p>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Crear cuenta</h2>
                        <p className={styles.cardSubtitle}>
                            Ingresa a los salones del estudio disciplinado.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <Input label="Nombre completo"
                            type="text"
                            placeholder="Juan Perez"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            icon="person"
                            required/>

                        <Input label="Email"
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

                        {error && <p className={styles.errorMessage}>{error}</p>}

                        <Button type="submit"
                                variant="primary"
                                fullWidth
                                isLoading={isLoading}>
                            Comenzar el viaje
                        </Button>
                    </form>

                    <p className={styles.footer}>
                        ¿Ya tenes cuenta?{' '}
                        <Link href="/login" className={styles.footerLink}>
                            Iniciá sesión
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}