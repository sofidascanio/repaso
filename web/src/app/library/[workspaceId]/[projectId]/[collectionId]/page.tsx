'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
    getFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    Flashcard,
} from '@/lib/flashcards';
import { FlashcardItem } from '@/components/flashcard/FlashcardItem/FlashcardItem';
import { FlashcardModal } from '@/components/flashcard/FlashcardModal/FlashcardModal';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { Button } from '@/components/ui/Button/Button';
import { ImportExportMenu } from '@/components/flashcard/ImportExportMenu/ImportExportMenu';
import { ImportResultModal } from '@/components/flashcard/ImportResultModal/ImportResultModal';
import { ImportResult } from '@/lib/import-export';
import styles from './page.module.css';

export default function CollectionDetailPage() {
    const { workspaceId, projectId, collectionId } = useParams<{
        workspaceId: string;
        projectId: string;
        collectionId: string;
    }>();
    const { accessToken } = useAuth();
    const router = useRouter();

    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);

    const [importResult, setImportResult] = useState<ImportResult | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const loadFlashcards = useCallback(async () => {
        if (!accessToken || !collectionId) return;
        try {
            const data = await getFlashcards(accessToken, collectionId);
            setFlashcards(data);
        } catch (err) {
            console.error('Error cargando flashcards:', err);
        } finally {
            setIsLoading(false);
        }
    }, [accessToken, collectionId]);

    useEffect(() => {
        loadFlashcards();
    }, [loadFlashcards]);

    async function handleCreate(data: {
        question: string;
        answer: string;
        tags?: string[];
    }) {
        if (!accessToken) return;
        const created = await createFlashcard(accessToken, collectionId, data);
        setFlashcards((prev) => [created, ...prev]);
    }

    async function handleUpdate(data: {
        question: string;
        answer: string;
        tags?: string[];
    }) {
        if (!accessToken || !editingFlashcard) return;
        const updated = await updateFlashcard(accessToken, editingFlashcard.id, data);
        setFlashcards((prev) =>
            prev.map((f) => (f.id === updated.id ? updated : f)),
        );
    }

    async function handleDelete(id: string) {
        if (!accessToken) return;
        if (!confirm('¿Seguro que queres eliminar esta flashcard?')) return;
        await deleteFlashcard(accessToken, id);
        setFlashcards((prev) => prev.filter((f) => f.id !== id));
    }

    async function handleToggleFavorite(flashcard: Flashcard) {
        if (!accessToken) return;
            const updated = await updateFlashcard(accessToken, flashcard.id, {
            isFavorite: !flashcard.isFavorite,
        });
        setFlashcards((prev) =>
            prev.map((f) => (f.id === updated.id ? updated : f)),
        );
    }

    async function handleToggleDifficult(flashcard: Flashcard) {
        if (!accessToken) return;
        const updated = await updateFlashcard(accessToken, flashcard.id, {
            isDifficult: !flashcard.isDifficult,
        });
        setFlashcards((prev) =>
            prev.map((f) => (f.id === updated.id ? updated : f)),
        );
    }

    function openCreateModal() {
        setEditingFlashcard(null);
        setIsModalOpen(true);
    }

    function openEditModal(flashcard: Flashcard) {
        setEditingFlashcard(flashcard);
        setIsModalOpen(true);
    }

    function handleImportSuccess(result: ImportResult) {
        setImportResult(result);
        setIsImportModalOpen(true);
        if (result.imported > 0) {
            loadFlashcards();
        }
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <div className={styles.breadcrumb}>
                        <Link href="/library" className={styles.breadcrumbLink}>
                            Biblioteca
                        </Link>
                        <span className={styles.breadcrumbSep}>›</span>
                        <Link href={`/library/${workspaceId}`} className={styles.breadcrumbLink}>
                            Projects
                        </Link>
                        <span className={styles.breadcrumbSep}>›</span>
                        <Link href={`/library/${workspaceId}/${projectId}`} className={styles.breadcrumbLink}>
                            Collections
                        </Link>
                        <span className={styles.breadcrumbSep}>›</span>
                        <span className={styles.breadcrumbCurrent}>Flashcards</span>
                    </div>
                    <button className={styles.backBtn}
                            onClick={() =>
                                router.push(`/library/${workspaceId}/${projectId}`)
                            }>
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <ImportExportMenu accessToken={accessToken!}
                                    collectionId={collectionId}
                                    collectionName="Mi colección"
                                    onImportSuccess={handleImportSuccess}/>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.pageHeader}>
                    <div>
                        <h2 className={styles.pageTitle}>Flashcards</h2>
                        <p className={styles.pageSubtitle}>
                            {flashcards.length > 0
                                ? `${flashcards.length} tarjeta${flashcards.length !== 1 ? 's' : ''} en esta colección`
                                : 'Tu colección de tarjetas de estudio'}
                        </p>
                    </div>
                    <div className={styles.headerActions}>
                        {flashcards.length > 0 && (
                            <>
                                <Button variant="ghost"
                                        onClick={() => router.push(`/study/${collectionId}?mode=due`)}>
                                    <span className="material-symbols-outlined">schedule</span>
                                    Pendientes
                                </Button>
                                <Button variant="ghost"
                                        onClick={() => router.push(`/study/${collectionId}?mode=classic`)}>
                                    <span className="material-symbols-outlined">play_arrow</span>
                                    Estudiar todo
                                </Button>
                            </>
                        )}
                        <Button variant="primary" onClick={openCreateModal}>
                            <span className="material-symbols-outlined">add</span>
                            Nueva flashcard
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className={styles.loadingState}>
                        <p>Cargando flashcards...</p>
                    </div>
                ) : flashcards.length === 0 ? (
                    <EmptyState icon="style"
                                title="No hay flashcards."
                                description="Crea tu primera flashcard para empezar a estudiar."
                                action={
                                    <Button variant="primary" onClick={openCreateModal}>
                                        Crear flashcard
                                    </Button>
                                }/>
                ) : (
                    <div className={styles.list}>
                        {flashcards.map((flashcard) => (
                            <FlashcardItem key={flashcard.id}
                                        flashcard={flashcard}
                                        onEdit={openEditModal}
                                        onDelete={handleDelete}
                                        onToggleFavorite={handleToggleFavorite}
                                        onToggleDifficult={handleToggleDifficult}/>
                        ))}
                    </div>
                )}
            </main>

            <ImportResultModal isOpen={isImportModalOpen}
                                onClose={() => setIsImportModalOpen(false)}
                                result={importResult}/>

            <FlashcardModal isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSubmit={editingFlashcard ? handleUpdate : handleCreate}
                            flashcard={editingFlashcard}/>
        </div>
    );
}