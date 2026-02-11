import React from 'react';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default function TransactionsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold tracking-tight text-indigo-950">Transactions</h2>
            <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white">
                <CardHeader>
                    <CardTitle>All Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <TransactionList type="all" />
                </CardContent>
            </Card>
        </div>
    );
}
