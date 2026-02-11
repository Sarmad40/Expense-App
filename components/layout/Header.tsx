
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export function Header() {
    const pathname = usePathname();
    const getTitle = () => {
        switch (pathname) {
            case '/': return 'Dashboard';
            case '/income': return 'Income';
            case '/expenses': return 'Expenses';
            case '/yearly': return 'Yearly Overview';
            case '/comparison': return 'Comparisons';
            case '/profile': return 'My Profile';
            default: return 'Finance App';
        }
    };

    if (pathname === '/') {
        return null;
    }

    return (
        <header className="flex items-center justify-between mb-8 pb-4 border-b">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    {getTitle()}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your personal finances efficiently.
                </p>
            </div>
            {/* Search or other actions can go here if needed, but keeping it clean for now */}
        </header>
    );
}
