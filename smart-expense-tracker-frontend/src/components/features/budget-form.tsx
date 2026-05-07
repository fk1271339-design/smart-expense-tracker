'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import apiClient from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const budgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  limitAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Limit must be a positive number',
  }),
  month: z.number().min(1).max(12),
  year: z.number(),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  'FOOD', 'TRAVEL', 'RENT', 'SHOPPING', 'HEALTH', 'EDUCATION', 'ENTERTAINMENT', 'OTHER'
];

export default function BudgetForm({ onSuccess, onCancel }: BudgetFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
  });

  const onSubmit = async (values: BudgetFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = {
        category: values.category,
        limitAmount: Number(values.limitAmount),
        month: values.month,
        year: values.year
      };
      await apiClient.post('budgets', data);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong while setting the budget.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label>Category</Label>
        <Select onValueChange={(val: any) => setValue('category', val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="limitAmount">Budget Limit (₹)</Label>
        <Input
          id="limitAmount"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('limitAmount')}
        />
        {errors.limitAmount && <p className="text-xs text-destructive">{errors.limitAmount.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Month</Label>
          <Select 
            defaultValue={String(new Date().getMonth() + 1)} 
            onValueChange={(val: any) => setValue('month', Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Year</Label>
          <Select 
            defaultValue={String(new Date().getFullYear())} 
            onValueChange={(val: any) => setValue('year', Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {[2024, 2025, 2026, 2027].map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Set Budget
        </Button>
      </div>
    </form>
  );
}
