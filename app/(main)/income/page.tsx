
'use client';

import React from 'react';
import { IncomeForm } from '@/components/forms/IncomeForm';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { IncomeBreakdown } from '@/components/dashboard/IncomeBreakdown';

export const dynamic = 'force-dynamic';

export default function IncomePage() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Income Management</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-3 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Income</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <IncomeForm />
                        </CardContent>
                    </Card>
                    <IncomeBreakdown />
                </div>
                <div className="col-span-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Income History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TransactionList type="income" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
