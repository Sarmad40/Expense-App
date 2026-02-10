
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wallet, TrendingDown, Calendar, Menu, X, ArrowRightLeft, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const items = [
    {
        title: 'Dashboard',
        url: '/',
        icon: LayoutDashboard,
    },
    {
        title: 'Income',
        url: '/income',
        icon: Wallet,
    },
    {
        title: 'Expenses',
        url: '/expenses',
        icon: TrendingDown,
    },
    {
        title: 'Yearly View',
        url: '/yearly',
        icon: Calendar,
    },
    {
        title: 'Compare',
        url: '/comparison',
        icon: ArrowRightLeft,
    },
    {
        title: 'Profile',
        url: '/profile',
        icon: User,
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Menu Button - Floating */}
            <button
                onClick={toggleSidebar}
                className="md:hidden fixed top-4 right-4 z-50 p-2.5 bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:bg-primary transition-all backdrop-blur-sm"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 md:w-72 bg-card/50 md:bg-transparent transition-transform duration-300 md:relative md:translate-x-0 flex flex-col h-screen",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Floating Card Design for Desktop Sidebar */}
                <div className="flex flex-col h-full md:m-4 md:rounded-3xl md:bg-white md:shadow-xl md:border border-indigo-50/50 overflow-hidden">
                    <div className="p-8 border-b border-indigo-50/50 bg-gradient-to-br from-indigo-50/50 to-white/0">
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3 text-indigo-950">
                            <span className="w-10 h-10 bg-gradient-to-tr from-primary to-violet-500 rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-indigo-500/30">
                                <Wallet className="h-6 w-6" />
                            </span>
                            FinTrack
                        </h1>
                    </div>

                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {items.map((item) => {
                            const isActive = pathname === item.url;
                            return (
                                <Link
                                    key={item.title}
                                    href={item.url}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-indigo-500/25"
                                            : "hover:bg-indigo-50 text-muted-foreground hover:text-indigo-900"
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                                    {item.title}
                                    {isActive && (
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-6 border-t border-indigo-50/50 bg-gray-50/50">
                        <div className="bg-indigo-50/50 rounded-2xl p-4 text-center">
                            <p className="text-sm font-semibold text-indigo-900">Pro Plan</p>
                            <p className="text-xs text-indigo-600/80 mt-1">Unlock advanced features</p>
                            <button className="mt-3 w-full bg-white text-primary text-xs font-bold py-2 rounded-lg border border-indigo-100 shadow-sm hover:shadow-md transition-all">
                                Upgrade Now
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
