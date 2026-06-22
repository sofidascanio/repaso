import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { InstallPrompt } from '@/components/ui/InstallPrompt/InstallPrompt';
import { OfflineBanner } from '@/components/ui/OfflineBanner/OfflineBanner';
import '@/styles/globals.css';

export const viewport: Viewport = {
	themeColor: '#041627',
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export const metadata: Metadata = {
	title: {
		default: 'Repaso',
		template: '%s | Repaso',
	},
	description: 'Tu plataforma de estudio con flashcards y repetición espaciada',
	manifest: '/manifest.json',
	appleWebApp: {
		capable: true,
		statusBarStyle: 'black-translucent',
		title: 'Repaso',
	},
	icons: {
		icon: '/favicon.png',
		apple: '/icons/app/apple-touch-icon.png',
		shortcut: '/favicon.png',
	},
	keywords: ['flashcards', 'estudio', 'repetición espaciada', 'aprendizaje'],
};

export default function RootLayout({
  	children,
}: {
  	children: React.ReactNode;
}) {
	return (
		<html lang="es">
			<head>
				<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
					rel="stylesheet"/>
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style"
					content="black-translucent"/>
				<meta name="apple-mobile-web-app-title" content="Repaso" />
				<link rel="apple-touch-icon" href="/icons/app/apple-touch-icon.png" />
			</head>
			<body>
				<AuthProvider>
					<OfflineBanner />
						{children}
					<InstallPrompt />
				</AuthProvider>
			</body>
		</html>
	);
}