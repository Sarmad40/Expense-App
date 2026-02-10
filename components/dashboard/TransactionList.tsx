
'use client';

import React from 'react';
import { useAppData } from '@/components/providers/AppProvider';
import { Transaction } from '@/types';
import { Trash2, Edit } from 'lucide-react';

interface TransactionListProps {
    type: 'income' | 'expense';
}

export function TransactionList({ type }: TransactionListProps) {
    const { transactions, deleteTransaction, setEditingTransaction } = useAppData();

    const filteredTransactions = transactions
        .filter((t) => t.type === type)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (filteredTransactions.length === 0) {
        return (
            <div className="text-center p-8 text-muted-foreground border rounded-lg border-dashed">
                No {type} transactions found.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium capitalize">Recent {type}s</h3>
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3 font-medium">Date</th>
                            <th className="px-4 py-3 font-medium">Source/Category</th>
                            <th className="px-4 py-3 font-medium text-right">Amount</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredTransactions.map((t) => (
                            <tr key={t.id} className="hover:bg-muted/50">
                                <td className="px-4 py-3">{t.date}</td>
                                <td className="px-4 py-3">
                                    {type === 'income' ? t.source : t.category}
                                    {t.paymentSource && <span className="text-xs text-muted-foreground block">via {t.paymentSource}</span>}
                                </td>
                                <td className="px-4 py-3 text-right font-medium">
                                    {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(t.amount)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingTransaction(t);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="text-primary hover:text-primary/80 p-1 rounded-md transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteTransaction(t.id)}
                                            className="text-destructive hover:text-destructive/80 p-1 rounded-md transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
