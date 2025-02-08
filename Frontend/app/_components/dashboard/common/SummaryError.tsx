import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileX2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SummaryErrorProps {
  name: string;
  message?: string;
  Icon?: React.ElementType;
  reload?: () => void;
}

export default function SummaryError({
  name,
  message = 'Error while loading dashboard, please reload to try again!',
  Icon,
  reload,
}: SummaryErrorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-4 text-sm font-medium font-poppins">
          <span>{name}</span>
          {Icon && <Icon size={20} className="text-gray-400" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="all-center flex-col gap-4">
        <FileX2 className="h-10 w-fit text-gray-500" />
        <span className="text-gray-600 text-center px-5">{message}</span>
        {reload && (
          <Button variant={'outline'} onClick={reload}>
            Reload
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
