import Link from 'next/link';
import { Workspace } from '@/lib/workspaces';
import { AppIconImg } from '@/components/ui/AppIconImg/AppIconImg';
import styles from './WorkspaceCard.module.css';

interface WorkspaceCardProps {
    workspace: Workspace;
    onEdit: (workspace: Workspace) => void;
    onDelete: (id: string) => void;
}

export function WorkspaceCard({ workspace, onEdit, onDelete }: WorkspaceCardProps) {
    return (
        <div className={styles.card}>
            <Link href={`/library/${workspace.id}`} className={styles.cardLink}>
                <div className={styles.header}>
                    <AppIconImg iconId={workspace.iconEmoji} size={32} />
                </div>
                <div className={styles.body}>
                    <h3 className={styles.name}>{workspace.name}</h3>
                    {workspace.description && (
                        <p className={styles.description}>{workspace.description}</p>
                    )}
                </div>
            </Link>

            <div className={styles.footer}>
                <span className={styles.date}>
                    {new Date(workspace.createdAt).toLocaleDateString('es-AR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                </span>
                <div className={styles.actions}>
                    <button className={styles.actionBtn}
                            onClick={() => onEdit(workspace)}
                            title="Editar">
                        <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={() => onDelete(workspace.id)}
                            title="Eliminar">
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
}