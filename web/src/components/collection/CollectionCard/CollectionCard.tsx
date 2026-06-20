import Link from 'next/link';
import { Collection } from '@/lib/collections';
import styles from './CollectionCard.module.css';

interface CollectionCardProps {
    collection: Collection;
    workspaceId: string;
    projectId: string;
    onEdit: (collection: Collection) => void;
    onDelete: (id: string) => void;
}

export function CollectionCard({
    collection,
    workspaceId,
    projectId,
    onEdit,
    onDelete,
}: CollectionCardProps) {
  return (
        <div className={styles.card}>
            <Link href={`/library/${workspaceId}/${projectId}/${collection.id}`}
                  className={styles.cardLink}>
                <div className={styles.header}>
                    <span className={styles.emoji}>{collection.iconEmoji ?? '🗂️'}</span>
                </div>
                <div className={styles.body}>
                    <h3 className={styles.name}>{collection.name}</h3>
                    {collection.description && (
                        <p className={styles.description}>{collection.description}</p>
                    )}
                </div>
            </Link>

            <div className={styles.footer}>
                <span className={styles.date}>
                    {new Date(collection.createdAt).toLocaleDateString('es-AR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                </span>
                <div className={styles.actions}>
                    <button className={styles.actionBtn}
                            onClick={() => onEdit(collection)}
                            title="Editar">
                        <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={() => onDelete(collection.id)}
                            title="Eliminar">
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
}