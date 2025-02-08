'use client';

import * as React from 'react';
import {
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  XCircle,
  CircleEllipsis,
  LucideIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Status = {
  value: string;
  label: string;
  icon: LucideIcon;
};

const statuses: Status[] = [
  {
    value: 'pending',
    label: 'Pending',
    icon: CircleEllipsis,
  },
  {
    value: 'todo',
    label: 'ToDo',
    icon: Circle,
  },
  {
    value: 'inprogress',
    label: 'In Progress',
    icon: ArrowUpCircle,
  },
  {
    value: 'completed',
    label: 'Completed',
    icon: CheckCircle2,
  },
  {
    value: 'onhold',
    label: 'On Hold',
    icon: XCircle,
  },
];

export function StatusComboBox({
  currentStatus,
  onStatusChange,
}: {
  currentStatus: string | null;
  onStatusChange: (status: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
    null,
  );

  React.useEffect(() => {
    if (currentStatus) {
      const status = statuses.find(status => status.label === currentStatus);
      setSelectedStatus(status || null);
    }
  }, [currentStatus]);

  const handleStatusSelect = (status: Status) => {
    setSelectedStatus(status);
    setOpen(false);
    onStatusChange(status.label);
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex justify-between items-center"
      >
        {selectedStatus ? (
          <div className="flex gap-1">
            <selectedStatus.icon
              className={cn(
                'mr-2 h-4 w-fit',
                selectedStatus.label === 'ToDo'
                  ? 'text-yellow-400'
                  : selectedStatus.label === 'In Progress'
                  ? 'text-blue-400'
                  : selectedStatus.label === 'Completed'
                  ? 'text-green-400'
                  : selectedStatus.label === 'On Hold'
                  ? 'text-red-400'
                  : selectedStatus.label === 'Pending'
                  ? 'text-gray-400'
                  : '',
              )}
            />
            {selectedStatus.label}
          </div>
        ) : (
          <>+ Set status</>
        )}
      </Button>

      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-white border rounded-md shadow-lg z-10">
          <ul className="max-h-60 overflow-y-auto text-xs">
            {statuses.map(status => (
              <li
                key={status.value}
                className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  selectedStatus?.value === status.value ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleStatusSelect(status)}
              >
                <status.icon
                  className={cn(
                    'mr-2 h-4 w-4',
                    status.label === 'ToDo'
                      ? 'text-yellow-400'
                      : status.label === 'In Progress'
                      ? 'text-blue-400'
                      : status.label === 'Completed'
                      ? 'text-green-400'
                      : status.label === 'On Hold'
                      ? 'text-red-400'
                      : status.label === 'Pending'
                      ? 'text-gray-400'
                      : '',
                  )}
                />
                {status.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
