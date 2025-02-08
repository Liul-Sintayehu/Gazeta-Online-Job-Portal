import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-red-400 text-white shadow',
        outline: 'text-foreground',
        success:
          'border-transparent bg-green-500 text-white shadow bg-opacity-75',
        grey: 'border-transparent bg-gray-400 text-white  ',
        pending:
          'border-transparent bg-gray-300 text-gray-600 shadow bg-opacity-75',
        todo: 'border-transparent bg-yellow-500 text-white shadow bg-opacity-75',
        inprogress:
          'border-transparent bg-blue-400 text-white shadow bg-opacity-75',
        modernSuccess:
          'border-transparent border-green-400 text-green-400 shadow bg-opacity-75',
        modernError:
          'border-transparent border-red-400 text-red-400 shadow bg-opacity-75',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      style={{ borderRadius: '15px' }}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
