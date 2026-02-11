
'use client';

import React from 'react';
import { useAppData } from '@/components/providers/AppProvider';
import { Transaction } from '@/types';
import { Trash2, Edit } from 'lucide-react';

interface TransactionListProps {
    type: 'income' | 'expense' | 'all';
}

export function TransactionList({ type }: TransactionListProps) {
    const { transactions, deleteTransaction, setEditingTransaction, customIncomeSources } = useAppData();
    const [filterSource, setFilterSource] = React.useState<string>('All');
    const [filterType, setFilterType] = React.useState<'all' | 'income' | 'expense'>('all'); // Internal filter for 'all' mode

    const defaultSources = ['Salary', 'Freelance', 'Family', 'Credit Card'];
    const allPaymentSources = ['All', ...defaultSources, ...customIncomeSources];

    const filteredTransactions = transactions
        .filter((t) => type === 'all' ? true : t.type === type)
        .filter((t) => {
            // If type is 'all', we might want internal type filtering too? For now let's keep it simple or align with 'expense' filter logic if needed.
            // But the original code only filtered paymentSource for expenses.
            // Let's keep paymentSource filter only active if we are strictly looking at expenses OR if the transaction IS an expense?
            // Simpler: Only show filter dropdown if type is 'expense'. 

            // If we want to filter by payment source in 'all' view, it's complicated because income doesn't have it.
            // So for 'all' view, let's just disable payment source filter for now to keep it simple, or only apply it to expenses.

            if (type === 'expense' && filterSource !== 'All') {
                return t.paymentSource === filterSource;
            }
            return true;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (transactions.filter(t => type === 'all' ? true : t.type === type).length === 0) {
        return (
            <div className="text-center p-8 text-muted-foreground border rounded-lg border-dashed">
                No {type === 'all' ? 'transactions' : type + 's'} found.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium capitalize">Recent {type === 'all' ? 'Transactions' : type + 's'}</h3>
                {type === 'expense' && (
                    <select
                        value={filterSource}
                        onChange={(e) => setFilterSource(e.target.value)}
                        className="h-8 rounded-md border border-input bg-background px-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        {allPaymentSources.map(s => (
                            <option key={s} value={s}>{s === 'All' ? 'All Sources' : s}</option>
                        ))}
                    </select>
                )}
            </div>

            {filteredTransactions.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground border rounded-lg border-dashed">
                    No transactions found.
                </div>
            ) : (
                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium">Type</th>
                                <th className="px-4 py-3 font-medium">Source/Category</th>
                                <th className="px-4 py-3 font-medium text-right">Amount</th>
                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredTransactions.map((t) => (
                                <tr key={t.id} className="hover:bg-muted/50">
                                    <td className="px-4 py-3">{t.date}</td>
                                    <td className="px-4 py-3 capitalize">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {t.type === 'income' ? t.source : t.category}
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
            )}
        </div>
    );
}
