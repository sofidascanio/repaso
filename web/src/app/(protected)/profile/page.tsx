'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    Profile,
} from '@/lib/profile';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import styles from './page.module.css';

export default function ProfilePage() {
    const { accessToken, logout } = useAuth();
    const router = useRouter();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // secciones
    const [activeSection, setActiveSection] = useState <'profile' | 'password' | 'danger' > ('profile');

    // profile form
    const [name, setName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState('');
    const [profileError, setProfileError] = useState('');

    // password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // delete form
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const loadProfile = useCallback(async () => {
        if (!accessToken) return;
        try {
            const data = await getProfile(accessToken);
            setProfile(data);
            setName(data.name);
            setAvatarUrl(data.avatarUrl ?? '');
        } catch (err) {
            console.error('Error cargando perfil:', err);
        } finally {
            setIsLoading(false);
        }
    }, [accessToken]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    async function handleUpdateProfile(e: React.FormEvent) {
        e.preventDefault();
        if (!accessToken) return;
        setProfileError('');
        setProfileSuccess('');
        setProfileLoading(true);

        try {
            const updated = await updateProfile(accessToken, {
                name: name || undefined,
                avatarUrl: avatarUrl || undefined,
            });
            setProfile(updated);
            setProfileSuccess('Perfil actualizado correctamente.');
        } catch (err) {
            setProfileError(
                err instanceof Error ? err.message : 'Error al actualizar el perfil',
            );
        } finally {
            setProfileLoading(false);
        }
    }

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();
        if (!accessToken) return;
        setPasswordError('');
        setPasswordSuccess('');

        if (newPassword !== confirmPassword) {
            setPasswordError('Las contraseñas nuevas no coinciden.');
            return;
        }

        setPasswordLoading(true);

        try {
            await changePassword(accessToken, { currentPassword, newPassword });
            setPasswordSuccess('Contraseña actualizada. Tu sesión se cerrará en otros dispositivos.', );
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setPasswordError(
                err instanceof Error ? err.message : 'Error al cambiar la contraseña',
            );
        } finally {
            setPasswordLoading(false);
        }
    }

    async function handleDeleteAccount(e: React.FormEvent) {
        e.preventDefault();
        if (!accessToken) return;
        setDeleteError('');

        if (deleteConfirm !== 'ELIMINAR') {
            setDeleteError('Escribí ELIMINAR para confirmar.');
            return;
        }

        setDeleteLoading(true);

        try {
            await deleteAccount(accessToken, deletePassword);
            await logout();
            router.push('/login');
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : 'Error al eliminar la cuenta',);
            setDeleteLoading(false);
        }
    }

    const SECTIONS = [
        { key: 'profile', label: 'Perfil', icon: 'person' },
        { key: 'password', label: 'Contraseña', icon: 'lock' },
        { key: 'danger', label: 'Zona de peligro', icon: 'warning' },
    ] as const;

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <Link href="/library" className={styles.logo}>
                        Repaso
                    </Link>
                    <nav className={styles.nav}>
                        <Link href="/library" className={styles.navLink}>
                            Biblioteca
                        </Link>
                        <Link href="/stats" className={styles.navLink}>
                            Progreso
                        </Link>
                        <span className={styles.navActive}>Perfil</span>
                    </nav>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.pageHeader}>
                    <h2 className={styles.pageTitle}>Configuración</h2>
                    <p className={styles.pageSubtitle}>
                        Administra tu cuenta y preferencias
                    </p>
                </div>

                {isLoading ? (
                    <div className={styles.loading}>Cargando perfil...</div>
                ) : (
                    <div className={styles.layout}>
                        {/* sidebar */}
                        <aside className={styles.sidebar}>
                            <div className={styles.avatarSection}>
                                <div className={styles.avatar}>
                                    {profile?.avatarUrl ? (
                                        <img src={profile.avatarUrl}
                                            alt={profile.name}
                                            className={styles.avatarImg}/>
                                    ) : (
                                        <span className={`material-symbols-outlined ${styles.avatarIcon}`}>
                                            account_circle
                                        </span>
                                    )}
                                </div>
                                <p className={styles.avatarName}>{profile?.name}</p>
                                <p className={styles.avatarEmail}>{profile?.email}</p>
                                <p className={styles.avatarSince}>
                                    Miembro desde{' '}
                                    {profile
                                        ? new Date(profile.createdAt).toLocaleDateString('es-AR', {
                                            year: 'numeric',
                                            month: 'long',
                                        })
                                    : ''}
                                </p>
                            </div>

                            <nav className={styles.sideNav}>
                                {SECTIONS.map(({ key, label, icon }) => (
                                    <button key={key}
                                            className={`${styles.sideNavItem} ${activeSection === key ? styles.sideNavActive : ''} ${key === 'danger' ? styles.sideNavDanger : ''}`}
                                            onClick={() => setActiveSection(key)}>
                                        <span className="material-symbols-outlined">{icon}</span>
                                        {label}
                                    </button>
                                ))}
                            </nav>
                        </aside>

                        {/* content */}
                        <div className={styles.content}>
                            {/* perfil */}
                            {activeSection === 'profile' && (
                                <section className={styles.section}>
                                    <h3 className={styles.sectionTitle}>Información personal</h3>
                                    <p className={styles.sectionDesc}>
                                        Actualizá tu nombre y foto de perfil.
                                    </p>

                                    <form onSubmit={handleUpdateProfile}
                                        className={styles.form}>
                                        <Input label="Nombre completo"
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                icon="person"
                                                required/>

                                        <Input label="URL de avatar (opcional)"
                                                type="url"
                                                placeholder="https://..."
                                                value={avatarUrl}
                                                onChange={(e) => setAvatarUrl(e.target.value)}
                                                icon="image"/>

                                        <div className={styles.readOnlyField}>
                                            <span className={styles.readOnlyLabel}>Email</span>
                                            <span className={styles.readOnlyValue}>
                                                {profile?.email}
                                            </span>
                                            <span className={styles.readOnlyNote}>
                                                El email no se puede modificar.
                                            </span>
                                        </div>

                                        {profileError && (
                                            <p className={styles.errorMsg}>{profileError}</p>
                                        )}
                                        {profileSuccess && (
                                            <p className={styles.successMsg}>{profileSuccess}</p>
                                        )}

                                        <div className={styles.formActions}>
                                            <Button type="submit"
                                                    variant="primary"
                                                    isLoading={profileLoading}>
                                                Guardar cambios
                                            </Button>
                                        </div>
                                    </form>
                                </section>
                            )}

                            {/* contraseña */}
                            {activeSection === 'password' && (
                                <section className={styles.section}>
                                    <h3 className={styles.sectionTitle}>Cambiar contraseña</h3>
                                    <p className={styles.sectionDesc}>
                                        Al cambiar tu contraseña se cerrarán las sesiones en otros
                                        dispositivos.
                                    </p>

                                    <form onSubmit={handleChangePassword}
                                        className={styles.form}>
                                        <Input  label="Contraseña actual"
                                                type="password"
                                                placeholder="••••••••••••"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                icon="lock"
                                                required/>

                                        <Input  label="Nueva contraseña"
                                                type="password"
                                                placeholder="Mínimo 8 caracteres"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                icon="lock_reset"
                                                required/>

                                        <Input label="Confirmar nueva contraseña"
                                                type="password"
                                                placeholder="••••••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                icon="check"
                                                required/>

                                        {passwordError && (
                                            <p className={styles.errorMsg}>{passwordError}</p>
                                        )}
                                        {passwordSuccess && (
                                            <p className={styles.successMsg}>{passwordSuccess}</p>
                                        )}

                                        <div className={styles.formActions}>
                                            <Button type="submit"
                                                    variant="primary"
                                                    isLoading={passwordLoading}>
                                                Cambiar contraseña
                                            </Button>
                                        </div>
                                    </form>
                                </section>
                            )}

                            {/* danger zone */}
                            {activeSection === 'danger' && (
                                <section className={styles.section}>
                                    <h3 className={`${styles.sectionTitle} ${styles.dangerTitle}`}>
                                        Eliminar cuenta
                                    </h3>
                                    <p className={styles.sectionDesc}>
                                        Esta acción es <strong>permanente e irreversible</strong>.
                                        Se eliminarán todas tus materias, temas, examenes,
                                        flashcards y el historial de repasos.
                                    </p>

                                    <div className={styles.dangerCard}>
                                        <form onSubmit={handleDeleteAccount}
                                            className={styles.form}>
                                            <Input  label="Contraseña actual"
                                                    type="password"
                                                    placeholder="Confirmá tu identidad"
                                                    value={deletePassword}
                                                    onChange={(e) => setDeletePassword(e.target.value)}
                                                    icon="lock"
                                                    required/>

                                            <div className={styles.confirmWrapper}>
                                                <label className={styles.confirmLabel}>
                                                    Escribi <strong>ELIMINAR</strong> para confirmar
                                                </label>
                                                <input  className={styles.confirmInput}
                                                        type="text"
                                                        placeholder="ELIMINAR"
                                                        value={deleteConfirm}
                                                        onChange={(e) => setDeleteConfirm(e.target.value)}
                                                        required/>
                                            </div>

                                            {deleteError && (
                                                <p className={styles.errorMsg}>{deleteError}</p>
                                            )}

                                            <div className={styles.formActions}>
                                                <Button type="submit"
                                                        variant="ghost"
                                                        isLoading={deleteLoading}
                                                        className={styles.deleteBtn}>
                                                    Eliminar mi cuenta permanentemente
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}