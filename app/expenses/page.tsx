
'use client';

import React from 'react';
import { ExpenseForm } from '@/components/forms/ExpenseForm';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ExpensesPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Expense Management</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Expense</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ExpenseForm />
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Expense History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TransactionList type="expense" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
