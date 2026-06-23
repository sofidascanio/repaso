'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getFlashcardsForStudy, Flashcard } from '@/lib/flashcards';
import { getDueFlashcards, submitReview, ReviewResult } from '@/lib/reviews';
import styles from './page.module.css';

type StudyMode = 'classic' | 'due';

const REVIEW_BUTTONS: {
    result: ReviewResult;
    label: string;
    sublabel: string;
    styleKey: string;
}[] = [
    { result: 'AGAIN', label: 'Otra vez', sublabel: 'No lo recordé', styleKey: 'again' },
    { result: 'HARD', label: 'Difícil', sublabel: 'Con esfuerzo', styleKey: 'hard' },
    { result: 'GOOD', label: 'Bien', sublabel: 'Lo recordé', styleKey: 'good' },
    { result: 'EASY', label: 'Fácil', sublabel: 'Sin esfuerzo', styleKey: 'easy' },
];

export default function StudyPage() {
    const { collectionId } = useParams<{ collectionId: string }>();
    const searchParams = useSearchParams();
    const { accessToken } = useAuth();
    const router = useRouter();

    const mode: StudyMode = (searchParams.get('mode') as StudyMode) ?? 'classic';

    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isFinished, setIsFinished] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stats, setStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 });

    const loadFlashcards = useCallback(async () => {
        if (!accessToken || !collectionId) return;
        try {
            const data =
                mode === 'due'
                ? await getDueFlashcards(accessToken, collectionId)
                : await getFlashcardsForStudy(accessToken, collectionId);
            setFlashcards(data);
        } catch (err) {
            console.error('Error cargando flashcards:', err);
        } finally {
            setIsLoading(false);
        }
    }, [accessToken, collectionId, mode]);

    useEffect(() => {
        loadFlashcards();
    }, [loadFlashcards]);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.code === 'Space') {
                e.preventDefault();
                if (!isFlipped) setIsFlipped(true);
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isFlipped]);

    async function handleReview(result: ReviewResult) {
        if (!accessToken || isSubmitting) return;
        setIsSubmitting(true);

        const current = flashcards[currentIndex];

        try {
            await submitReview(accessToken, current.id, result);
        } catch (err) {
            console.error('Error registrando review:', err);
        }

        // actualiza estadisticas
        setStats((prev) => ({
            ...prev,
            [result.toLowerCase()]: prev[result.toLowerCase() as keyof typeof prev] + 1,
        }));

        // si es 'again', mueve la tarjeta al final del mazo
        if (result === 'AGAIN') {
            setFlashcards((prev) => {
                const updated = [...prev];
                const card = updated.splice(currentIndex, 1)[0];
                updated.push(card);
                return updated;
            });
            setIsFlipped(false);
            setIsSubmitting(false);
            return;
        }

        if (currentIndex + 1 >= flashcards.length) {
            setIsFinished(true);
        } else {
            setIsFlipped(false);
            setTimeout(() => {
                setCurrentIndex((prev) => prev + 1);
                setIsSubmitting(false);
            }, 150);
            return;
        }

        setIsSubmitting(false);
    }

    function handleRestart() {
        setCurrentIndex(0);
        setIsFlipped(false);
        setIsFinished(false);
        setStats({ again: 0, hard: 0, good: 0, easy: 0 });
        loadFlashcards();
    }

    const progress =
        flashcards.length > 0
            ? (currentIndex / flashcards.length) * 100
            : 0;

    if (isLoading) {
        return (
            <div className={styles.loadingPage}>
                <p>Preparando el estudio...</p>
            </div>
        );
    }

    if (flashcards.length === 0) {
        return (
            <div className={styles.emptyPage}>
                <span className={`material-symbols-outlined ${styles.emptyIcon}`}>
                    check_circle
                </span>
                <h2 className={styles.emptyTitle}>
                    {mode === 'due'
                        ? '¡Todo al día!'
                        : 'Esta colección no tiene flashcards.'}
                </h2>
                <p className={styles.emptySubtitle}>
                    {mode === 'due'
                        ? 'No tenes tarjetas pendientes para hoy.'
                        : 'Agrega flashcards para empezar a estudiar.'}
                </p>
                <button onClick={() => router.back()} className={styles.backLink}>
                    ← Volver
                </button>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className={styles.finishedPage}>
                <div className={styles.finishedCard}>
                    <span className={styles.finishedIcon}>🎓</span>
                    <h2 className={styles.finishedTitle}>¡Sesión completada!</h2>
                    <p className={styles.finishedSubtitle}>
                        Repasaste {currentIndex + 1} tarjeta
                        {currentIndex + 1 !== 1 ? 's' : ''}.
                    </p>

                    <div className={styles.statsGrid}>
                        <div className={`${styles.statItem} ${styles.statAgain}`}>
                            <span className={styles.statNumber}>{stats.again}</span>
                            <span className={styles.statLabel}>Otra vez</span>
                            </div>
                        <div className={`${styles.statItem} ${styles.statHard}`}>
                            <span className={styles.statNumber}>{stats.hard}</span>
                            <span className={styles.statLabel}>Difícil</span>
                        </div>
                        <div className={`${styles.statItem} ${styles.statGood}`}>
                            <span className={styles.statNumber}>{stats.good}</span>
                            <span className={styles.statLabel}>Bien</span>
                        </div>
                        <div className={`${styles.statItem} ${styles.statEasy}`}>
                            <span className={styles.statNumber}>{stats.easy}</span>
                            <span className={styles.statLabel}>Fácil</span>
                        </div>
                    </div>

                    <div className={styles.finishedActions}>
                        <button className={styles.restartBtn} onClick={handleRestart}>
                            Estudiar de nuevo
                        </button>
                        <button className={styles.backLink}
                                onClick={() => router.back()}>
                            Volver a la colección
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const current = flashcards[currentIndex];

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <button className={styles.exitBtn} onClick={() => router.back()}>
                <span className="material-symbols-outlined">close</span>
                </button>
                <div className={styles.progressWrapper}>
                <div className={styles.progressCounter}>
                    <span className={styles.progressCurrent}>{currentIndex + 1}</span>
                    <span className={styles.progressTotal}>
                    {' '}de {flashcards.length}
                    </span>
                </div>
                <div className={styles.progressBar}>
                    <div
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                    />
                </div>
                </div>
                <div className={styles.modeTag}>
                {mode === 'due' ? 'Pendientes' : 'Clásico'}
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.cardContainer} onClick={() => !isFlipped && setIsFlipped(true)}>
                    <div className={`${styles.cardInner} ${isFlipped ? styles.flipped : ''}`}>
                        <div className={styles.cardFront}>
                            <span className={`material-symbols-outlined ${styles.cardIcon}`}>
                                school
                            </span>
                            <p className={styles.cardQuestion}>{current.question}</p>
                            {current.tags.length > 0 && (
                                <div className={styles.cardTags}>
                                    {current.tags.map((tag) => (
                                        <span key={tag} className={styles.cardTag}>{tag}</span>
                                    ))}
                                </div>
                            )}
                            <div className={styles.flipHint}>
                                <span className="material-symbols-outlined">touch_app</span>
                                <span>Clic o Espacio para revelar</span>
                            </div>
                        </div>

                        <div className={styles.cardBack}>
                            <span className={`material-symbols-outlined ${styles.cardIconBack}`}>
                                verified
                            </span>
                            <p className={styles.cardAnswer}>{current.answer}</p>
                        </div>
                    </div>
                </div>

                <div className={`${styles.controls} ${isFlipped ? styles.controlsVisible : ''}`}>
                    {REVIEW_BUTTONS.map(({ result, label, sublabel, styleKey }) => (
                        <button key={result}
                                className={`${styles.reviewBtn} ${styles[`btn_${styleKey}`]}`}
                                onClick={() => handleReview(result)}
                                disabled={isSubmitting}>
                            <span className={styles.reviewBtnLabel}>{label}</span>
                            <span className={styles.reviewBtnSub}>{sublabel}</span>
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}