'use client';

import React, { useState, useEffect } from 'react';
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

const transactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1, 'Category is required'),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be a positive number',
  }),
  date: z.string().min(1, 'Date is required'),
  note: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  'SALARY', 'FOOD', 'TRAVEL', 'RENT', 'SHOPPING', 'HEALTH', 'EDUCATION', 'ENTERTAINMENT', 'OTHER'
];

export default function TransactionForm({ initialData, onSuccess, onCancel }: TransactionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialData ? {
      ...initialData,
      amount: initialData.amount.toString(),
      date: initialData.date,
    } : {
      type: 'EXPENSE',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const type = watch('type');

  const onSubmit = async (values: TransactionFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = {
        ...values,
        amount: Number(values.amount),
      };

      if (initialData?.id) {
        await apiClient.put(`transactions/${initialData.id}`, data);
      } else {
        await apiClient.post('transactions', data);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
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
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select 
            defaultValue={type} 
            onValueChange={(val: any) => setValue('type', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select 
            defaultValue={initialData?.category} 
            onValueChange={(val: any) => setValue('category', val)}
          >
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (₹)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('amount')}
        />
        {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          {...register('date')}
        />
        {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Note (Optional)</Label>
        <Input
          id="note"
          placeholder="What was this for?"
          {...register('note')}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update' : 'Add'} Transaction
        </Button>
      </div>
    </form>
  );
}
