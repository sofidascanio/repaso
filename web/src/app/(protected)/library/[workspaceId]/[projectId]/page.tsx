'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
    getCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    Collection,
} from '@/lib/collections';
import { CollectionCard } from '@/components/cards/CollectionCard';
import { CollectionModal } from '@/components/modals/CollectionModal';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { Button } from '@/components/ui/Button/Button';
import styles from './page.module.css';

export default function ProjectDetailPage() {
    const { workspaceId, projectId } = useParams<{ workspaceId: string; projectId: string }>();
    const { accessToken } = useAuth();
    const router = useRouter();

    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

    const loadCollections = useCallback(async () => {
        if (!accessToken || !projectId) return;
        try {
            const data = await getCollections(accessToken, projectId);
            setCollections(data);
        } catch (err) {
            console.error('Error cargando collections:', err);
        } finally {
            setIsLoading(false);
        }
    }, [accessToken, projectId]);

    useEffect(() => {
        loadCollections();
    }, [loadCollections]);

    async function handleCreate(data: {
        name: string;
        description?: string;
        iconEmoji?: string;
    }) {
        if (!accessToken) return;
        const created = await createCollection(accessToken, projectId, data);
        setCollections((prev) => [created, ...prev]);
    }

    async function handleUpdate(data: {
        name: string;
        description?: string;
        iconEmoji?: string;
    }) {
        if (!accessToken || !editingCollection) return;
        const updated = await updateCollection(
            accessToken,
            editingCollection.id,
            data,
        );
        setCollections((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c)),
        );
    }

    async function handleDelete(id: string) {
        if (!accessToken) return;
        if (!confirm('¿Seguro que queres eliminar esta collection?')) return;
        await deleteCollection(accessToken, id);
        setCollections((prev) => prev.filter((c) => c.id !== id));
    }

    function openCreateModal() {
        setEditingCollection(null);
        setIsModalOpen(true);
    }

    function openEditModal(collection: Collection) {
        setEditingCollection(collection);
        setIsModalOpen(true);
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
                        <Link href={`/library/${workspaceId}`}
                            className={styles.breadcrumbLink}>
                            Temas
                        </Link>
                        <span className={styles.breadcrumbSep}>›</span>
                        <span className={styles.breadcrumbCurrent}>Examenes</span>
                    </div>
                    <button className={styles.backBtn}
                            onClick={() => router.push(`/library/${workspaceId}`)}>
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.pageHeader}>
                    <div>
                        <h2 className={styles.pageTitle}>Examenes</h2>
                        <p className={styles.pageSubtitle}>
                            Agrupa tus flashcards por examenes
                        </p>
                    </div>
                    <Button variant="primary" onClick={openCreateModal}>
                        <span className="material-symbols-outlined">add</span>
                        Nuevo examen
                    </Button>
                </div>

                {isLoading ? (
                    <div className={styles.loadingState}>
                        <p>Cargando examenes...</p>
                    </div>
                ) : collections.length === 0 ? (
                    <EmptyState icon="style"
                                title="Sin examenes todavía"
                                description="Crea tu primer examen para empezar a agregar flashcards."
                                action={
                                    <Button variant="primary" onClick={openCreateModal}>
                                        Crear examen
                                    </Button>
                                }/>
                ) : (
                    <div className={styles.grid}>
                        {collections.map((collection) => (
                            <CollectionCard key={collection.id}
                                            collection={collection}
                                            workspaceId={workspaceId}
                                            projectId={projectId}
                                            onEdit={openEditModal}
                                            onDelete={handleDelete}/>
                        ))}
                    </div>
                )}
            </main>

            <CollectionModal isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSubmit={editingCollection ? handleUpdate : handleCreate}
                            collection={editingCollection}/>
        </div>
    );
}