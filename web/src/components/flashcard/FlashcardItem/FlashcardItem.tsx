import { Flashcard } from '@/lib/flashcards';
import styles from './FlashcardItem.module.css';

interface FlashcardItemProps {
    flashcard: Flashcard;
    onEdit: (flashcard: Flashcard) => void;
    onDelete: (id: string) => void;
    onToggleFavorite: (flashcard: Flashcard) => void;
    onToggleDifficult: (flashcard: Flashcard) => void;
}

export function FlashcardItem({
    flashcard,
    onEdit,
    onDelete,
    onToggleFavorite,
    onToggleDifficult,
}: FlashcardItemProps) {
    return (
        <div className={styles.item}>
            <div className={styles.content}>
                <div className={styles.question}>
                    <span className={styles.questionLabel}>P</span>
                    <p className={styles.questionText}>{flashcard.question}</p>
                </div>
                <div className={styles.divider} />
                <div className={styles.answer}>
                    <span className={styles.answerLabel}>R</span>
                    <p className={styles.answerText}>{flashcard.answer}</p>
                </div>
                {flashcard.tags.length > 0 && (
                    <div className={styles.tags}>
                        {flashcard.tags.map((tag) => (
                            <span key={tag} className={styles.tag}>
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                <button className={`${styles.actionBtn} ${flashcard.isFavorite ? styles.active : ''}`}
                        onClick={() => onToggleFavorite(flashcard)}
                        title={flashcard.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
                    <span className="material-symbols-outlined">
                        {flashcard.isFavorite ? 'star' : 'star_border'}
                    </span>
                </button>
                <button className={`${styles.actionBtn} ${flashcard.isDifficult ? styles.activeDifficult : ''}`}
                        onClick={() => onToggleDifficult(flashcard)}
                        title={flashcard.isDifficult ? 'Quitar de difíciles' : 'Marcar como difícil'}>
                    <span className="material-symbols-outlined">
                        {flashcard.isDifficult ? 'flag' : 'outlined_flag'}
                    </span>
                </button>
                <button className={styles.actionBtn}
                        onClick={() => onEdit(flashcard)}
                        title="Editar">
                    <span className="material-symbols-outlined">edit</span>
                </button>
                <button className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => onDelete(flashcard.id)}
                        title="Eliminar">
                    <span className="material-symbols-outlined">delete</span>
                </button>
            </div>
        </div>
    );
}