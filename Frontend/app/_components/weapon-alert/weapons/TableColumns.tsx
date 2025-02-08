import { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  CircleAlert,
  CircleCheckBig,
  Paperclip,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Weapon } from '../types';
import { TableRowActions } from './TableRowActions';

export const columns = ({
  isReport = false,
  reloadData,
}: {
  isReport?: boolean;
  reloadData: () => void;
}): ColumnDef<Weapon>[] => [
  {
    accessorKey: 'isAlertSent',
    header: ({ column }) => {
      return (
        <Button
          className="text-gray-600"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="max-w-[100%]">
          {row.original.isAlertSent ? (
            <span className="flex items-center font-semibold text-sm text-green-400">
              <CircleCheckBig className="mr-2 h-4 w-fit" />
              Sent
            </span>
          ) : (
            <span className="flex items-center font-semibold text-sm text-yellow-400">
              <CircleAlert className="mr-2 h-4 w-fit" />
              Not Sent
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'tagNumber',
    header: ({ column }) => {
      return (
        <Button
          className="text-gray-600"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tag Number
          <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="max-w-[100%]">{row.original.tagNumber}</div>;
    },
  },
  {
    accessorKey: 'palateNumber',
    header: ({ column }) => {
      return (
        <Button
          className="text-gray-600"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Palate Number
          <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="max-w-[100%]">{row.original.palateNumber}</div>;
    },
  },
  {
    accessorKey: 'akeNumber',
    header: ({ column }) => {
      return (
        <Button
          className="text-gray-600"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          AKE Number
          <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="max-w-[100%]">{row.original.akeNumber}</div>;
    },
  },
  {
    accessorKey: 'remark',
    header: ({ column }) => {
      return (
        <Button
          className="text-gray-600"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Remark
          <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="max-w-[100%]">{row.original.remark}</div>;
    },
  },
  {
    accessorKey: 'Attachment',
    header: ({ column }) => {
      return (
        <Button
          className="text-gray-600"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Attachment
        </Button>
      );
    },
    cell: ({ row }) => {
      if (row.original.attachments.length > 0) {
        return (
          <div title="Has file attachment" className="grid place-items-center">
            <Paperclip
              xlinkTitle="sometinf"
              className="text-blue-500 h-5 w-fit"
            />
          </div>
        );
      }

      return (
        <div title="Has no file attachment">
          <span className="text-gray-400">No Attachment!</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'Last Update Date',
    header: ({ column }) => {
      return (
        <Button
          className="text-gray-600"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Last Updated
          <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return new Date(row.original.lastUpdateDate).toLocaleString();
    },
  },
  {
    id: 'Actions',
    header: () => (
      <div className="py-2 text-center text-gray-600 text-xs">Actions</div>
    ),
    cell: ({ row }) => {
      return (
        <TableRowActions
          isReport={isReport}
          weapon={row.original}
          reloadData={() => {
            window.location.reload();
          }}
        />
      );
    },
  },
];
