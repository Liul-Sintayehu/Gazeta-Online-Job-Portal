'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  fallbackUrl?: string;
}

export default function BackButton({ fallbackUrl }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (fallbackUrl) {
      router.push(fallbackUrl);
    } else if (window.history.length > 2) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <Button variant={'outline'} onClick={handleBack} className="mx-4 my-2">
      <ChevronLeft className="me-2 h-4 w-fit" />
      Back
    </Button>
  );
}
