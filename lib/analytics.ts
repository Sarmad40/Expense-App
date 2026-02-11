
import { Transaction } from '@/types';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

export function getMonthlySummary(transactions: Transaction[], date: Date) {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const monthlyTransactions = transactions.filter((t) =>
        isWithinInterval(parseISO(t.date), { start, end })
    );

    const income = monthlyTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthlyTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    return {
        income,
        expenses,
        balance,
        transactions: monthlyTransactions,
    };
}

export function getCategoryBreakdown(transactions: Transaction[], type: 'income' | 'expense', date: Date) {
    const { transactions: monthlyTransactions } = getMonthlySummary(transactions, date);

    const filtered = monthlyTransactions.filter(t => t.type === type);

    const breakdown: Record<string, number> = {};

    filtered.forEach(t => {
        const key = type === 'income' ? (t.source || 'Other') : (t.category || 'Other');
        breakdown[key] = (breakdown[key] || 0) + t.amount;
    });

    return Object.entries(breakdown)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
}

export function getYearlySummary(transactions: Transaction[], year: number) {
    const yearlyTransactions = transactions.filter(t => new Date(t.date).getFullYear() === year);

    const income = yearlyTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = yearlyTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    return {
        income,
        expenses,
        balance: income - expenses,
        transactions: yearlyTransactions
    };
}
