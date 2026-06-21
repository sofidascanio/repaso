const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export interface ImportResult {
    imported: number;
    skipped: number;
    errors: string[];
}

// export 
export async function exportCollectionJson(
    accessToken: string,
    collectionId: string,
    collectionName: string,
): Promise<void> {
    const response = await fetch(
        `${API_URL}/collections/${collectionId}/export/json`,
        {
            credentials: 'include',
            headers: { Authorization: `Bearer ${accessToken}` },
        },
    );

    if (!response.ok) throw new Error('Error al exportar');

    const blob = await response.blob();
    const filename =
        response.headers
        .get('Content-Disposition')
        ?.match(/filename="(.+)"/)?.[1] ??
        `${collectionName}.json`;

    downloadBlob(blob, filename);
}

export async function exportCollectionCsv(
    accessToken: string,
    collectionId: string,
    collectionName: string,
): Promise<void> {
    const response = await fetch(
        `${API_URL}/collections/${collectionId}/export/csv`,
        {
            credentials: 'include',
            headers: { Authorization: `Bearer ${accessToken}` },
        },
    );

    if (!response.ok) throw new Error('Error al exportar');

    const blob = await response.blob();
    const filename =
        response.headers
        .get('Content-Disposition')
        ?.match(/filename="(.+)"/)?.[1] ??
        `${collectionName}.csv`;

    downloadBlob(blob, filename);
}

// import 
export async function importCollectionJson(
    accessToken: string,
    collectionId: string,
    file: File,
): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
        `${API_URL}/collections/${collectionId}/import/json`,
        {
            method: 'POST',
            credentials: 'include',
            headers: { Authorization: `Bearer ${accessToken}` },
            body: formData,
        },
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al importar');
    }

    return response.json();
}

export async function importCollectionCsv(
    accessToken: string,
    collectionId: string,
    file: File,
): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
        `${API_URL}/collections/${collectionId}/import/csv`,
        {
            method: 'POST',
            credentials: 'include',
            headers: { Authorization: `Bearer ${accessToken}` },
            body: formData,
        },
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al importar');
    }

    return response.json();
}

// helper 
function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}