
'use client';

import React, { useState, useEffect } from 'react';
import { useAppData } from '@/components/providers/AppProvider';
// import { IncomeSource } from '@/types';
import { Plus, Save, X } from 'lucide-react';

export function IncomeForm() {
    const { addTransaction, editTransaction, editingTransaction, setEditingTransaction, customIncomeSources, addCustomIncomeSource } = useAppData();
    const [amount, setAmount] = useState('');
    const [source, setSource] = useState<string>('Salary');
    const [customSourceInput, setCustomSourceInput] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const defaultSources = ['Salary', 'Freelance', 'Family', 'Credit Card'];
    const allSources = [...defaultSources, ...customIncomeSources, 'Other'];

    useEffect(() => {
        if (editingTransaction && editingTransaction.type === 'income') {
            // Initialize form for editing
            /* eslint-disable react-hooks/set-state-in-effect */
            setAmount(editingTransaction.amount.toString());
            const src = editingTransaction.source || 'Salary';

            if (defaultSources.includes(src) || customIncomeSources.includes(src)) {
                setSource(src);
            } else {
                setSource(src); // It might be a custom source not yet loaded or just string
            }

            setDate(editingTransaction.date);
            /* eslint-enable react-hooks/set-state-in-effect */
        }
    }, [editingTransaction, customIncomeSources]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !date) return;

        let finalSource = source;
        if (source === 'Other') {
            if (!customSourceInput.trim()) return;
            finalSource = customSourceInput.trim();
            addCustomIncomeSource(finalSource);
        }

        const formattedAmount = parseFloat(amount);

        if (editingTransaction && editingTransaction.type === 'income') {
            editTransaction(editingTransaction.id, {
                amount: formattedAmount,
                date,
                source: finalSource,
                note: `Income from ${finalSource}`,
            });
        } else {
            addTransaction({
                amount: formattedAmount,
                date,
                type: 'income',
                source: finalSource,
                note: `Income from ${finalSource}`,
            });
        }

        // Reset form
        setAmount('');
        setSource('Salary');
        setCustomSourceInput('');
    };

    const handleCancel = () => {
        setEditingTransaction(null);
        setAmount('');
        setSource('Salary');
        setCustomSourceInput('');
        setDate(new Date().toISOString().split('T')[0]);
    }

    const isEditing = editingTransaction && editingTransaction.type === 'income';

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{isEditing ? 'Edit Income' : 'Add Income'}</h3>
                {isEditing && (
                    <button type="button" onClick={handleCancel} className="text-sm text-muted-foreground hover:text-foreground">
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <label className="text-sm font-medium">Source</label>
                    <select
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        {allSources.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
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

                {source === 'Other' && (
                    <div className="space-y-2 md:col-span-3 animate-in fade-in slide-in-from-top-1">
                        <label className="text-sm font-medium">Custom Source Name</label>
                        <input
                            type="text"
                            value={customSourceInput}
                            onChange={(e) => setCustomSourceInput(e.target.value)}
                            placeholder="e.g., Side Hustle, Gift"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            required
                        />
                    </div>
                )}
            </div>
            <div className="flex gap-2">
                <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full md:w-auto"
                >
                    {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                    {isEditing ? 'Update Income' : 'Add Income'}
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
