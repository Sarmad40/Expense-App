
'use client';

import React from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Transaction } from '@/types';
import { format, parseISO, getMonth } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface YearlyChartsProps {
    transactions: Transaction[];
    year: number;
}

export function YearlyCharts({ transactions, year }: YearlyChartsProps) {
    // Process data for Monthly Expenses (Line Chart) and Income vs Expense (Bar Chart)
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        name: format(new Date(year, i, 1), 'MMM'),
        income: 0,
        expense: 0,
    }));

    transactions.forEach((t) => {
        const date = parseISO(t.date);
        if (date.getFullYear() === year) {
            const monthIndex = getMonth(date);
            if (t.type === 'income') {
                monthlyData[monthIndex].income += t.amount;
            } else {
                monthlyData[monthIndex].expense += t.amount;
            }
        }
    });

    // Process data for Category Pie Chart
    // We can treat year as a "month" effectively for the helper function if we filtered by year, 
    // but better to manually calculate or reuse logic
    const yearlyTransactions = transactions.filter(t => new Date(t.date).getFullYear() === year);

    // Reuse logic directly
    const expenseBreakdown = Object.entries(
        yearlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                const cat = t.category || 'Other';
                acc[cat] = (acc[cat] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));

    const paymentSourceBreakdown = Object.entries(
        yearlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                const source = t.paymentSource || 'Unknown';
                acc[source] = (acc[source] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));

    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="h-[300px] w-full border rounded-lg p-4 bg-card">
                    <h3 className="text-lg font-medium mb-4">Monthly Income vs Expenses</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(value as number)} />
                            <Legend />
                            <Bar dataKey="income" fill="#4ade80" name="Income" />
                            <Bar dataKey="expense" fill="#f87171" name="Expense" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="h-[300px] w-full border rounded-lg p-4 bg-card">
                    <h3 className="text-lg font-medium mb-4">Expense Trend</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(value as number)} />
                            <Legend />
                            <Line type="monotone" dataKey="expense" stroke="#f87171" name="Expense" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="h-[300px] w-full border rounded-lg p-4 bg-card">
                    <h3 className="text-lg font-medium mb-4">Expenses by Category</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={expenseBreakdown}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {expenseBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(value as number)} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="h-[300px] w-full border rounded-lg p-4 bg-card">
                    <h3 className="text-lg font-medium mb-4">Expenses by Payment Source</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={paymentSourceBreakdown}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#82ca9d"
                                dataKey="value"
                            >
                                {paymentSourceBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(value as number)} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
