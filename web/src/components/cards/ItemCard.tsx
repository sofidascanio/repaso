import Link from 'next/link';
import { AppIconImg } from '@/components/ui/AppIconImg/AppIconImg';
import styles from './ItemCard.module.css';

interface ItemCardProps {
    item: {
        id: string;
        name: string;
        description?: string | null;
        iconEmoji?: string | null;
        createdAt: Date | string;
    };
    href: string;
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
}

export function ItemCard({ item, href, onEdit, onDelete }: ItemCardProps) {
    const formattedDate = new Date(item.createdAt).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <div className={styles.card}>
            <Link href={href} className={styles.cardLink}>
                <div className={styles.header}>
                    <AppIconImg iconId={item.iconEmoji} size={32} />
                </div>
                <div className={styles.body}>
                    <h3 className={styles.name}>{item.name}</h3>
                    {item.description && (
                        <p className={styles.description}>{item.description}</p>
                    )}
                </div>
            </Link>

            <div className={styles.footer}>
                <span className={styles.date}>{formattedDate}</span>
                <div className={styles.actions}>
                    <button 
                        className={styles.actionBtn}
                        onClick={() => onEdit(item)}
                        title="Editar"
                    >
                        <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button 
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => onDelete(item.id)}
                        title="Eliminar"
                    >
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
}