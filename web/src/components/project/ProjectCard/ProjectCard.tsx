import Link from 'next/link';
import { Project } from '@/lib/projects';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
    project: Project;
    workspaceId: string;
    onEdit: (project: Project) => void;
    onDelete: (id: string) => void;
}

export function ProjectCard({
    project,
    workspaceId,
    onEdit,
    onDelete,
}: ProjectCardProps) {
    return (
        <div className={styles.card}>
            <Link href={`/library/${workspaceId}/${project.id}`}
                  className={styles.cardLink}>
                <div className={styles.header}>
                    <span className={styles.emoji}>{project.iconEmoji ?? '📁'}</span>
                </div>
                <div className={styles.body}>
                    <h3 className={styles.name}>{project.name}</h3>
                    {project.description && (
                        <p className={styles.description}>{project.description}</p>
                    )}
                </div>
            </Link>

            <div className={styles.footer}>
                <span className={styles.date}>
                    {new Date(project.createdAt).toLocaleDateString('es-AR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                </span>
                <div className={styles.actions}>
                    <button className={styles.actionBtn}
                            onClick={() => onEdit(project)}
                            title="Editar">
                        <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={() => onDelete(project.id)}
                            title="Eliminar">
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
}