'use client';

import React from 'react';
import { useAppData } from '@/components/providers/AppProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

export function IncomeBreakdown() {
    const { transactions, customIncomeSources } = useAppData();

    // Default sources + custom
    const defaultSources = ['Salary', 'Freelance', 'Family', 'Credit Card'];
    const allSources = Array.from(new Set([...defaultSources, ...customIncomeSources]));

    // Calculate totals per source
    const sourceData = allSources.map(source => {
        const income = transactions
            .filter(t => t.type === 'income' && t.source === source)
            .reduce((sum, t) => sum + t.amount, 0);

        const spent = transactions
            .filter(t => t.type === 'expense' && t.paymentSource === source)
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            source,
            income,
            spent,
            remaining: income - spent
        };
    }).filter(data => data.income > 0 || data.spent > 0) // Only show active sources
        .sort((a, b) => b.income - a.income); // Sort by highest income

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(val);

    if (sourceData.length === 0) {
        return null; // Don't show if no data
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Income Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {sourceData.map((item) => {
                    const totalActivity = Math.max(item.income, item.spent);
                    const incomePercent = totalActivity > 0 ? (item.income / totalActivity) * 100 : 0;
                    const spentPercent = item.income > 0 ? (item.spent / item.income) * 100 : 0;

                    // Cap at 100% for visual sanity if overspent
                    const visualSpentPercent = Math.min(spentPercent, 100);

                    return (
                        <div key={item.source} className="space-y-2">
                            {/* Header Row */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-indigo-50 rounded-md">
                                        <Wallet className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <span className="font-medium text-sm">{item.source}</span>
                                </div>
                                <div className="text-right">
                                    <span className={`text-sm font-bold ${item.remaining >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {formatCurrency(item.remaining)}
                                    </span>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Remaining</p>
                                </div>
                            </div>

                            {/* Progress Bar Container */}
                            <div className="space-y-1">
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                    {/* Income Amount representing the total available space effectively? 
                                        Actually, usually we want to show 'Spent' as a portion of 'Income'.
                                    */}
                                    <div
                                        className={`h-full ${item.remaining < 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${visualSpentPercent}%` }}
                                    />
                                    {/* If remaining is positive, it's the empty space essentially, but let's make it more explicit if we want 
                                        Actually standard progress bar: Left side filled is used, right side empty is remaining.
                                        If we use color: 
                                        - Filled part = Spent
                                        - Color = Red if > 100%, Green/Blue if < 100%?
                                        Let's stick to standard: Filled = Spent.
                                    */}
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Spent: {formatCurrency(item.spent)} ({Math.round(spentPercent)}%)</span>
                                    <span>Total Income: {formatCurrency(item.income)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
