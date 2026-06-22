'use client';

import { useState, useEffect } from 'react';
import styles from './InstallPrompt.module.css';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
    const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // verifica si ya fue descartado antes
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed) return;

        function handleBeforeInstallPrompt(e: Event) {
            e.preventDefault();
            setInstallEvent(e as BeforeInstallPromptEvent);
            setIsVisible(true);
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                handleBeforeInstallPrompt,
            );
        };
    }, []);

    async function handleInstall() {
        if (!installEvent) return;

        await installEvent.prompt();
        const { outcome } = await installEvent.userChoice;

        if (outcome === 'accepted') {
            setIsVisible(false);
        }

        setInstallEvent(null);
    }

    function handleDismiss() {
        setIsVisible(false);
        setIsDismissed(true);
        localStorage.setItem('pwa-install-dismissed', 'true');
    }

    if (!isVisible || isDismissed) return null;

    return (
        <div className={styles.banner}>
            <div className={styles.content}>
                <img src="/icons/app/icon-72x72.png"
                    alt="Repaso"
                    className={styles.appIcon}/>
                <div className={styles.text}>
                    <p className={styles.title}>Instalar Repaso</p>
                    <p className={styles.subtitle}>
                        Accedé más rápido desde tu pantalla de inicio
                    </p>
                </div>
            </div>
            <div className={styles.actions}>
                <button className={styles.dismissBtn} onClick={handleDismiss}>
                    Ahora no
                </button>
                <button className={styles.installBtn} onClick={handleInstall}>
                    Instalar
                </button>
            </div>
        </div>
    );
}