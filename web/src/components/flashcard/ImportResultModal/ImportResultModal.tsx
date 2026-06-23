import { Button } from '@/components/ui/Button/Button';
import { ImportResult } from '@/lib/import-export';
import styles from './ImportResultModal.module.css';

interface ImportResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: ImportResult | null;
}

export function ImportResultModal({
    isOpen,
    onClose,
    result,
}: ImportResultModalProps) {
    if (!isOpen || !result) return null;

    const hasErrors = result.errors.length > 0;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Importación existosa</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className={styles.body}>
                    <div className={styles.stats}>
                        <div className={`${styles.stat} ${styles.statSuccess}`}>
                            <span className={`material-symbols-outlined ${styles.statIcon}`}>
                                check_circle
                            </span>
                            <span className={styles.statNumber}>{result.imported}</span>
                            <span className={styles.statLabel}>importadas</span>
                        </div>
                    <div className={`${styles.stat} ${result.skipped > 0 ? styles.statWarning : styles.statNeutral}`}>
                        <span className={`material-symbols-outlined ${styles.statIcon}`}>
                            {result.skipped > 0 ? 'warning' : 'check'}
                        </span>
                        <span className={styles.statNumber}>{result.skipped}</span>
                        <span className={styles.statLabel}>omitidas</span>
                    </div>
                </div>

                {hasErrors && (
                    <div className={styles.errors}>
                        <p className={styles.errorsTitle}>Detalles de errores:</p>
                        <ul className={styles.errorsList}>
                            {result.errors.map((err, i) => (
                                <li key={i} className={styles.errorItem}>
                                    <span className="material-symbols-outlined">error</span>
                                    {err}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {result.imported > 0 && (
                    <p className={styles.successMsg}>
                        Se agregaron {result.imported} flashcard
                        {result.imported !== 1 ? 's' : ''} a la colección.
                        Recarga la página para verlas.
                    </p>
                )}
                </div>

                <div className={styles.footer}>
                    <Button variant="primary" onClick={onClose}>
                        Entendido
                    </Button>
                </div>
            </div>
        </div>
    );
}