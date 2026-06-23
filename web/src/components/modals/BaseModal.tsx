'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/Button/Button';
import styles from './BaseModal.module.css';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    isLoading: boolean;
    error: string;
    children: ReactNode;
    submitText: string;
}

export function BaseModal({
    isOpen,
    onClose,
    title,
    onSubmit,
    isLoading,
    error,
    children,
    submitText,
}: BaseModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={onSubmit} className={styles.form}>
                    {children}

                    {error && <p className={styles.error}>{error}</p>}

                    <div className={styles.formActions}>
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isLoading}>
                            {submitText}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}