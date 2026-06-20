'use client';

import { useState, useEffect } from 'react';
import { Flashcard } from '@/lib/flashcards';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import styles from './FlashcardModal.module.css';

interface FlashcardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        question: string;
        answer: string;
        tags?: string[];
    }) => Promise<void>;
    flashcard?: Flashcard | null;
}

export function FlashcardModal({
    isOpen,
    onClose,
    onSubmit,
    flashcard,
}: FlashcardModalProps) {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const isEditing = !!flashcard;

    useEffect(() => {
        if (flashcard) {
            setQuestion(flashcard.question);
            setAnswer(flashcard.answer);
            setTagsInput(flashcard.tags.join(', '));
        } else {
            setQuestion('');
            setAnswer('');
            setTagsInput('');
        }
        setError('');
    }, [flashcard, isOpen]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const tags = tagsInput
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);

        try {
            await onSubmit({ question, answer, tags });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error');
        } finally {
            setIsLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {isEditing ? 'Editar Flashcard' : 'Nueva Flashcard'}
                    </h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.textareaWrapper}>
                        <label className={styles.textareaLabel}>Pregunta</label>
                        <textarea
                        className={styles.textarea}
                        placeholder="¿Cuál es la pregunta?"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        rows={3}
                        required
                        />
                    </div>

                    <div className={styles.textareaWrapper}>
                        <label className={styles.textareaLabel}>Respuesta</label>
                        <textarea
                        className={styles.textarea}
                        placeholder="¿Cuál es la respuesta?"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        rows={4}
                        required
                        />
                    </div>

                    <Input
                        label="Tags (separados por coma)"
                        type="text"
                        placeholder="Ej: verbos, nivel-b2, irregular"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                    />

                    {error && <p className={styles.error}>{error}</p>}

                    <div className={styles.formActions}>
                        <Button type="button" variant="ghost" onClick={onClose}>
                        Cancelar
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isLoading}>
                        {isEditing ? 'Guardar cambios' : 'Crear flashcard'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}