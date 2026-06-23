'use client';

import { useState, useEffect } from 'react';
import { Flashcard } from '@/lib/flashcards';
import { Input } from '@/components/ui/Input/Input';
import { BaseModal } from './BaseModal';
import styles from './BaseModal.module.css';

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
            setError(err instanceof Error ? err.message : 'Ocurrio un error');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Editar Flashcard' : 'Nueva Flashcard'}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            submitText={isEditing ? 'Guardar cambios' : 'Crear flashcard'}
        >
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
        </BaseModal>
    );
}