'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/lib/projects';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import styles from './ProjectModal.module.css';

const EMOJI_OPTIONS = ['📁', '📖', '🔭', '🧬', '📝', '🎯', '🧮', '⚖️', '🗺️', '🏺'];

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        name: string;
        description?: string;
        iconEmoji?: string;
    }) => Promise<void>;
    project?: Project | null;
}

export function ProjectModal({
    isOpen,
    onClose,
    onSubmit,
    project,
}: ProjectModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [iconEmoji, setIconEmoji] = useState('📁');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const isEditing = !!project;

    useEffect(() => {
        if (project) {
            setName(project.name);
            setDescription(project.description ?? '');
            setIconEmoji(project.iconEmoji ?? '📁');
        } else {
            setName('');
            setDescription('');
            setIconEmoji('📁');
        }
        setError('');
    }, [project, isOpen]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await onSubmit({ name, description: description || undefined, iconEmoji });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrio un error');
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
                        {isEditing ? 'Editar Project' : 'Nuevo Project'}
                    </h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.emojiSection}>
                        <p className={styles.emojiLabel}>Ícono</p>
                        <div className={styles.emojiGrid}>
                            {EMOJI_OPTIONS.map((emoji) => (
                                <button key={emoji}
                                        type="button"
                                        className={`${styles.emojiBtn} ${iconEmoji === emoji ? styles.emojiSelected : ''}`}
                                        onClick={() => setIconEmoji(emoji)}>
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Input  label="Nombre"
                            type="text"
                            placeholder="Ej: Matemáticas, Historia, etc"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required/>

                    <div className={styles.textareaWrapper}>
                        <label className={styles.textareaLabel}>
                            Descripción (opcional)
                        </label>
                        <textarea   className={styles.textarea}
                                    placeholder="Una breve descripción del project..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}/>
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <div className={styles.formActions}>
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isLoading}>
                            {isEditing ? 'Guardar cambios' : 'Crear project'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}