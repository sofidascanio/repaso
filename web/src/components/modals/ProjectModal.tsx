'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/lib/projects';
import { Input } from '@/components/ui/Input/Input';
import { IconPicker } from '@/components/ui/IconPicker/IconPicker';
import { DEFAULT_ICON_ID } from '@/lib/icons';
import { BaseModal } from './BaseModal';
import styles from './BaseModal.module.css';

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
    const [iconId, setIconId] = useState(DEFAULT_ICON_ID);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const isEditing = !!project;

    useEffect(() => {
        if (project) {
            setName(project.name);
            setDescription(project.description ?? '');
            setIconId(project.iconEmoji ?? DEFAULT_ICON_ID);
        } else {
            setName('');
            setDescription('');
            setIconId(DEFAULT_ICON_ID);
        }
        setError('');
    }, [project, isOpen]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await onSubmit({
                name,
                description: description || undefined,
                iconEmoji: iconId,
            });
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
            title={isEditing ? 'Editar tema' : 'Nuevo tema'}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            submitText={isEditing ? 'Guardar cambios' : 'Crear tema'}
        >
            <IconPicker value={iconId} onChange={setIconId} />

            <Input
                label="Nombre"
                type="text"
                placeholder="Ej: Algebra, Siglo 19, Backend"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            <div className={styles.textareaWrapper}>
                <label className={styles.textareaLabel}>Descripción (opcional)</label>
                <textarea
                    className={styles.textarea}
                    placeholder="Una breve descripción del tema..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />
            </div>
        </BaseModal>
    );
}