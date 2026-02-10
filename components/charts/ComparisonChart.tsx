
'use client';

import React from 'react';
/*
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
*/

interface ComparisonChartProps {
    data: any[];
    data1Label: string;
    data2Label: string;
}

export default function ComparisonChart({ data, data1Label, data2Label }: ComparisonChartProps) {
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-lg">
            <p>Chart Loading...</p>
        </div>
    );
    /*
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(val) => formatCurrency(val as number)} />
                <Legend />
                <Bar dataKey={data1Label} fill="#3b82f6" name={data1Label} />
                <Bar dataKey={data2Label} fill="#f97316" name={data2Label} />
            </BarChart>
        </ResponsiveContainer>
    );
    */
}
