
'use client';

import React, { useState, useEffect } from 'react';
import { useAppData } from '@/components/providers/AppProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getMonthlySummary } from '@/lib/analytics';
import { ArrowUp, ArrowDown, Wallet, CalendarRange } from 'lucide-react';
import { format, isSameMonth, parseISO } from 'date-fns';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';

export default function Dashboard() {
  const { transactions } = useAppData();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      setCurrentDate(new Date(selectedMonth + '-01'));
    }
  }, [selectedMonth]);

  if (!mounted) {
    return null;
  }

  const { income, expenses, balance } = getMonthlySummary(transactions, currentDate);

  const monthlyTransactions = transactions.filter(t =>
    isSameMonth(parseISO(t.date), currentDate)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-indigo-950">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Overview of your finances for {format(currentDate, 'MMMM yyyy')}</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-indigo-50">
          <div className="p-2 bg-indigo-50 rounded-xl text-primary">
            <CalendarRange className="h-5 w-5" />
          </div>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border-none bg-transparent text-sm font-medium focus:ring-0 cursor-pointer text-indigo-950"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Balance Card - Featured */}
        <Card className="border-0 shadow-xl shadow-indigo-500/20 bg-gradient-to-br from-primary to-violet-600 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="h-24 w-24 transform rotate-12" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-indigo-100">Total Balance</CardTitle>
            <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
              <Wallet className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">
              {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(balance)}
            </div>
            <p className="text-xs text-indigo-100 mt-1">
              {balance >= 0 ? 'You are saving well!' : 'Expenses exceeding income'}
            </p>
          </CardContent>
        </Card>

        {/* Income Card */}
        <Card className="border-0 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-shadow bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            <div className="p-2 bg-emerald-50 rounded-full">
              <ArrowUp className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(income)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-medium">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        {/* Expense Card */}
        <Card className="border-0 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-shadow bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <div className="p-2 bg-rose-50 rounded-full">
              <ArrowDown className="h-4 w-4 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(expenses)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-rose-600 font-medium">+5%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visualizations Section */}
      <div>
        <h3 className="text-lg font-semibold text-indigo-950 mb-4 px-1">Financial Analysis</h3>
        <DashboardCharts transactions={monthlyTransactions} />
      </div>

      {/* Recent Activity Section */}
      <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-indigo-950">Recent Transactions</CardTitle>
              <CardDescription>Your latest financial movements</CardDescription>
            </div>
            <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">View All</button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyTransactions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-3">
                  <Wallet className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-muted-foreground font-medium">No transactions found for this month.</p>
                <p className="text-xs text-muted-foreground mt-1">Start adding income or expenses to see them here.</p>
              </div>
            ) : (
              monthlyTransactions
                .slice()
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-5">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200' : 'bg-rose-100 text-rose-600 group-hover:bg-rose-200'}`}>
                        {t.type === 'income' ? <ArrowUp className="h-6 w-6" /> : <ArrowDown className="h-6 w-6" />}
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-gray-900 leading-none">{t.type === 'income' ? t.source : t.category}</p>
                        <p className="text-xs text-muted-foreground font-medium">{format(new Date(t.date), 'PPP')}</p>
                      </div>
                    </div>
                    <div className={`font-bold text-lg ${t.type === 'income' ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {t.type === 'income' ? '+' : '-'}{new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(t.amount)}
                    </div>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer / Copyright */}
      <div className="text-center text-xs text-muted-foreground pt-8 pb-4">
        © {new Date().getFullYear()} FinTrack. Secure & Private.
      </div>
    </div>
  );
}
