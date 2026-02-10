
'use client';

import React from 'react';
import {
    PieChart, Pie, Cell, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Transaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardChartsProps {
    transactions: Transaction[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function DashboardCharts({ transactions }: DashboardChartsProps) {
    // 1. Income Source Breakdown
    const incomeData = Object.entries(
        transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => {
                const source = t.source || 'Other';
                acc[source] = (acc[source] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));

    // 2. Expense Category Breakdown
    const expenseData = Object.entries(
        transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                const cat = t.category || 'Other';
                acc[cat] = (acc[cat] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));

    // 3. Payment Method Breakdown (Expenses)
    const paymentMethodData = Object.entries(
        transactions
            .filter(t => t.type === 'expense' && t.paymentSource)
            .reduce((acc, t) => {
                const source = t.paymentSource || 'Unknown';
                acc[source] = (acc[source] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(val);

    if (transactions.length === 0) return null;

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Income Source Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Income Sources</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                    {incomeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={incomeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {incomeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(val) => formatCurrency(val as number)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            No income data
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Expense Category Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Expense Categories</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                    {expenseData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {expenseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(val) => formatCurrency(val as number)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            No expense data
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Payment Method Chart */}
            <Card className="md:col-span-2 lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Payment Methods Used</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                    {paymentMethodData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={paymentMethodData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rs ${val}`} />
                                <Tooltip formatter={(val) => formatCurrency(val as number)} cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                                    {paymentMethodData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            No payment data
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
