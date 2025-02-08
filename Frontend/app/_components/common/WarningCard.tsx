import { AlertTriangleIcon } from 'lucide-react';
import React from 'react';

export default function WarningCard({ warning }: { warning: string }) {
  return (
    <span className="flex flex-col sm:flex-row justify-center items-center my-2 w-fit px-4 py-2 text-yellow-600 bg-yellow-100 border-l-2 border-l-yellow-500 rounded-e-small shadow-sm">
      <AlertTriangleIcon className="me-2 h-5 w-fit" />
      {warning}
    </span>
  );
}
