'use client';

import { useState, useRef } from 'react';
import {
    exportCollectionJson,
    exportCollectionCsv,
    importCollectionJson,
    importCollectionCsv,
    ImportResult,
} from '@/lib/import-export';
import styles from './ImportExportMenu.module.css';

interface ImportExportMenuProps {
    accessToken: string;
    collectionId: string;
    collectionName: string;
    onImportSuccess: (result: ImportResult) => void;
}

export function ImportExportMenu({
    accessToken,
    collectionId,
    collectionName,
    onImportSuccess,
}: ImportExportMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const jsonInputRef = useRef<HTMLInputElement>(null);
    const csvInputRef = useRef<HTMLInputElement>(null);

    async function handleExport(format: 'json' | 'csv') {
        setError('');
        setIsLoading(true);
        setIsOpen(false);

            try {
            if (format === 'json') {
                await exportCollectionJson(accessToken, collectionId, collectionName);
            } else {
                await exportCollectionCsv(accessToken, collectionId, collectionName);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al exportar');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleImport(
        e: React.ChangeEvent<HTMLInputElement>,
        format: 'json' | 'csv',
    ) {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');
        setIsLoading(true);
        setIsOpen(false);

        try {
            let result: ImportResult;
            if (format === 'json') {
                result = await importCollectionJson(accessToken, collectionId, file);
            } else {
                result = await importCollectionCsv(accessToken, collectionId, file);
            }
            onImportSuccess(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al importar');
        } finally {
            setIsLoading(false);
            // limpia el input para permitir reimportar el mismo archivo
            e.target.value = '';
        }
    }

    return (
        <div className={styles.wrapper}>
            <button className={`${styles.trigger} ${isLoading ? styles.loading : ''}`}
                    onClick={() => setIsOpen((prev) => !prev)}
                    disabled={isLoading}
                    title="Import / Export">
                <span className="material-symbols-outlined">
                    {isLoading ? 'sync' : 'import_export'}
                </span>
                <span className={styles.triggerLabel}>
                    {isLoading ? 'Procesando...' : 'Import / Export'}
                </span>
                <span className="material-symbols-outlined">
                    {isOpen ? 'expand_less' : 'expand_more'}
                </span>
            </button>

            {isOpen && (
                <>
                    <div className={styles.backdrop} onClick={() => setIsOpen(false)}/>
                    <div className={styles.menu}>
                        <p className={styles.menuSection}>Exportar</p>

                        <button className={styles.menuItem}
                                onClick={() => handleExport('json')}>
                            <span className="material-symbols-outlined">download</span>
                            <div>
                                <span className={styles.menuItemLabel}>JSON</span>
                                <span className={styles.menuItemDesc}>
                                    Formato completo con metadatos
                                </span>
                            </div>
                        </button>

                        <button className={styles.menuItem} onClick={() => handleExport('csv')}>
                            <span className="material-symbols-outlined">download</span>
                            <div>
                                <span className={styles.menuItemLabel}>CSV</span>
                                <span className={styles.menuItemDesc}>
                                    Compatible con Excel y Google Sheets
                                </span>
                            </div>
                        </button>

                        <div className={styles.menuDivider} />
                        <p className={styles.menuSection}>Importar</p>

                        <button className={styles.menuItem} onClick={() => jsonInputRef.current?.click()}>
                            <span className="material-symbols-outlined">upload</span>
                            <div>
                                <span className={styles.menuItemLabel}>Desde JSON</span>
                                <span className={styles.menuItemDesc}>
                                    Archivo exportado de Repaso
                                </span>
                            </div>
                        </button>

                        <button className={styles.menuItem} onClick={() => csvInputRef.current?.click()}>
                            <span className="material-symbols-outlined">upload</span>
                            <div>
                                <span className={styles.menuItemLabel}>Desde CSV</span>
                                <span className={styles.menuItemDesc}>
                                    Columnas: question, answer, tags, isFavorite, isDifficult
                                </span>
                            </div>
                        </button>
                    </div>
                </>
            )}

            {/* inputs ocultos para seleccionar archivos */}
            <input  ref={jsonInputRef}
                    type="file"
                    accept=".json,application/json"
                    className={styles.hiddenInput}
                    onChange={(e) => handleImport(e, 'json')}/>
            <input  ref={csvInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    className={styles.hiddenInput}
                    onChange={(e) => handleImport(e, 'csv')}/>

            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}