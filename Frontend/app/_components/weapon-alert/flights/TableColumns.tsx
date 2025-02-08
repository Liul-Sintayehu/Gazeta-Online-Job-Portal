import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlightScheduleDetailDto } from '../../common/types';

export const flightDataColumns = ({
  actions,
}: {
  actions: (row: FlightScheduleDetailDto) => JSX.Element;
}): ColumnDef<FlightScheduleDetailDto>[] => [
  {
    accessorKey: 'flightNumber',
    header: ({ column }) => (
      <Button
        className="text-gray-600 px-0.5"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Flight No.
        <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="">
          {row.original.carrier}-{row.original.flightNumber}{' '}
          {row.original.suffix && `-${row.original.suffix}`}
        </div>
      );
    },
  },
  {
    accessorKey: 'scheduledDepartureTime',
    header: ({ column }) => (
      <Button
        className="text-gray-600 px-0.5"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Date
        <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return new Date(row.original.scheduledDepartureTime).toDateString();
    },
  },
  {
    accessorKey: 'DepartureTime',
    header: ({ column }) => (
      <Button
        className="text-gray-600 px-0.5"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        STD
        <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="w-fit">
        {new Date(row.original.scheduledDepartureTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </div>
    ),
  },
  {
    accessorKey: 'latestDeparture',
    header: ({ column }) => (
      <Button
        className="text-gray-600 px-0.5"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        From
        <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.latestDeparture,
  },
  {
    accessorKey: 'latestArrival',
    header: ({ column }) => (
      <Button
        className="text-gray-600 px-0.5"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        To
        <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.latestArrival,
  },
  {
    accessorKey: 'ArrivalTime',
    header: ({ column }) => (
      <Button
        className="text-gray-600 px-0.5"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        STA
        <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      new Date(row.original.scheduledArrivalTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
  },
  {
    accessorKey: 'airCraftType',
    header: ({ column }) => (
      <Button
        className="text-gray-600 px-0.5"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        EQPT
        <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.aircraftType,
  },
  {
    accessorKey: 'aircraftRegistration',
    header: ({ column }) => (
      <Button
        className="text-gray-600 px-0.5"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Tail
        <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div
          className={
            row.original.previousTail ? `animate-blinkColor font-semibold` : ''
          }
        >
          {row.original.aircraftRegistration}
        </div>
      );
    },
  },
  {
    accessorKey: 'previousTail',
    header: ({ column }) => (
      <Button
        className="text-gray-600 px-0.5"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Prev Tail
        <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div
          className={
            row.original.previousTail ? `animate-blinkColor font-semibold` : ''
          }
        >
          {row.original.previousTail}
        </div>
      );
    },
  },
  {
    accessorKey: 'arrivalParkingStand',
    header: ({ column }) => (
      <Button
        className="text-gray-600 px-0.5"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Arv. Parking
        <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div>{row.original.arrivalParkingStand}</div>;
    },
  },
  {
    id: 'Actions',
    header: () => (
      <div className="py-2 text-center text-gray-600 text-xs">Actions</div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">{actions(row.original)}</div>
    ),
  },
];
