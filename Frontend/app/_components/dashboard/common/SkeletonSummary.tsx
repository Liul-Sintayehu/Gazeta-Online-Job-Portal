import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SkeletonSummary() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="min-h-[100px] h-full w-full rounded-xl bg-gray-200" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full bg-gray-200" />
        <Skeleton className="h-4 w-[300px] bg-gray-200" />
      </div>
    </div>
  );
}
