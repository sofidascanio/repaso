'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    Project,
} from '@/lib/projects';
import { ProjectCard } from '@/components/project/ProjectCard/ProjectCard';
import { ProjectModal } from '@/components/project/ProjectModal/ProjectModal';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { Button } from '@/components/ui/Button/Button';
import styles from './page.module.css';

export default function WorkspaceDetailPage() {
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const { accessToken } = useAuth();
    const router = useRouter();

    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const loadProjects = useCallback(async () => {
        if (!accessToken || !workspaceId) return;
        try {
            const data = await getProjects(accessToken, workspaceId);
            setProjects(data);
        } catch (err) {
            console.error('Error cargando projects:', err);
        } finally {
            setIsLoading(false);
        }
    }, [accessToken, workspaceId]);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    async function handleCreate(data: {
        name: string;
        description?: string;
        iconEmoji?: string;
    }) {
        if (!accessToken) return;
        const created = await createProject(accessToken, workspaceId, data);
        setProjects((prev) => [created, ...prev]);
    }

    async function handleUpdate(data: {
        name: string;
        description?: string;
        iconEmoji?: string;
    }) {
        if (!accessToken || !editingProject) return;
        const updated = await updateProject(accessToken, editingProject.id, data);
        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }

    async function handleDelete(id: string) {
        if (!accessToken) return;
        if (!confirm('¿Seguro que queres eliminar este project?')) return;
        await deleteProject(accessToken, id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
    }

    function openCreateModal() {
        setEditingProject(null);
        setIsModalOpen(true);
    }

    function openEditModal(project: Project) {
        setEditingProject(project);
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
                        <span className={styles.breadcrumbCurrent}>Projects</span>
                    </div>
                    <button className={styles.backBtn}
                            onClick={() => router.push('/library')}>
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.pageHeader}>
                    <div>
                        <h2 className={styles.pageTitle}>Projects</h2>
                        <p className={styles.pageSubtitle}>
                            Organiza tu conocimiento en proyectos
                        </p>
                    </div>
                    <Button variant="primary" onClick={openCreateModal}>
                        <span className="material-symbols-outlined">add</span>
                        Nuevo project
                    </Button>
                </div>

                {isLoading ? (
                    <div className={styles.loadingState}>
                        <p>Cargando projects...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <EmptyState icon="folder_open"
                                title="Sin projects todavía"
                                description="Creá tu primer project para empezar a organizar tus colecciones."
                                action={
                                    <Button variant="primary" onClick={openCreateModal}>
                                        Crear project
                                    </Button>
                                }
                    />
                ) : (
                    <div className={styles.grid}>
                        {projects.map((project) => (
                            <ProjectCard key={project.id}
                                        project={project}
                                        workspaceId={workspaceId}
                                        onEdit={openEditModal}
                                        onDelete={handleDelete}/>
                        ))}
                    </div>
                )}
            </main>

            <ProjectModal isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={editingProject ? handleUpdate : handleCreate}
                        project={editingProject}/>
        </div>
    );
}