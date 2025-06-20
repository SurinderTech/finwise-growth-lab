
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AddExpenseFormProps {
  onExpenseAdded: () => void;
}

export const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onExpenseAdded }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    payment_method: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    'Food & Dining',
    'Transport',
    'Entertainment',
    'Shopping',
    'Bills & Utilities',
    'Health & Medical',
    'Education',
    'Travel',
    'Groceries',
    'Other'
  ];

  const paymentMethods = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'UPI',
    'Net Banking',
    'Wallet',
    'Other'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setReceiptFile(file);
    }
  };

  const uploadReceipt = async (): Promise<string | null> => {
    if (!receiptFile || !user) return null;

    const fileExt = receiptFile.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('receipts')
      .upload(fileName, receiptFile);

    if (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload receipt');
      return null;
    }

    const { data } = supabase.storage
      .from('receipts')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const addExpense = async () => {
    if (!user || !formData.amount || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      let receiptUrl = null;
      if (receiptFile) {
        receiptUrl = await uploadReceipt();
      }

      const { error } = await supabase
        .from('expenses')
        .insert({
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
          payment_method: formData.payment_method,
          notes: formData.notes,
          date: formData.date,
          receipt_image_url: receiptUrl,
          user_id: user.id
        });

      if (error) throw error;

      setFormData({
        amount: '',
        category: '',
        description: '',
        payment_method: '',
        notes: '',
        date: new Date().toISOString().split('T')[0]
      });
      setReceiptFile(null);
      onExpenseAdded();
      toast.success('Expense added successfully!');
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Add New Expense
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount">Amount (₹) *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="payment_method">Payment Method</Label>
            <Select 
              value={formData.payment_method} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="What was this expense for?"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Additional notes (optional)"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="receipt">Receipt Image (Optional)</Label>
          <div className="mt-1">
            {receiptFile ? (
              <div className="flex items-center gap-2 p-2 border rounded">
                <span className="text-sm text-gray-600">{receiptFile.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setReceiptFile(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="flex items-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-gray-400">
                <Upload className="w-5 h-5" />
                <span>Click to upload receipt</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <Button onClick={addExpense} disabled={loading} className="w-full">
          {loading ? 'Adding...' : 'Add Expense'}
        </Button>
      </CardContent>
    </Card>
  );
};
