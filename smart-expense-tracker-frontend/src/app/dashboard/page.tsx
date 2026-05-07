'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus,
  ArrowRight,
  PieChart as PieChartIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c'];

interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

interface Transaction {
  id: number;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  date: string;
  note: string;
}

interface CategoryData {
  category: string;
  totalAmount: number;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<SummaryData>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const [summaryRes, transactionsRes, categoryRes] = await Promise.all([
          apiClient.get(`analytics/monthly-report?month=${month}&year=${year}`),
          apiClient.get('transactions'),
          apiClient.get(`analytics/category-wise?month=${month}&year=${year}`),
        ]);

        setSummary(summaryRes.data || { totalIncome: 0, totalExpense: 0, balance: 0 });
        setRecentTransactions(transactionsRes.data?.slice(0, 5) || []);
        setCategoryData(categoryRes.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <div className="flex items-center space-x-2">
            <Link href="/transactions">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Transaction
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{summary?.balance?.toLocaleString() ?? '0'}</div>
              <p className="text-xs text-muted-foreground mt-1">Current available funds</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">₹{summary?.totalIncome?.toLocaleString() ?? '0'}</div>
              <p className="text-xs text-muted-foreground mt-1">Total earnings this month</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-500">₹{summary?.totalExpense?.toLocaleString() ?? '0'}</div>
              <p className="text-xs text-muted-foreground mt-1">Total spending this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions & Charts */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 bg-card border-border">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-10">Loading...</TableCell>
                    </TableRow>
                  ) : recentTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">No transactions found</TableCell>
                    </TableRow>
                  ) : (
                    recentTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>
                          <div className="font-medium">{tx.category}</div>
                          <div className="text-xs text-muted-foreground">{tx.date}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={tx.type === 'INCOME' ? 'outline' : 'destructive'} className={tx.type === 'INCOME' ? 'border-emerald-500 text-emerald-500' : ''}>
                            {tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell className={tx.type === 'INCOME' ? 'text-right text-emerald-500 font-bold' : 'text-right text-rose-500 font-bold'}>
                          {tx.type === 'INCOME' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-end">
                <Link href="/transactions" className="text-sm text-primary flex items-center hover:underline">
                  View all transactions <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3 bg-card border-border">
            <CardHeader>
              <CardTitle>Spending Insights</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">Loading chart...</div>
              ) : categoryData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <PieChartIcon className="h-16 w-16 mb-4 opacity-20" />
                  <p className="text-sm text-center">No data available for this month</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="totalAmount"
                      nameKey="category"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
