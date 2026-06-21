'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SearchBar.module.css';

interface SearchBarProps {
    initialQuery?: string;
    placeholder?: string;
    onSearch?: (query: string) => void;
    navigateToSearch?: boolean;
}

export function SearchBar({
    initialQuery = '',
    placeholder = 'Buscar en el archivo...',
    onSearch,
    navigateToSearch = false,
}: SearchBarProps) {
    const [query, setQuery] = useState(initialQuery);
    const router = useRouter();
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!onSearch) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            if (query.trim().length >= 2) {
                onSearch(query.trim());
            }
        }, 400);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, onSearch]);

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' && query.trim().length >= 2) {
            if (navigateToSearch) {
                router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            } else if (onSearch) {
                onSearch(query.trim());
            }
        }
    }

    return (
        <div className={styles.wrapper}>
            <span className={`material-symbols-outlined ${styles.icon}`}>
                search
            </span>
            <input className={styles.input}
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}/>
            {query && (
                <button className={styles.clearBtn}
                        onClick={() => {
                            setQuery('');
                            if (onSearch) onSearch('');
                        }}>
                    <span className="material-symbols-outlined">close</span>
                </button>
            )}
        </div>
    );
}