'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import apiClient from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import TransactionForm from '@/components/features/transaction-form';

interface Transaction {
  id: number;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  date: string;
  note: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await apiClient.delete(`transactions/${id}`);
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.note?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <Button onClick={() => {
            setEditingTransaction(null);
            setIsModalOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        </div>

        <div className="flex items-center space-x-2 bg-card p-2 rounded-lg border border-border max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground ml-2" />
          <Input 
            placeholder="Search by category or note..." 
            className="border-none bg-transparent focus-visible:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Note</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">{tx.date}</TableCell>
                    <TableCell>{tx.category}</TableCell>
                    <TableCell>
                      <Badge variant={tx.type === 'INCOME' ? 'outline' : 'destructive'} className={tx.type === 'INCOME' ? 'border-emerald-500 text-emerald-500' : ''}>
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{tx.note || '-'}</TableCell>
                    <TableCell className={tx.type === 'INCOME' ? 'text-right text-emerald-500 font-bold' : 'text-right text-rose-500 font-bold'}>
                      {tx.type === 'INCOME' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(tx)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(tx.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingTransaction ? 'Edit' : 'Add'} Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm 
              initialData={editingTransaction} 
              onSuccess={() => {
                setIsModalOpen(false);
                fetchTransactions();
              }}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
