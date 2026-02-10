
'use client';

import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { AppProvider } from "@/components/providers/AppProvider";
import { AuthProvider, useAuth } from "@/components/providers/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { usePathname } from "next/navigation";

// Inner component to use Auth Hook
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans antialiased">
            {/* Show Sidebar if authenticated and not on login page */}
            {isAuthenticated && !isLoginPage && <AppSidebar />}

            <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isAuthenticated && !isLoginPage ? 'md:ml-0' : ''}`}>
                {/* Show Header if authenticated and not on login page */}
                {isAuthenticated && !isLoginPage && (
                    <div className="px-4 py-4 md:px-8">
                        <Header />
                    </div>
                )}

                <div className="flex-1 px-4 pb-8 md:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ProtectedRoute>
                <AppProvider>
                    <AuthenticatedLayout>
                        {children}
                    </AuthenticatedLayout>
                </AppProvider>
            </ProtectedRoute>
        </AuthProvider>
    );
}
