import { Workspace } from '@/lib/workspaces';
import { ItemCard } from './ItemCard';

interface WorkspaceCardProps {
    workspace: Workspace;
    onEdit: (workspace: Workspace) => void;
    onDelete: (id: string) => void;
}

export function WorkspaceCard({ workspace, onEdit, onDelete }: WorkspaceCardProps) {
    return (
        <ItemCard
            item={workspace}
            href={`/library/${workspace.id}`}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );
}