'use client';
import { cn } from '@/lib/utils';
import React from 'react';

interface DateTimePickerProps {
  name: string;
  value?: Date;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  onChange: (name: string, date: Date | undefined) => void;
}

export function DateTimePicker({
  name,
  value,
  onChange,
  placeholder,
  className,
  inputClassName,
}: DateTimePickerProps) {
  const formatDateTime = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDateStr = event.target.value;
    const selectedDate = selectedDateStr
      ? new Date(selectedDateStr)
      : undefined;
    onChange(name, selectedDate);
  };

  return (
    <div className={cn(`relative max-w-sm`, className)}>
      <input
        type="datetime-local"
        name={name}
        value={value ? formatDateTime(value) : ''}
        onChange={handleDateTimeChange}
        className={cn(
          `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl   
                    focus:ring-primary focus:border-primary   
                    block w-full pl-10 p-2   
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400   
                    dark:text-white dark:focus:ring-primary   
                    dark:focus:border-primary`,
          inputClassName,
        )}
        placeholder={placeholder}
      />
    </div>
  );
}
