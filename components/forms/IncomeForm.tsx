
'use client';

import React, { useState, useEffect } from 'react';
import { useAppData } from '@/components/providers/AppProvider';
import { IncomeSource } from '@/types';
import { Plus, Save, X } from 'lucide-react';

export function IncomeForm() {
    const { addTransaction, editTransaction, editingTransaction, setEditingTransaction } = useAppData();
    const [amount, setAmount] = useState('');
    const [source, setSource] = useState<IncomeSource>('Salary');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (editingTransaction && editingTransaction.type === 'income') {
            setAmount(editingTransaction.amount.toString());
            setSource((editingTransaction.source as IncomeSource) || 'Salary');
            setDate(editingTransaction.date);
        } else {
            // Only reset if we are NOT editing anything (or if we switched from exp to inc?) 
            // Actually simpler: if not editing, keep defaults or clear? 
            // Keeping defaults is fine, but we should clear if we cancel.
        }
    }, [editingTransaction]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !date) return;

        const formattedAmount = parseFloat(amount);

        if (editingTransaction && editingTransaction.type === 'income') {
            editTransaction(editingTransaction.id, {
                amount: formattedAmount,
                date,
                source,
                note: `Income from ${source}`,
            });
        } else {
            addTransaction({
                amount: formattedAmount,
                date,
                type: 'income',
                source,
                note: `Income from ${source}`,
            });
        }

        // Reset form
        setAmount('');
        setSource('Salary');
        // Keep date as is or reset? Resetting to today is usually better or keep. 
        // Let's reset to today if we want, or keep last.
    };

    const handleCancel = () => {
        setEditingTransaction(null);
        setAmount('');
        setSource('Salary');
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
                        onChange={(e) => setSource(e.target.value as IncomeSource)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="Salary">Salary</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Family">Family</option>
                        <option value="Credit Card">Credit Card</option>
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
