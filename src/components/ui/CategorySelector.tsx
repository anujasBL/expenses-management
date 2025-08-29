import React from 'react';
import { ExpenseCategory } from '@/types';
import { EXPENSE_CATEGORIES } from '@/constants';
import { clsx } from 'clsx';
import * as LucideIcons from 'lucide-react';

interface CategorySelectorProps {
  value?: string;
  onChange: (categoryId: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  label = 'Category',
  error,
  required = false,
  disabled = false,
  className,
}) => {
  const getIcon = (iconName: string) => {
    // Convert icon name to proper case and get the icon from Lucide
    const iconKey = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    const IconComponent = (LucideIcons as any)[iconKey] || LucideIcons.HelpCircle;
    return IconComponent;
  };

  return (
    <div className={clsx('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {EXPENSE_CATEGORIES.map((category) => {
          const IconComponent = getIcon(category.icon);
          const isSelected = value === category.id;
          
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(category.id)}
              disabled={disabled}
              className={clsx(
                'flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200',
                'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                {
                  'border-gray-200 bg-white hover:border-gray-300': !isSelected && !disabled,
                  'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60': disabled,
                  'border-blue-500 bg-blue-50 shadow-sm': isSelected && !disabled,
                  'focus:ring-blue-500': !disabled,
                }
              )}
              style={{
                borderColor: isSelected ? category.color : undefined,
                backgroundColor: isSelected ? `${category.color}10` : undefined,
              }}
            >
              <div
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center mb-2',
                  {
                    'bg-gray-100': !isSelected,
                    'text-white': isSelected,
                  }
                )}
                style={{
                  backgroundColor: isSelected ? category.color : undefined,
                }}
              >
                <IconComponent 
                  className={clsx('w-4 h-4', {
                    'text-gray-600': !isSelected,
                    'text-white': isSelected,
                  })} 
                />
              </div>
              
              <span className={clsx('text-xs font-medium text-center', {
                'text-gray-700': !isSelected,
                'text-gray-900': isSelected,
              })}>
                {category.name}
              </span>
              
              {category.description && (
                <span className="text-xs text-gray-500 mt-1 text-center leading-tight">
                  {category.description}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
      
      <p className="text-xs text-gray-500 mt-1">
        Choose the category that best describes your expense
      </p>
    </div>
  );
};

// Category Badge component for displaying selected categories
interface CategoryBadgeProps {
  category: ExpenseCategory;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
  showIcon = true,
  className,
}) => {
  const getIcon = (iconName: string) => {
    const iconKey = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    const IconComponent = (LucideIcons as any)[iconKey] || LucideIcons.HelpCircle;
    return IconComponent;
  };

  const IconComponent = getIcon(category.icon);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: `${category.color}20`,
        color: category.color,
        border: `1px solid ${category.color}40`,
      }}
    >
      {showIcon && (
        <IconComponent className={iconSizes[size]} />
      )}
      {category.name}
    </span>
  );
};
