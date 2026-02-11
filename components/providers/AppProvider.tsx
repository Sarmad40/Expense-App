
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Transaction } from '@/types';
import { useAuth } from './AuthProvider';
import { supabase } from '@/lib/supabase';

// Simple ID generator if crypto.randomUUID is not available
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
    customIncomeSources: string[];
    addCustomIncomeSource: (source: string) => void;
    editingTransaction: Transaction | null;
    setEditingTransaction: (transaction: Transaction | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [customCategories, setCustomCategories] = useState<string[]>([]);
    const [customIncomeSources, setCustomIncomeSources] = useState<string[]>([]);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load data when user changes
    useEffect(() => {
        if (!isAuthenticated || !user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTransactions([]);
            setCustomCategories([]);
            setCustomIncomeSources([]);
            setIsLoaded(false);
            return;
        }

        const fetchData = async () => {
            setIsLoaded(false);

            // Fetch transactions
            const { data: transactionsData, error: transactionsError } = await supabase
                .from('transactions')
                .select('*')
                .order('date', { ascending: false }); // Sort by date?

            if (transactionsData) {
                // Map DB snake_case to frontend camelCase if necessary.
                // Our DB schema uses `custom_category`, `payment_source`, `user_id`, `created_at`.
                // Frontend `Transaction` has `customCategory`, `paymentSource`.
                // We need to map them.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mappedTransactions: Transaction[] = transactionsData.map((t: any) => ({
                    id: t.id,
                    date: t.date,
                    amount: Number(t.amount),
                    type: t.type,
                    source: t.source,
                    paymentSource: t.payment_source,
                    category: t.category,
                    note: t.note,
                    customCategory: t.custom_category,
                }));
                setTransactions(mappedTransactions);
            }

            // Fetch custom categories
            const { data: categoriesData, error: categoriesError } = await supabase
                .from('custom_categories')
                .select('category');

            if (categoriesData) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setCustomCategories(categoriesData.map((c: any) => c.category));
            }

            // Fetch custom income sources
            const { data: sourcesData, error: sourcesError } = await supabase
                .from('custom_income_sources')
                .select('source');

            if (sourcesData) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setCustomIncomeSources(sourcesData.map((s: any) => s.source));
            }

            setIsLoaded(true);
        };

        fetchData();
    }, [user, isAuthenticated]);

    // We no longer use useEffect to sync to localStorage.
    // Instead we update Supabase directly in the handlers.

    const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
        if (!user) return;
        const newId = generateId();
        const newTransaction = { ...transaction, id: newId };

        // Optimistic update
        setTransactions((prev) => [newTransaction, ...prev]);

        // Supabase Insert
        const dbTransaction = {
            id: newId,
            user_id: user.id,
            date: transaction.date,
            amount: transaction.amount,
            type: transaction.type,
            source: transaction.source,
            payment_source: transaction.paymentSource,
            category: transaction.category,
            note: transaction.note,
            custom_category: transaction.customCategory,
        };

        const { error } = await supabase.from('transactions').insert(dbTransaction);

        if (error) {
            console.error('Error adding transaction:', error.message);
            // Revert optimistic update
            setTransactions((prev) => prev.filter((t) => t.id !== newId));
        }
    };

    const editTransaction = async (id: string, updated: Partial<Transaction>) => {
        if (!user) return;

        // Optimistic update
        setTransactions((prev) =>
            prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
        );
        setEditingTransaction(null);

        // Prepare Supabase update
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dbUpdate: any = {};
        if (updated.date !== undefined) dbUpdate.date = updated.date;
        if (updated.amount !== undefined) dbUpdate.amount = updated.amount;
        if (updated.type !== undefined) dbUpdate.type = updated.type;
        if (updated.source !== undefined) dbUpdate.source = updated.source;
        if (updated.paymentSource !== undefined) dbUpdate.payment_source = updated.paymentSource;
        if (updated.category !== undefined) dbUpdate.category = updated.category;
        if (updated.note !== undefined) dbUpdate.note = updated.note;
        if (updated.customCategory !== undefined) dbUpdate.custom_category = updated.customCategory;

        const { error } = await supabase.from('transactions').update(dbUpdate).eq('id', id);

        if (error) {
            console.error('Error updating transaction:', error);
            // We might want to revert here, but it's trickier to know previous state easily without storage
            // In a robust app we'd use React Query or SWR
        }
    };

    const deleteTransaction = async (id: string) => {
        if (!user) return;

        const prevTransactions = transactions;
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        if (editingTransaction?.id === id) {
            setEditingTransaction(null);
        }

        const { error } = await supabase.from('transactions').delete().eq('id', id);

        if (error) {
            console.error('Error deleting transaction:', error);
            setTransactions(prevTransactions); // Revert
        }
    };

    const addCustomCategory = async (category: string) => {
        if (!user) return;
        if (customCategories.includes(category)) return;

        setCustomCategories((prev) => [...prev, category]);

        const { error } = await supabase.from('custom_categories').insert({
            user_id: user.id,
            category: category
        });

        if (error) {
            console.error('Error adding category:', error);
            setCustomCategories((prev) => prev.filter(c => c !== category));
        }
    };

    const addCustomIncomeSource = async (source: string) => {
        if (!user) return;
        if (customIncomeSources.includes(source)) return;

        setCustomIncomeSources((prev) => [...prev, source]);

        const { error } = await supabase.from('custom_income_sources').insert({
            user_id: user.id,
            source: source
        });

        if (error) {
            console.error('Error adding custom income source:', error);
            setCustomIncomeSources((prev) => prev.filter(s => s !== source));
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
                customIncomeSources,
                addCustomIncomeSource,
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
