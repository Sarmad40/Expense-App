
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Transaction, ExpenseCategory } from '@/types';

// Simple ID generator if crypto.randomUUID is not available (though it usually is)
const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

interface AppContextType {
    transactions: Transaction[];
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    editTransaction: (id: string, updated: Partial<Transaction>) => void;
    deleteTransaction: (id: string) => void;
    customCategories: string[];
    addCustomCategory: (category: string) => void;
    editingTransaction: Transaction | null;
    setEditingTransaction: (transaction: Transaction | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ... imports
import { useAuth } from './AuthProvider';

export function AppProvider({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [customCategories, setCustomCategories] = useState<string[]>([]);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load data when user changes
    useEffect(() => {
        if (!isAuthenticated || !user) {
            setTransactions([]);
            setCustomCategories([]);
            setIsLoaded(false);
            return;
        }

        const storedTransactions = localStorage.getItem(`${user.id}_transactions`);
        const storedCategories = localStorage.getItem(`${user.id}_customCategories`);

        if (storedTransactions) {
            setTransactions(JSON.parse(storedTransactions));
        } else {
            setTransactions([]);
        }

        if (storedCategories) {
            setCustomCategories(JSON.parse(storedCategories));
        } else {
            setCustomCategories([]);
        }
        setIsLoaded(true);
    }, [user, isAuthenticated]);

    // Save data when state changes (debounced or direct)
    useEffect(() => {
        if (isLoaded && user) {
            localStorage.setItem(`${user.id}_transactions`, JSON.stringify(transactions));
        }
    }, [transactions, isLoaded, user]);

    useEffect(() => {
        if (isLoaded && user) {
            localStorage.setItem(`${user.id}_customCategories`, JSON.stringify(customCategories));
        }
    }, [customCategories, isLoaded, user]);

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction = { ...transaction, id: generateId() };
        setTransactions((prev) => [...prev, newTransaction]);
    };

    // ... rest of the functions (editTransaction, deleteTransaction, addCustomCategory) are same

    const editTransaction = (id: string, updated: Partial<Transaction>) => {
        setTransactions((prev) =>
            prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
        );
        setEditingTransaction(null);
    };

    const deleteTransaction = (id: string) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        if (editingTransaction?.id === id) {
            setEditingTransaction(null);
        }
    };

    const addCustomCategory = (category: string) => {
        if (!customCategories.includes(category)) {
            setCustomCategories((prev) => [...prev, category]);
        }
    };

    return (
        <AppContext.Provider
            value={{
                transactions,
                addTransaction,
                editTransaction,
                deleteTransaction,
                customCategories,
                addCustomCategory,
                editingTransaction,
                setEditingTransaction,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppData() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppData must be used within an AppProvider');
    }
    return context;
}
