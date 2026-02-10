
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    loginWithEmail: (email: string, pass: string) => Promise<void>;
    registerWithEmail: (email: string, pass: string, name: string) => Promise<{ success: boolean; needsVerification: boolean }>;
    logout: () => Promise<void>;
    updateUserProfile: (name: string, photoURL?: string) => Promise<void>;
    changePassword: (oldPass: string, newPass: string) => Promise<boolean>;
    sendPasswordResetEmail: (email: string) => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for active session
        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            handleSession(session);
            setLoading(false);
        };

        initSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            handleSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSession = (session: Session | null) => {
        if (session?.user) {
            const newUser: User = {
                id: session.user.id,
                username: session.user.user_metadata.username || session.user.email?.split('@')[0] || 'User',
                email: session.user.email,
                photoURL: session.user.user_metadata.photoURL || '',
                createdAt: session.user.created_at,
            };
            setUser(newUser);
        } else {
            setUser(null);
        }
    };

    const loginWithEmail = async (email: string, pass: string) => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: pass,
        });

        if (error) {
            setLoading(false);
            throw new Error(error.message);
        }
        // onAuthStateChange will handle user state update
        router.push('/');
    };

    const registerWithEmail = async (email: string, pass: string, name: string) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password: pass,
            options: {
                data: {
                    username: name,
                },
            },
        });

        if (error) {
            setLoading(false);
            throw new Error(error.message);
        }

        // Check if session is missing (implies email verification needed)
        if (data.user && !data.session) {
            setLoading(false);
            return { success: true, needsVerification: true };
        }

        // If session exists, user is logged in
        router.push('/');
        return { success: true, needsVerification: false };
    };

    const updateUserProfile = async (name: string, photoURL?: string) => {
        if (!user) return;

        const updates: { username?: string; photoURL?: string } = {};
        if (name) updates.username = name;
        if (photoURL) updates.photoURL = photoURL;

        const { error } = await supabase.auth.updateUser({
            data: updates,
        });

        if (error) {
            throw new Error(error.message);
        }

        // Also update the 'profiles' table if it exists and RLS allows
        // This is done via trigger usually, but for updates we might need manual call if the trigger only handles insert
        // The SQL schema set up has a policy "Users can update own profile." so we can do:
        await supabase.from('profiles').update({ username: name, photo_url: photoURL }).eq('id', user.id);

        // Optimistic update
        setUser((prev) => prev ? { ...prev, ...updates } : null);
    };

    const changePassword = async (oldPass: string, newPass: string) => {
        if (!user) return false;

        // Note: Supabase doesn't require old password for signed-in users
        const { error } = await supabase.auth.updateUser({
            password: newPass
        });

        if (error) {
            throw new Error(error.message);
        }
        return true;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push('/login');
    };

    const sendPasswordResetEmail = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`,
        });
        if (error) {
            throw new Error(error.message);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loginWithEmail,
            registerWithEmail,
            logout,
            updateUserProfile,
            changePassword,
            sendPasswordResetEmail,
            isAuthenticated: !!user,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
