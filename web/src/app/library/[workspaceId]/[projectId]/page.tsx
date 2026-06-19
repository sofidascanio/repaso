import Link from 'next/link';

interface Props {
    params: Promise<{ workspaceId: string; projectId: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
    const { workspaceId, projectId } = await params;

    return (
        <main style={{ padding: '40px' }}>
            <Link href={`/library/${workspaceId}`}>← Volver al workspace</Link>
            <h1>Project: {projectId}</h1>
            <p>Collections .</p>
        </main>
    );
}