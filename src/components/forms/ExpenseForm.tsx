import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Plus, DollarSign, FileText, Calendar } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '@/constants';
import { ExpenseFormData } from '@/types';

// Simple validation schema for testing
const expenseFormSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
});

type ExpenseFormSchema = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<ExpenseFormData>;
  isLoading?: boolean;
  isEditMode?: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  isEditMode = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<ExpenseFormSchema>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: initialData?.amount?.toString() || '',
      description: initialData?.description || '',
      category: typeof initialData?.category === 'string' 
        ? initialData.category 
        : (initialData?.category as any)?.id || '',
      date: initialData?.date 
        ? new Date(initialData.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    },
    mode: 'onChange',
  });

  const handleFormSubmit = (data: ExpenseFormSchema) => {
    const formData: ExpenseFormData = {
      amount: parseFloat(data.amount) || 0,
      description: data.description,
      category: data.category,
      date: new Date(data.date),
    };
    
    onSubmit(formData);
    if (!isEditMode) {
      reset();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      reset();
    }
  };

  // Convert categories to select options
  const categoryOptions = EXPENSE_CATEGORIES.map(category => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-4" />
          <span>{isEditMode ? 'Edit Expense' : 'Add New Expense'}</span>
        </CardTitle>
        <CardDescription>
          {isEditMode 
            ? 'Update the details of your expense.'
            : 'Enter the details of your expense to track your spending.'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Amount Field */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <input
                {...register('amount')}
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-destructive" role="alert">
                {errors.amount.message}
              </p>
            )}
            <p className="mt-1 text-sm text-muted-foreground">
              Enter the expense amount in dollars
            </p>
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-4 w-4 text-gray-400" />
              </div>
              <input
                {...register('description')}
                id="description"
                type="text"
                placeholder="What was this expense for?"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
              />
            </div>
            {errors.description && (
              <p className="mt-1 text-sm text-destructive" role="alert">
                {errors.description.message}
              </p>
            )}
            <p className="mt-1 text-sm text-muted-foreground">
              Brief description of the expense
            </p>
          </div>

          {/* Category Field */}
          <div>
            <Select
              options={categoryOptions}
              value={watch('category')}
              onChange={(value) => setValue('category', value)}
              label="Category"
              placeholder="Select a category"
              error={errors.category?.message}
              helperText="Choose the most appropriate category"
            />
            {/* Hidden input for React Hook Form */}
            <input
              {...register('category')}
              type="hidden"
              value={watch('category') || ''}
            />
          </div>

          {/* Date Field */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                {...register('date')}
                id="date"
                type="date"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
              />
            </div>
            {errors.date && (
              <p className="mt-1 text-sm text-destructive" role="alert">
                {errors.date.message}
              </p>
            )}
            <p className="mt-1 text-sm text-muted-foreground">
              When did this expense occur?
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={!isValid || isLoading}
              loading={isLoading}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              {isLoading 
                ? (isEditMode ? 'Updating...' : 'Adding...') 
                : (isEditMode ? 'Update Expense' : 'Add Expense')
              }
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
