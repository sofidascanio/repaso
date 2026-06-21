'use client';

import { useState, useEffect } from 'react';
import { Collection } from '@/lib/collections';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { IconPicker } from '@/components/ui/IconPicker/IconPicker';
import { DEFAULT_ICON_ID } from '@/lib/icons';
import styles from './CollectionModal.module.css';

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
                    {isEditing ? 'Editar Collection' : 'Nueva Collection'}
                </h2>
                <button className={styles.closeBtn} onClick={onClose}>
                    <span className="material-symbols-outlined">close</span>
                </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <IconPicker value={iconId} onChange={setIconId} />

                    <Input label="Nombre"
                        type="text"
                        placeholder="Ej: Verbos irregulares, Fórmulas, Conceptos clave"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required/>

                    <div className={styles.textareaWrapper}>
                        <label className={styles.textareaLabel}>Descripción (opcional)</label>
                        <textarea className={styles.textarea}
                                placeholder="Una breve descripción de la collection..."
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
                            {isEditing ? 'Guardar cambios' : 'Crear collection'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );    
}