'use client';

import { useState, useEffect } from 'react';
import { Workspace } from '@/lib/workspaces';
import { Input } from '@/components/ui/Input/Input';
import { IconPicker } from '@/components/ui/IconPicker/IconPicker';
import { DEFAULT_ICON_ID } from '@/lib/icons';
import { BaseModal } from './BaseModal';
import styles from './BaseModal.module.css';

interface WorkspaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; description?: string; iconEmoji?: string }) => Promise<void>;
    workspace?: Workspace | null;
}

export function WorkspaceModal({
    isOpen,
    onClose,
    onSubmit,
    workspace,
}: WorkspaceModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [iconId, setIconId] = useState(DEFAULT_ICON_ID);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const isEditing = !!workspace;

    useEffect(() => {
        if (workspace) {
            setName(workspace.name);
            setDescription(workspace.description ?? '');
            setIconId(workspace.iconEmoji ?? DEFAULT_ICON_ID);
        } else {
            setName('');
            setDescription('');
            setIconId(DEFAULT_ICON_ID);
        }
        setError('');
    }, [workspace, isOpen]);

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
            title={isEditing ? 'Editar materia' : 'Nuevo materia'}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            submitText={isEditing ? 'Guardar cambios' : 'Crear materia'}
        >
            <IconPicker value={iconId} onChange={setIconId} />

            <Input
                label="Nombre"
                type="text"
                placeholder="Ej: Historia, Matematica, Frances, Python"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            <div className={styles.textareaWrapper}>
                <label className={styles.textareaLabel}>Descripción (opcional)</label>
                <textarea
                    className={styles.textarea}
                    placeholder="Una breve descripción de la materia..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />
            </div>
        </BaseModal>
    );
}