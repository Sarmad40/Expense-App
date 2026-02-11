
'use client';

import React, { useState, useEffect } from 'react';
import { useAppData } from '@/components/providers/AppProvider';
import { IncomeSource, ExpenseCategory } from '@/types';
import { Plus, Save, X } from 'lucide-react';

const DEFAULT_CATEGORIES: ExpenseCategory[] = [
    'House Rent',
    'Electricity Bill',
    'Internet Bill',
    'Grocery',
    'Transport',
    'Mobile Bill',
    'Entertainment',
    'Medical',
    'Savings',
];

export function ExpenseForm() {
    const { addTransaction, editTransaction, editingTransaction, setEditingTransaction, customCategories, addCustomCategory, customIncomeSources } = useAppData();
    const [amount, setAmount] = useState('');
    const [paymentSource, setPaymentSource] = useState<string>('Salary');
    const [category, setCategory] = useState<string>('House Rent');
    const [customCategoryInput, setCustomCategoryInput] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');

    const allCategories = [...DEFAULT_CATEGORIES, ...customCategories, 'Other'];
    const defaultSources = ['Salary', 'Freelance', 'Family', 'Credit Card'];
    const allPaymentSources = [...defaultSources, ...customIncomeSources];

    useEffect(() => {
        if (editingTransaction && editingTransaction.type === 'expense') {
            setAmount(editingTransaction.amount.toString());
            const src = editingTransaction.paymentSource || 'Salary';
            setPaymentSource(src);

            const cat = editingTransaction.category || 'Other';
            if (allCategories.includes(cat)) {
                setCategory(cat);
            } else {
                setCategory(cat);
            }

            setDate(editingTransaction.date);
            setNote(editingTransaction.note || '');
        }
    }, [editingTransaction, customCategories, customIncomeSources]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !date) return;

        let finalCategory = category;
        if (category === 'Other') {
            if (!customCategoryInput.trim()) return; // Must provide a name
            finalCategory = customCategoryInput.trim();
            addCustomCategory(finalCategory);
        }

        const formattedAmount = parseFloat(amount);

        if (editingTransaction && editingTransaction.type === 'expense') {
            editTransaction(editingTransaction.id, {
                amount: formattedAmount,
                date,
                paymentSource,
                category: finalCategory,
                note,
            });
        } else {
            addTransaction({
                amount: formattedAmount,
                date,
                type: 'expense',
                paymentSource,
                category: finalCategory,
                note,
            });
        }

        // Reset form
        setAmount('');
        setCategory('House Rent');
        setCustomCategoryInput('');
        setNote('');
    };

    const handleCancel = () => {
        setEditingTransaction(null);
        setAmount('');
        setCategory('House Rent');
        setCustomCategoryInput('');
        setNote('');
        setDate(new Date().toISOString().split('T')[0]);
    }

    const isEditing = editingTransaction && editingTransaction.type === 'expense';

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{isEditing ? 'Edit Expense' : 'Add Expense'}</h3>
                {isEditing && (
                    <button type="button" onClick={handleCancel} className="text-sm text-muted-foreground hover:text-foreground">
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                        step="0.01"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Payment Source</label>
                    <select
                        value={paymentSource}
                        onChange={(e) => setPaymentSource(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        {allPaymentSources.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        {allCategories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                {category === 'Other' && (
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">Custom Category Name</label>
                        <input
                            type="text"
                            value={customCategoryInput}
                            onChange={(e) => setCustomCategoryInput(e.target.value)}
                            placeholder="e.g., Gym, Gifts"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            required
                        />
                    </div>
                )}
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Note (Optional)</label>
                    <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Description"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full md:w-auto"
                >
                    {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                    {isEditing ? 'Update Expense' : 'Add Expense'}
                </button>
                {isEditing && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full md:w-auto"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
