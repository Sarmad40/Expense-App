
'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Allow public access to login page
        if (pathname === '/login') {
            setIsChecking(false);
            return;
        }

        // Wait a tick to ensure auth state is loaded (optional improvement: add loaded state to auth provider)
        // But for locastorage it's fast enough.
        // We can check isAuthenticated directly.
        if (!isAuthenticated) {
            router.push('/login');
        } else {
            setIsChecking(false);
        }
    }, [isAuthenticated, pathname, router]);

    if (isChecking && pathname !== '/login') {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return <>{children}</>;
}
