import { Collection } from '@/lib/collections';
import { ItemCard } from './ItemCard';

interface CollectionCardProps {
    collection: Collection;
    workspaceId: string;
    projectId: string;
    onEdit: (collection: Collection) => void;
    onDelete: (id: string) => void;
}

export function CollectionCard({
    collection,
    workspaceId,
    projectId,
    onEdit,
    onDelete,
}: CollectionCardProps) {
    return (
        <ItemCard
            item={collection}
            href={`/library/${workspaceId}/${projectId}/${collection.id}`}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );
}