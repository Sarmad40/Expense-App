
'use client';

import React, { useState, useEffect } from 'react';
import { useAppData } from '@/components/providers/AppProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getMonthlySummary } from '@/lib/analytics';
import { ArrowUp, ArrowDown, Wallet, CalendarRange } from 'lucide-react';
import { format, isSameMonth, parseISO } from 'date-fns';
import nextDynamic from 'next/dynamic';
import Link from 'next/link';

const DashboardCharts = nextDynamic(() => import('@/components/dashboard/DashboardCharts').then(mod => mod.DashboardCharts), { ssr: false });

export const dynamic = 'force-dynamic';

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
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-slate-500 mt-1">Overview of your finances for {format(currentDate, 'MMMM yyyy')}</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
          <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
            <CalendarRange className="h-5 w-5" />
          </div>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border-none bg-transparent text-sm font-medium focus:ring-0 cursor-pointer text-slate-700 outline-none"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Balance Card - Premium Gradient */}
        <Card className="border-0 shadow-lg shadow-indigo-500/20 bg-gradient-to-br from-indigo-600 to-violet-700 text-white relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="h-40 w-40 transform rotate-12" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-indigo-100">Total Balance</CardTitle>
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
              <Wallet className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">
              {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(balance)}
            </div>
            <p className="text-xs text-indigo-100 mt-1 flex items-center gap-1 opacity-90">
              {balance >= 0 ? 'You are saving well!' : 'Expenses exceeding income'}
            </p>
          </CardContent>
        </Card>

        {/* Income Card - Clean White with Emerald Accent */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Income</CardTitle>
            <div className="p-2 bg-emerald-50 rounded-xl">
              <ArrowUp className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(income)}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">+12%</span> vs last month
            </p>
          </CardContent>
        </Card>

        {/* Expense Card - Clean White with Rose Accent */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-rose-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Expenses</CardTitle>
            <div className="p-2 bg-rose-50 rounded-xl">
              <ArrowDown className="h-4 w-4 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(expenses)}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded text-[10px]">+5%</span> vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visualizations Section */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-5 px-1 flex items-center gap-2">
          <span className="w-1 h-6 bg-indigo-500 rounded-full inline-block"></span>
          Financial Analysis
        </h3>
        <DashboardCharts transactions={monthlyTransactions} />
      </div>

      {/* Recent Activity Section */}
      <Card className="border-0 shadow-sm bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">Recent Transactions</CardTitle>
              <CardDescription className="text-slate-500">Your latest financial movements</CardDescription>
            </div>
            <Link
              href="/transactions"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors"
            >
              View All
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="">
            {monthlyTransactions.length === 0 ? (
              <div className="text-center py-16">
                <div className="p-4 bg-slate-50 rounded-full w-fit mx-auto mb-4">
                  <Wallet className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">No transactions found.</p>
                <p className="text-xs text-slate-400 mt-1">Add expenses or income to see them here.</p>
              </div>
            ) : (
              monthlyTransactions
                .slice()
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((t, i) => (
                  <div key={t.id} className={`flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors group ${i !== monthlyTransactions.slice(0, 5).length - 1 ? 'border-b border-slate-50' : ''}`}>
                    <div className="flex items-center gap-4">
                      {/* Icon Box */}
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors 
                        ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {t.type === 'income' ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                      </div>

                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-700 group-hover:text-indigo-900 transition-colors">
                          {t.type === 'income' ? t.source : t.category}
                        </p>
                        <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                          {format(new Date(t.date), 'MMM dd, yyyy')}
                          {t.paymentSource && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span>{t.paymentSource}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className={`font-bold text-base ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-700'}`}>
                      {t.type === 'income' ? '+' : '-'}{new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(t.amount)}
                    </div>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer / Copyright */}
      <div className="text-center text-xs text-slate-400 pt-8 pb-4">
        © {new Date().getFullYear()} FinTrack. Secure & Private.
      </div>
    </div>
  );
}
