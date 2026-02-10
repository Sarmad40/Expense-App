
'use client';

import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for the trend chart
const data = [
    { name: '4 Jan', value: 100 },
    { name: '5 Jan', value: 150 },
    { name: '6 Jan', value: 130 },
    { name: '7 Jan', value: 180 },
    { name: '8 Jan', value: 160 },
    { name: '9 Jan', value: 210 },
    { name: '10 Jan', value: 190 },
];

export function BalanceTrendChart() {
    return (
        <Card className="col-span-4 lg:col-span-2 shadow-none border-0 bg-white rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Balance Trends</p>
                    <CardTitle className="text-2xl font-bold text-foreground">
                        $221,478
                    </CardTitle>
                </div>
                <div className="text-right">
                    <div className="text-xs text-muted-foreground">Last Month</div>
                    <div className="text-sm font-bold text-green-500 flex items-center gap-1">
                        +12.25%
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4318FF" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#4318FF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#A3AED0' }}
                                dy={10}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#4318FF"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
