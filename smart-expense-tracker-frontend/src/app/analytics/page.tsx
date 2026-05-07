'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import apiClient from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c'];

interface CategoryData {
  category: string;
  totalAmount: number;
}

interface TrendData {
  month: string;
  income: number;
  expense: number;
}

export default function AnalyticsPage() {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedMonth = new Date().getMonth() + 1;
  const selectedYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, trendRes] = await Promise.all([
          apiClient.get(`analytics/category-wise?month=${selectedMonth}&year=${selectedYear}`),
          apiClient.get(`analytics/monthly-trend?year=${selectedYear}`),
        ]);
        setCategoryData(catRes.data);
        setTrendData(trendRes.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Category Breakdown (Pie Chart) */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Expense by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">Loading chart...</div>
              ) : categoryData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">No data available for this month</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
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
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Monthly Trend (Area Chart) */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Income vs Expense Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">Loading chart...</div>
              ) : trendData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">No trend data available</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trendData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `₹${value/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                      formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
                    />
                    <Legend verticalAlign="top" align="right" />
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#10b981" 
                      fillOpacity={1} 
                      fill="url(#colorIncome)" 
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expense" 
                      stroke="#f43f5e" 
                      fillOpacity={1} 
                      fill="url(#colorExpense)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
