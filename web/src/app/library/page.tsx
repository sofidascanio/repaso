'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
    getWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    Workspace,
} from '@/lib/workspaces';
import { WorkspaceCard } from '@/components/workspace/WorkspaceCard/WorkspaceCard';
import { WorkspaceModal } from '@/components/workspace/WorkspaceModal/WorkspaceModal';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { Button } from '@/components/ui/Button/Button';
import styles from './page.module.css';

export default function LibraryPage() {
    const { accessToken, user, logout } = useAuth();

    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);

    const loadWorkspaces = useCallback(async () => {
        if (!accessToken) return;
        try {
            const data = await getWorkspaces(accessToken);
            setWorkspaces(data);
        } catch (err) {
            console.error('Error cargando workspaces:', err);
        } finally {
            setIsLoading(false);
        }
    }, [accessToken]);

    useEffect(() => {
        loadWorkspaces();
    }, [loadWorkspaces]);

    async function handleCreate(data: {
        name: string;
        description?: string;
        iconEmoji?: string;
    }) {
        if (!accessToken) return;
        const created = await createWorkspace(accessToken, data);
        setWorkspaces((prev) => [created, ...prev]);
    }

    async function handleUpdate(data: {
        name: string;
        description?: string;
        iconEmoji?: string;
    }) {
        if (!accessToken || !editingWorkspace) return;
        const updated = await updateWorkspace(accessToken, editingWorkspace.id, data);
        setWorkspaces((prev) =>
            prev.map((w) => (w.id === updated.id ? updated : w)),
        );
    }

    async function handleDelete(id: string) {
        if (!accessToken) return;
        if (!confirm('¿Seguro que queres eliminar este workspace?')) return;
        await deleteWorkspace(accessToken, id);
        setWorkspaces((prev) => prev.filter((w) => w.id !== id));
    }

    function openCreateModal() {
        setEditingWorkspace(null);
        setIsModalOpen(true);
    }

    function openEditModal(workspace: Workspace) {
        setEditingWorkspace(workspace);
        setIsModalOpen(true);
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <h1 className={styles.logo}>Repaso</h1>
                    <nav className={styles.nav}>
                        <span className={styles.navActive}>Biblioteca</span>
                        <Link href="/stats" className={styles.navLink}>
                            Progreso
                        </Link>
                    </nav>
                    <div className={styles.headerActions}>
                        <span className={styles.userName}>{user?.name}</span>
                        <button className={styles.logoutBtn} onClick={logout}>
                        <span className="material-symbols-outlined">logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.pageHeader}>
                    <div>
                        <h2 className={styles.pageTitle}>Biblioteca</h2>
                        <p className={styles.pageSubtitle}>
                            Tus colecciones de conocimiento
                        </p>
                    </div>
                    <Button variant="primary" onClick={openCreateModal}>
                        <span className="material-symbols-outlined">add</span>
                        Nuevo workspace
                    </Button>
                </div>

                {isLoading ? (
                    <div className={styles.loadingState}>
                        <p>Cargando la biblioteca...</p>
                    </div>
                ) : workspaces.length === 0 ? (
                    <EmptyState icon="library_books"
                                title="Tu biblioteca está vacía"
                                description="Crea tu primer workspace para empezar a organizar tu conocimiento."
                                action={
                                    <Button variant="primary" onClick={openCreateModal}>
                                        Crear workspace
                                    </Button>
                                }
                    />
                ) : (
                    <div className={styles.grid}>
                        {workspaces.map((workspace) => (
                        <WorkspaceCard key={workspace.id}
                                    workspace={workspace}
                                    onEdit={openEditModal}
                                    onDelete={handleDelete}/>
                        ))}
                    </div>
                )}
            </main>

            <WorkspaceModal isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSubmit={editingWorkspace ? handleUpdate : handleCreate}
                            workspace={editingWorkspace}/>
        </div>
    );
}