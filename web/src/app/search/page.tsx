'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { searchAll, SearchResults } from '@/lib/search';
import { SearchBar } from '@/components/ui/SearchBar/SearchBar';
import styles from './page.module.css';

function highlight(text: string, query: string): React.ReactNode {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
        regex.test(part) ? (
            <mark key={i} className={styles.highlight}>
                {part}
            </mark>
        ) : (
            part
        ),
    );
}

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { accessToken } = useAuth();

    const initialQuery = searchParams.get('q') ?? '';
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<SearchResults | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const runSearch = useCallback(
        async (q: string) => {
            if (!accessToken || q.trim().length < 2) {
                setResults(null);
                return;
            }

            setIsLoading(true);
            try {
                const data = await searchAll(accessToken, q);
                setResults(data);
                router.replace(
                    `/search?q=${encodeURIComponent(q)}`,
                    { scroll: false },
                );
            } catch (err) {
                console.error('Error en búsqueda:', err);
            } finally {
                setIsLoading(false);
            }
        },
        [accessToken, router],
    );

    useEffect(() => {
        if (initialQuery.length >= 2) {
            runSearch(initialQuery);
        }
    }, []);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <Link href="/library" className={styles.logo}>
                        Repaso
                    </Link>
                <div className={styles.searchWrapper}>
                    <SearchBar initialQuery={initialQuery}
                                placeholder="Buscar workspaces, projects, flashcards..."
                                onSearch={(q) => {
                                    setQuery(q);
                                    runSearch(q);
                                }}/>
                </div>
                <Link href="/library" className={styles.cancelLink}>
                    Cancelar
                </Link>
                </div>
            </header>

            <main className={styles.main}>
                {isLoading ? (
                    <div className={styles.status}>Buscando...</div>
                ) : !results ? (
                    <div className={styles.status}>
                        <span className={`material-symbols-outlined ${styles.statusIcon}`}>
                            search
                        </span>
                        <p>Escribi al menos 2 caracteres para buscar.</p>
                    </div>
                ) : results.total === 0 ? (
                    <div className={styles.status}>
                        <span className={`material-symbols-outlined ${styles.statusIcon}`}>
                            search_off
                        </span>
                        <p>
                            Sin resultados para{' '}
                            <strong>&quot;{query}&quot;</strong>.
                        </p>
                    </div>
                ) : (
                    <div className={styles.results}>
                        <p className={styles.resultsCount}>
                            {results.total} resultado{results.total !== 1 ? 's' : ''} para{' '}
                            <strong>&quot;{query}&quot;</strong>
                        </p>

                        {/* workspaces */}
                        {results.workspaces.length > 0 && (
                            <section className={styles.section}>
                                <h3 className={styles.sectionTitle}>
                                    <span className="material-symbols-outlined">workspaces</span>
                                    Workspaces
                                </h3>
                                <div className={styles.list}>
                                    {results.workspaces.map((w) => (
                                        <Link key={w.id}
                                            href={`/library/${w.id}`}
                                            className={styles.resultItem}>
                                            <span className={styles.resultEmoji}>
                                                {w.iconEmoji ?? '📚'}
                                            </span>
                                            <div className={styles.resultBody}>
                                                <p className={styles.resultName}>
                                                    {highlight(w.name, query)}
                                                </p>
                                                {w.description && (
                                                    <p className={styles.resultDesc}>
                                                        {highlight(w.description, query)}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={`material-symbols-outlined ${styles.resultArrow}`}>
                                                arrow_forward
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* projects */}
                        {results.projects.length > 0 && (
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <span className="material-symbols-outlined">folder</span>
                                Projects
                            </h3>
                            <div className={styles.list}>
                                {results.projects.map((p) => (
                                    <Link key={p.id}
                                        href={`/library/${p.workspaceId}/${p.id}`}
                                        className={styles.resultItem}>
                                        <span className={styles.resultEmoji}>
                                            {p.iconEmoji ?? '📁'}
                                        </span>
                                        <div className={styles.resultBody}>
                                            <p className={styles.resultName}>
                                                {highlight(p.name, query)}
                                            </p>
                                            {p.description && (
                                                <p className={styles.resultDesc}>
                                                    {highlight(p.description, query)}
                                                </p>
                                            )}
                                        </div>
                                        <span className={`material-symbols-outlined ${styles.resultArrow}`}>
                                            arrow_forward
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                        )}

                        {/* collections */}
                        {results.collections.length > 0 && (
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <span className="material-symbols-outlined">style</span>
                                Colecciones
                            </h3>
                            <div className={styles.list}>
                                {results.collections.map((c) => (
                                    <Link key={c.id}
                                        href={`/library/${c.workspaceId}/${c.projectId}/${c.id}`}
                                        className={styles.resultItem}>
                                        <span className={styles.resultEmoji}>
                                            {c.iconEmoji ?? '🗂️'}
                                        </span>
                                        <div className={styles.resultBody}>
                                            <p className={styles.resultName}>
                                                {highlight(c.name, query)}
                                            </p>
                                            {c.description && (
                                                <p className={styles.resultDesc}>
                                                    {highlight(c.description, query)}
                                                </p>
                                            )}
                                        </div>
                                        <span className={`material-symbols-outlined ${styles.resultArrow}`}>
                                            arrow_forward
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                        )}

                        {/* flashcards */}
                        {results.flashcards.length > 0 && (
                            <section className={styles.section}>
                                <h3 className={styles.sectionTitle}>
                                <span className="material-symbols-outlined">library_books</span>
                                Flashcards
                                </h3>
                                <div className={styles.list}>
                                    {results.flashcards.map((f) => (
                                        <Link key={f.id}
                                            href={`/library/${f.workspaceId}/${f.projectId}/${f.collectionId}`}
                                            className={styles.resultItem}>
                                            <span className={`material-symbols-outlined ${styles.flashcardIcon}`}>
                                                style
                                            </span>
                                            <div className={styles.resultBody}>
                                                <p className={styles.resultName}>
                                                    {highlight(f.question, query)}
                                                </p>
                                                <p className={styles.resultDesc}>
                                                    {highlight(f.answer, query)}
                                                </p>
                                                {f.tags.length > 0 && (
                                                    <div className={styles.tags}>
                                                        {f.tags.map((tag) => (
                                                            <span key={tag} className={styles.tag}>
                                                                {highlight(tag, query)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <span className={`material-symbols-outlined ${styles.resultArrow}`}>
                                                arrow_forward
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense>
            <SearchContent />
        </Suspense>
    );
}