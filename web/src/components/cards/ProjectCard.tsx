import { Project } from '@/lib/projects';
import { ItemCard } from './ItemCard';

interface ProjectCardProps {
    project: Project;
    workspaceId: string;
    onEdit: (project: Project) => void;
    onDelete: (id: string) => void;
}

export function ProjectCard({ 
    project, 
    workspaceId, 
    onEdit, 
    onDelete 
}: ProjectCardProps) {
    return (
        <ItemCard
            item={project}
            href={`/library/${workspaceId}/${project.id}`}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );
}