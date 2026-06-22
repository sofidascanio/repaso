'use client';

import { useState, useEffect } from 'react';
import styles from './OfflineBanner.module.css';

export function OfflineBanner() {
    const [isOffline, setIsOffline] = useState(false);
    const [wasOffline, setWasOffline] = useState(false);

    useEffect(() => {
        setIsOffline(!navigator.onLine);

        function handleOffline() {
            setIsOffline(true);
            setWasOffline(true);
        }

        function handleOnline() {
            setIsOffline(false);
        }

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    if (!isOffline && !wasOffline) return null;

    return (
        <div className={`${styles.banner} ${isOffline ? styles.offline : styles.online}`}>
            <span className={`material-symbols-outlined ${styles.icon}`}>
                {isOffline ? 'wifi_off' : 'wifi'}
            </span>
            <p className={styles.message}>
                {isOffline
                ? 'Sin conexión, estas usando Repaso en modo offline'
                : 'Conexión restaurada'}
            </p>
        </div>
    );
}