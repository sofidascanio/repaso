'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getOverviewStats, OverviewStats } from '@/lib/stats';
import { StatCard } from '@/components/stats/StatCard/StatCard';
import { ActivityChart } from '@/components/stats/ActivityChart/ActivityChart';
import { ResultsBreakdown } from '@/components/stats/ResultsBreakdown/ResultsBreakdown';
import styles from './page.module.css';

export default function StatsPage() {
    const { accessToken } = useAuth();
    const [stats, setStats] = useState<OverviewStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadStats = useCallback(async () => {
        if (!accessToken) return;
        try {
            const data = await getOverviewStats(accessToken);
            setStats(data);
        } catch (err) {
            console.error('Error cargando estadísticas:', err);
        } finally {
            setIsLoading(false);
        }
    }, [accessToken]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

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
                        <span className={styles.navActive}>Progreso</span>
                    </nav>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.pageHeader}>
                    <h2 className={styles.pageTitle}>Tu Progreso</h2>
                    <p className={styles.pageSubtitle}>
                        Seguimiento de tu disciplina académica
                    </p>
                </div>

                {isLoading ? (
                        <div className={styles.loading}>Cargando estadísticas...</div>
                ) : !stats ? (
                    <div className={styles.loading}>
                        No se pudieron cargar las estadísticas.
                    </div>
                ) : (
                    <>
                        {/* metricas principales */}
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>Resumen General</h3>
                            <div className={styles.statsGrid}>
                                <StatCard label="Racha actual"
                                          value={`${stats.streak} ${stats.streak === 1 ? 'día' : 'días'}`}
                                          icon="local_fire_department"
                                          accent="secondary"/>
                                <StatCard label="Pendientes hoy"
                                          value={stats.dueToday}
                                          icon="schedule"
                                          accent={stats.dueToday > 0 ? 'error' : 'tertiary'}/>
                                <StatCard label="Repasadas hoy"
                                          value={stats.reviewsToday}
                                          icon="check_circle"
                                          accent="primary"/>
                                <StatCard label="Precisión"
                                          value={`${stats.accuracyRate}%`}
                                          icon="analytics"
                                          accent="tertiary"/>
                            </div>
                        </section>

                        {/* actividad ultimos 7 dias */}
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>Actividad en los últimos 7 días</h3>
                            <div className={styles.card}>
                                <ActivityChart data={stats.reviewsLast7Days} />
                            </div>
                        </section>

                        {/* desglose por resultado */}
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>Resultados</h3>
                            <div className={styles.card}>
                                <ResultsBreakdown reviewsByResult={stats.reviewsByResult}
                                                total={stats.totalReviews}/>
                            </div>
                        </section>

                        {/* totales del archivo */}
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>Tu Archivo</h3>
                            <div className={styles.statsGrid}>
                                <StatCard label="Materias"
                                          value={stats.totalWorkspaces}
                                          icon="workspaces"
                                          accent="primary"/>
                                <StatCard label="Temas"
                                          value={stats.totalProjects}
                                          icon="folder"
                                          accent="primary"/>
                                <StatCard label="Examenes"
                                          value={stats.totalCollections}
                                          icon="style"
                                          accent="primary"/>
                                <StatCard label="Flashcards"
                                          value={stats.totalFlashcards}
                                          icon="library_books"
                                          accent="primary"/>
                            </div>
                        </section>

                        {/* total de reviews */}
                        <section className={styles.section}>
                            <div className={styles.totalReviews}>
                                <span className={`material-symbols-outlined ${styles.totalIcon}`}>
                                    history_edu
                                </span>
                                <div>
                                    <p className={styles.totalNumber}>{stats.totalReviews}</p>
                                    <p className={styles.totalLabel}>
                                        repasos totales en tu historial
                                    </p>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}