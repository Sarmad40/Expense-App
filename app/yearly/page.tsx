
'use client';

import React, { useState } from 'react';
import { useAppData } from '@/components/providers/AppProvider';
import { YearlyCharts } from '@/components/charts/YearlyCharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getYearlySummary } from '@/lib/analytics';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function YearlyPage() {
    const { transactions } = useAppData();
    const [year, setYear] = useState(new Date().getFullYear());

    const { income, expenses, balance } = getYearlySummary(transactions, year);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Yearly Overview</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setYear(year - 1)}
                        className="p-2 hover:bg-muted rounded-full"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <span className="text-lg font-medium">{year}</span>
                    <button
                        onClick={() => setYear(year + 1)}
                        className="p-2 hover:bg-muted rounded-full"
                    >
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(income)}
                        </div>
                        <p className="text-xs text-muted-foreground">in {year}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(expenses)}
                        </div>
                        <p className="text-xs text-muted-foreground">in {year}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(balance)}
                        </div>
                        <p className="text-xs text-muted-foreground">in {year}</p>
                    </CardContent>
                </Card>
            </div>

            <YearlyCharts transactions={transactions} year={year} />
        </div>
    );
}
