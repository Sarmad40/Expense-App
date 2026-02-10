
'use client';

import React, { useState, useEffect } from 'react';
import { useAppData } from '@/components/providers/AppProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMonthlySummary, getYearlySummary } from '@/lib/analytics';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';

const ComparisonChart = dynamic(() => import('@/components/charts/ComparisonChart'), { ssr: false });

export const dynamic = 'force-dynamic';

export default function ComparisonPage() {
    const { transactions } = useAppData();
    const [compareMode, setCompareMode] = useState<'monthly' | 'yearly'>('monthly');
    const [mounted, setMounted] = useState(false);

    // Monthly State
    const [month1, setMonth1] = useState(format(new Date(), 'yyyy-MM'));
    const [month2, setMonth2] = useState(format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM'));

    // Yearly State
    const [year1, setYear1] = useState(new Date().getFullYear());
    const [year2, setYear2] = useState(new Date().getFullYear() - 1);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Data Calculation
    let data1: { income: number; expenses: number; balance: number; label: string };
    let data2: { income: number; expenses: number; balance: number; label: string };

    if (compareMode === 'monthly') {
        const d1 = getMonthlySummary(transactions, new Date(month1 + '-01'));
        const d2 = getMonthlySummary(transactions, new Date(month2 + '-01'));
        data1 = { ...d1, label: format(new Date(month1 + '-01'), 'MMM yyyy') };
        data2 = { ...d2, label: format(new Date(month2 + '-01'), 'MMM yyyy') };
    } else {
        const d1 = getYearlySummary(transactions, year1);
        const d2 = getYearlySummary(transactions, year2);
        data1 = { ...d1, label: year1.toString() };
        data2 = { ...d2, label: year2.toString() };
    }

    const chartData = [
        {
            name: 'Income',
            [data1.label]: data1.income,
            [data2.label]: data2.income,
        },
        {
            name: 'Expenses',
            [data1.label]: data1.expenses,
            [data2.label]: data2.expenses,
        },
        {
            name: 'Balance',
            [data1.label]: data1.balance,
            [data2.label]: data2.balance,
        },
    ];

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(val);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Compare Periods</h2>
                <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                    <button
                        onClick={() => setCompareMode('monthly')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${compareMode === 'monthly' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setCompareMode('yearly')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${compareMode === 'yearly' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Yearly
                    </button>
                </div>
            </div>

            {/* Controls */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-end">
                        {compareMode === 'monthly' ? (
                            <>
                                <div className="space-y-2 w-full md:w-auto">
                                    <label className="text-sm font-medium">Period 1</label>
                                    <input
                                        type="month"
                                        value={month1}
                                        onChange={(e) => setMonth1(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2 w-full md:w-auto">
                                    <label className="text-sm font-medium">Period 2</label>
                                    <input
                                        type="month"
                                        value={month2}
                                        onChange={(e) => setMonth2(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2 w-full md:w-auto">
                                    <label className="text-sm font-medium">Year 1</label>
                                    <input
                                        type="number"
                                        value={year1}
                                        onChange={(e) => setYear1(parseInt(e.target.value))}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    />
                                </div>
                                <div className="space-y-2 w-full md:w-auto">
                                    <label className="text-sm font-medium">Year 2</label>
                                    <input
                                        type="number"
                                        value={year2}
                                        onChange={(e) => setYear2(parseInt(e.target.value))}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Comparison Stats */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Period 1 Card */}
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                        <CardTitle>{data1.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Income</span>
                            <span className="font-bold text-green-600">{formatCurrency(data1.income)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Expenses</span>
                            <span className="font-bold text-red-600">{formatCurrency(data1.expenses)}</span>
                        </div>
                        <div className="pt-2 border-t flex justify-between items-center">
                            <span className="font-medium">Balance</span>
                            <span className={`font-bold ${data1.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatCurrency(data1.balance)}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Period 2 Card */}
                <Card className="border-l-4 border-l-orange-500">
                    <CardHeader>
                        <CardTitle>{data2.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Income</span>
                            <span className="font-bold text-green-600">{formatCurrency(data2.income)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Expenses</span>
                            <span className="font-bold text-red-600">{formatCurrency(data2.expenses)}</span>
                        </div>
                        <div className="pt-2 border-t flex justify-between items-center">
                            <span className="font-medium">Balance</span>
                            <span className={`font-bold ${data2.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatCurrency(data2.balance)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Side-by-Side Comparison</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <ComparisonChart data={chartData} data1Label={data1.label} data2Label={data2.label} />
                </CardContent>
            </Card>
        </div>
    );
}
