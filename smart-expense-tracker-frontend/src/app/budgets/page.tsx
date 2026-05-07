'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import apiClient from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import BudgetForm from '@/components/features/budget-form';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BudgetAlert {
  category: string;
  limitAmount: number;
  spentAmount: number;
  usagePercent: number;
  alertLevel: 'SAFE' | 'WARNING' | 'EXCEEDED';
}

export default function BudgetsPage() {
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear] = useState(new Date().getFullYear());

  const fetchBudgets = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`budgets/alerts?month=${selectedMonth}&year=${selectedYear}`);
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching budget alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth, selectedYear]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Set Budget
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <p className="text-muted-foreground">Loading budgets...</p>
          ) : alerts.length === 0 ? (
            <Card className="col-span-full py-12">
              <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-muted-foreground opacity-20" />
                <div className="space-y-1">
                  <p className="font-medium">No budgets set for this month</p>
                  <p className="text-sm text-muted-foreground">Set category-wise limits to track your spending.</p>
                </div>
                <Button variant="outline" onClick={() => setIsModalOpen(true)}>Add your first budget</Button>
              </CardContent>
            </Card>
          ) : (
            alerts.map((alert) => (
              <Card key={alert.category} className="bg-card border-border overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-lg font-bold">{alert.category}</CardTitle>
                  <Badge variant={alert.alertLevel === 'EXCEEDED' ? 'destructive' : alert.alertLevel === 'WARNING' ? 'outline' : 'outline'} 
                         className={alert.alertLevel === 'SAFE' ? 'border-emerald-500 text-emerald-500' : alert.alertLevel === 'WARNING' ? 'border-yellow-500 text-yellow-500' : ''}>
                    {alert.alertLevel}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spent: ₹{alert.spentAmount?.toLocaleString()}</span>
                      <span className="font-medium">Limit: ₹{alert.limitAmount?.toLocaleString()}</span>
                    </div>
                    <Progress 
                      value={alert.usagePercent} 
                      className={cn(
                        "h-2",
                        alert.alertLevel === 'EXCEEDED' ? "bg-destructive/20" : "bg-muted"
                      )} 
                      indicatorClassName={cn(
                        alert.alertLevel === 'EXCEEDED' ? "bg-destructive" : 
                        alert.alertLevel === 'WARNING' ? "bg-yellow-500" : "bg-emerald-500"
                      )}
                    />
                    <p className={cn(
                      "text-right text-xs font-medium",
                      alert.alertLevel === 'EXCEEDED' ? "text-destructive" : "text-muted-foreground"
                    )}>
                      {alert.usagePercent?.toFixed(1)}% used
                    </p>
                  </div>

                  {alert.alertLevel === 'EXCEEDED' ? (
                    <div className="flex items-center text-xs text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">
                      <AlertCircle className="h-3 w-3 mr-2" />
                      Budget exceeded by ₹{(alert.spentAmount - alert.limitAmount).toLocaleString()}
                    </div>
                  ) : alert.alertLevel === 'SAFE' ? (
                    <div className="flex items-center text-xs text-emerald-500 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3 mr-2" />
                      Everything looks good!
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Set Category Budget</DialogTitle>
            </DialogHeader>
            <BudgetForm 
              onSuccess={() => {
                setIsModalOpen(false);
                fetchBudgets();
              }}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
