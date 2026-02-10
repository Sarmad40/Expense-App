
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for categories
const categories = [
    { name: 'Food', amount: 1200, percentage: 38, color: 'bg-orange-500' },
    { name: 'Transport', amount: 1200, percentage: 38, color: 'bg-blue-500' },
    { name: 'Healthcare', amount: 1200, percentage: 38, color: 'bg-yellow-500' },
    { name: 'Education', amount: 1200, percentage: 38, color: 'bg-green-500' },
    { name: 'Clothes', amount: 1200, percentage: 38, color: 'bg-emerald-500' },
    { name: 'Pets', amount: 1200, percentage: 38, color: 'bg-cyan-500' },
    { name: 'Entertainment', amount: 1200, percentage: 38, color: 'bg-gray-500' },
];

export function MonthlyExpensesBreakdown() {
    return (
        <Card className="col-span-4 lg:col-span-1 shadow-none border-0 bg-white rounded-3xl">
            <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">Monthly Expenses Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-6 flex">
                    {categories.map((c, i) => (
                        <div key={i} className={`h-full ${c.color}`} style={{ width: `${c.percentage / 3}%` }} />
                    ))}
                </div>

                <div className="space-y-4">
                    {categories.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                <span className="text-gray-600 font-medium">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-foreground">${item.amount}</span>
                                <span className="text-xs text-gray-400 font-bold">{item.percentage}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
