
'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (loading) return;

        // Allow public access to login page
        if (pathname === '/login') {
            setIsChecking(false);
            return;
        }

        if (!isAuthenticated) {
            router.push('/login');
        } else {
            setIsChecking(false);
        }
    }, [isAuthenticated, loading, pathname, router]);

    if ((loading || isChecking) && pathname !== '/login') {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return <>{children}</>;
}
