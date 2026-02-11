'use client';

import React from 'react';
import { useAppData } from '@/components/providers/AppProvider';
// import { Transaction } from '@/types';
import { Trash2, Edit } from 'lucide-react';

interface TransactionListProps {
    type: 'income' | 'expense' | 'all';
}

export function TransactionList({ type }: TransactionListProps) {
    const { transactions, deleteTransaction, setEditingTransaction, customIncomeSources } = useAppData();
    const [filterSource, setFilterSource] = React.useState<string>('All');
    const [filterType, setFilterType] = React.useState<'all' | 'income' | 'expense'>('all');

    // Initialize/Sync filterType based on props
    React.useEffect(() => {
        if (type !== 'all') {
            setFilterType(type);
        } else {
            setFilterType('all');
        }
        setFilterSource('All'); // Reset source when entering/changing type context
    }, [type]);

    // Derived sources
    const expensePaymentSources = ['Salary', 'Freelance', 'Family', 'Credit Card', ...customIncomeSources];
    const incomeSources = ['Salary', 'Freelance', 'Family', ...customIncomeSources];

    const availableSources = React.useMemo(() => {
        if (filterType === 'expense') return ['All', ...expensePaymentSources];
        if (filterType === 'income') return ['All', ...incomeSources];
        return ['All'];
    }, [filterType, customIncomeSources, expensePaymentSources, incomeSources]);

    const filteredTransactions = transactions
        .filter((t) => {
            // 1. Filter by Type
            if (type !== 'all') return t.type === type; // Strict prop enforcement
            if (filterType !== 'all') return t.type === filterType;
            return true;
        })
        .filter((t) => {
            // 2. Filter by Source
            if (filterSource === 'All') return true;

            if (t.type === 'income') {
                return t.source === filterSource;
            }
            if (t.type === 'expense') {
                return t.paymentSource === filterSource;
            }
            return true;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-medium capitalize">Recent {type === 'all' ? 'Transactions' : type + 's'}</h3>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Type Filter - Only show if page type is 'all' */}
                    {type === 'all' && (
                        <select
                            value={filterType}
                            onChange={(e) => {
                                setFilterType(e.target.value as 'all' | 'income' | 'expense');
                                setFilterSource('All');
                            }}
                            className="h-8 rounded-md border border-input bg-background px-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="all">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    )}

                    {/* Source Filter - Show if a specific type is active (either via prop or filter) */}
                    {filterType !== 'all' && (
                        <select
                            value={filterSource}
                            onChange={(e) => setFilterSource(e.target.value)}
                            className="h-8 rounded-md border border-input bg-background px-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {availableSources.map((s, i) => (
                                <option key={`${s}-${i}`} value={s}>{s === 'All' ? 'All Sources' : s}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {filteredTransactions.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground border rounded-lg border-dashed">
                    No transactions found matching your filters.
                </div>
            ) : (
                <div className="border rounded-lg overflow-hidden overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[600px]">
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
                                        <div className="font-medium">{t.type === 'income' ? t.source : t.category}</div>
                                        {t.paymentSource && <div className="text-xs text-muted-foreground">via {t.paymentSource}</div>}
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
