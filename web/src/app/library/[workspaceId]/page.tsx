import Link from 'next/link';

interface Props {
    params: Promise<{ workspaceId: string }>;
}

export default async function WorkspaceDetailPage({ params }: Props) {
    const { workspaceId } = await params;

    return (
        <main style={{ padding: '40px' }}>
            <Link href="/library">← Volver a la biblioteca</Link>
            <h1>Workspace: {workspaceId}</h1>
            <p>Projects </p>
        </main>
    );
}