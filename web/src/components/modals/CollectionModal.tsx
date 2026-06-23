'use client';

import { useState, useEffect } from 'react';
import { Collection } from '@/lib/collections';
import { Input } from '@/components/ui/Input/Input';
import { IconPicker } from '@/components/ui/IconPicker/IconPicker';
import { DEFAULT_ICON_ID } from '@/lib/icons';
import { BaseModal } from './BaseModal';
import styles from './BaseModal.module.css';

interface CollectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        name: string;
        description?: string;
        iconEmoji?: string;
    }) => Promise<void>;
    collection?: Collection | null;
}

export function CollectionModal({
    isOpen,
    onClose,
    onSubmit,
    collection,
}: CollectionModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [iconId, setIconId] = useState(DEFAULT_ICON_ID);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const isEditing = !!collection;

    useEffect(() => {
        if (collection) {
            setName(collection.name);
            setDescription(collection.description ?? '');
            setIconId(collection.iconEmoji ?? DEFAULT_ICON_ID);
        } else {
            setName('');
            setDescription('');
            setIconId(DEFAULT_ICON_ID);
        }
        setError('');
    }, [collection, isOpen]);

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
            title={isEditing ? 'Editar examen' : 'Nuevo examen'}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            submitText={isEditing ? 'Guardar cambios' : 'Crear examen'}
        >
            <IconPicker value={iconId} onChange={setIconId} />

            <Input
                label="Nombre"
                type="text"
                placeholder="Ej: Verbos irregulares, Segunda guerra mundial, Django"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            <div className={styles.textareaWrapper}>
                <label className={styles.textareaLabel}>Descripción (opcional)</label>
                <textarea
                    className={styles.textarea}
                    placeholder="Una breve descripción del examen..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />
            </div>
        </BaseModal>
    );
}