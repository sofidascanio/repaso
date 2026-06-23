import { AuthGuard } from '@/components/ui/AuthGuard/AuthGuard';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthGuard> {children} </AuthGuard>;
}