import Link from 'next/link';

interface Props {
    params: Promise<{
        workspaceId: string;
        projectId: string;
        collectionId: string;
    }>;
}

export default async function CollectionDetailPage({ params }: Props) {
    const { workspaceId, projectId, collectionId } = await params;

    return (
        <main style={{ padding: '40px' }}>
            <Link href={`/library/${workspaceId}/${projectId}`}>
                ← Volver al project
            </Link>
            <h1>Collection: {collectionId}</h1>
            <p>Flashcards.</p>
        </main>
    );
}