
export type IncomeSource = 'Salary' | 'Freelance' | 'Family' | 'Credit Card' | string;

export type ExpenseCategory =
  | 'House Rent'
  | 'Electricity Bill'
  | 'Internet Bill'
  | 'Grocery'
  | 'Transport'
  | 'Mobile Bill'
  | 'Entertainment'
  | 'Medical'
  | 'Savings'
  | 'Other'
  | string; // Allow custom categories

export interface User {
  id: string;
  username: string;
  email?: string;
  password?: string; // For local auth storage
  pin?: string;
  photoURL?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  amount: number;
  type: 'income' | 'expense';
  source?: IncomeSource;
  paymentSource?: IncomeSource;
  category?: ExpenseCategory;
  note?: string;
  customCategory?: string;
}

export interface MonthlyData {
  month: string; // YYYY-MM
  income: number;
  expenses: number;
  balance: number;
  transactions: Transaction[];
}

export interface AppState {
  transactions: Transaction[];
  customCategories: string[];
  customIncomeSources: string[];
  currency: string;
}
