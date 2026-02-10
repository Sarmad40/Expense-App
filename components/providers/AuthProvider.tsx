
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loginWithEmail: (email: string, pass: string) => Promise<void>;
    registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUserProfile: (name: string, photoURL?: string) => Promise<void>;
    changePassword: (oldPass: string, newPass: string) => Promise<boolean>;
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
        const storedUser = localStorage.getItem('expense_app_current_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const loginWithEmail = async (email: string, pass: string) => {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const usersJson = localStorage.getItem('expense_app_users');
        const users: any[] = usersJson ? JSON.parse(usersJson) : [];

        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);

        if (foundUser) {
            // Don't store password in current session
            const { password, ...safeUser } = foundUser;
            setUser(safeUser);
            localStorage.setItem('expense_app_current_user', JSON.stringify(safeUser));
            setLoading(false);
            router.push('/');
        } else {
            setLoading(false);
            throw new Error('Invalid email or password');
        }
    };

    const registerWithEmail = async (email: string, pass: string, name: string) => {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const usersJson = localStorage.getItem('expense_app_users');
        const users: any[] = usersJson ? JSON.parse(usersJson) : [];

        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            setLoading(false);
            throw new Error('Email is already registered');
        }

        const newUser = {
            id: crypto.randomUUID(),
            username: name,
            email,
            password: pass, // Storing plain text for demo purposes (as per user request for internal auth)
            photoURL: '',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('expense_app_users', JSON.stringify(users));

        // Auto login
        const { password, ...safeUser } = newUser;
        setUser(safeUser);
        localStorage.setItem('expense_app_current_user', JSON.stringify(safeUser));

        setLoading(false);
        router.push('/');
    };

    const updateUserProfile = async (name: string, photoURL?: string) => {
        if (!user) return;

        const updatedUser = { ...user, username: name, photoURL: photoURL || '' };
        setUser(updatedUser);
        localStorage.setItem('expense_app_current_user', JSON.stringify(updatedUser));

        // Update in main user list too
        const usersJson = localStorage.getItem('expense_app_users');
        if (usersJson) {
            const users: any[] = JSON.parse(usersJson);
            const index = users.findIndex(u => u.id === user.id);
            if (index !== -1) {
                // Keep the password!
                const existingUser = users[index];
                users[index] = { ...existingUser, username: name, photoURL: photoURL || '' };
                localStorage.setItem('expense_app_users', JSON.stringify(users));
            }
        }
    };

    const changePassword = async (oldPass: string, newPass: string) => {
        if (!user) return false;

        // In a real app we wouldn't fetch all users to check password, but for local storage we must
        const usersJson = localStorage.getItem('expense_app_users');
        if (!usersJson) return false;

        const users: any[] = JSON.parse(usersJson);
        const index = users.findIndex(u => u.id === user.id);

        if (index === -1) return false;

        const currentUserRecord = users[index];

        if (currentUserRecord.password !== oldPass) {
            throw new Error('Incorrect current password');
        }

        // Update password
        users[index] = { ...currentUserRecord, password: newPass };
        localStorage.setItem('expense_app_users', JSON.stringify(users));
        return true;
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('expense_app_current_user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{
            user,
            loginWithEmail,
            registerWithEmail,
            logout,
            updateUserProfile,
            changePassword,
            isAuthenticated: !!user,
            loading
        }}>
            {!loading && children}
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
