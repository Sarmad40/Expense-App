
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
    // Helper to process data and group small values into "Other"
    const processData = (items: Transaction[], type: 'income' | 'expense', key: 'source' | 'category' | 'paymentSource') => {
        const counts = items.reduce((acc, t) => {
            const label = (t as any)[key] || 'Other';
            acc[label] = (acc[label] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

        let data = Object.entries(counts).map(([name, value]) => ({ name, value }));

        // Sort by value descending
        data.sort((a, b) => b.value - a.value);

        // If more than 5 items, group the rest into "Other"
        if (data.length > 5) {
            const top5 = data.slice(0, 5);
            const others = data.slice(5).reduce((sum, item) => sum + item.value, 0);
            if (others > 0) {
                top5.push({ name: 'Other', value: others });
            }
            data = top5;
        }
        return data;
    };

    const incomeData = processData(transactions.filter(t => t.type === 'income'), 'income', 'source');
    const expenseData = processData(transactions.filter(t => t.type === 'expense'), 'expense', 'category');

    // For payment sources, we might want to see all if not too many, but same logic applies is safe
    const paymentMethodData = processData(transactions.filter(t => t.type === 'expense' && t.paymentSource), 'expense', 'paymentSource');

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(val);

    // Premium Color Palette
    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

    if (transactions.length === 0) {
        return (
            <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="min-h-[300px] flex items-center justify-center border-dashed">
                        <div className="text-center text-muted-foreground">
                            <p>No data available</p>
                        </div>
                    </Card>
                ))}
            </div>
        )
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl text-xs">
                    <p className="font-semibold text-slate-700 mb-1">{payload[0].name}</p>
                    <p className="text-indigo-600 font-bold text-sm">
                        {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Income Source Chart */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-slate-600">Income Sources</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
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
                                    stroke="none"
                                >
                                    {incomeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => <span className="text-xs text-slate-500 ml-1">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs gap-2">
                            <div className="h-2 w-2 rounded-full bg-slate-200" />
                            No income data
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Expense Category Chart */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-slate-600">Expense Categories</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
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
                                    stroke="none"
                                >
                                    {expenseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => <span className="text-xs text-slate-500 ml-1">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs gap-2">
                            <div className="h-2 w-2 rounded-full bg-slate-200" />
                            No expense data
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Payment Method Chart */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-slate-600">Payment Methods</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    {paymentMethodData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={paymentMethodData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#64748b' }}
                                    interval={0}
                                />
                                <YAxis
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => `Rs${val / 1000}k`}
                                    tick={{ fill: '#64748b' }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50}>
                                    {paymentMethodData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs gap-2">
                            <div className="h-2 w-2 rounded-full bg-slate-200" />
                            No payment data
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
