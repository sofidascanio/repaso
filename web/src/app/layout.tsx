import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Repaso',
  description: 'Tu plataforma de estudio con flashcards',
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
			</head>
			<body>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}