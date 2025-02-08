import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WeaponHandlingResponse } from '../types';
import { TaskStatusVariantMap, WorkTaskStatus } from '../../common/constants';
import { Badge } from '@/components/ui/badge';
import { capitalizeEachWord } from '@/lib/utils';
import ReportRowActions from './RowActions';

export const weaponHandlingReportColumns =
  (): ColumnDef<WeaponHandlingResponse>[] => [
    {
      accessorKey: 'handleStatus',
      header: ({ column }) => (
        <Button
          className="text-gray-600 p-0 pe-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Handle Status
          <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        if (!row.original.responsibleOfficer)
          return <Badge variant={'destructive'}>Not Assigned</Badge>;
        const badgeValue = WorkTaskStatus[row.original.handleStatus - 1];
        const badgeVariant = TaskStatusVariantMap[row.original.handleStatus];
        return (
          <div>
            <Badge variant={badgeVariant}>{badgeValue}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'assignedTime',
      header: ({ column }) => (
        <Button
          className="text-gray-600 p-0 pe-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Assigned Time
          <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const arrivalTime = new Date(
          row.original.flightSchedule.scheduledArrivalTime,
        ).getTime();
        const assignedTime = row.original.assignedOn
          ? new Date(row.original.assignedOn).getTime()
          : -1;
        const isNotAssigned = assignedTime <= 0;
        const isAssignedBeforeArrival = assignedTime < arrivalTime;

        if (isNotAssigned) {
          return (
            <Badge variant={'destructive'} className="text-xs">
              Not Assigned
            </Badge>
          );
        } else if (!isNotAssigned && isAssignedBeforeArrival) {
          return (
            <Badge variant={'success'} className="text-xs">
              On Time
            </Badge>
          );
        } else if (!isNotAssigned && !isAssignedBeforeArrival) {
          return (
            <Badge variant={'destructive'} className="text-xs">
              Late
            </Badge>
          );
        } else {
          return (
            <Badge variant={'destructive'} className="text-xs">
              Invalid Data
            </Badge>
          );
        }
      },
    },

    {
      accessorKey: 'flightSchedule.scheduledDeparture',
      header: ({ column }) => (
        <Button
          className="text-gray-600 p-0 pe-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Flight Date
          <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const flightDate = `${new Date(
          row.original.flightSchedule.scheduledDepartureTime,
        ).toLocaleDateString()}`;
        return <div className="">{flightDate}</div>;
      },
    },
    {
      accessorKey: 'flightSchedule.flightNumber',
      header: ({ column }) => (
        <Button
          className="text-gray-600 p-0 pe-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Flight Number
          <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const flightNumber = `${row.original.flightSchedule.carrier}-${
          row.original.flightSchedule.flightNumber
        }${
          row.original.flightSchedule.suffix &&
          `-${row.original.flightSchedule.suffix}`
        }`;
        return <div className="">{flightNumber}</div>;
      },
    },
    {
      accessorKey: 'flightSchedule.airCraftRegistration',
      header: ({ column }) => (
        <Button
          className="text-gray-600 p-0 pe-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tail
          <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <div className="">
            {row.original.flightSchedule.aircraftRegistration}
          </div>
        );
      },
    },
    {
      accessorKey: 'flightSchedule.latestDeparture',
      header: ({ column }) => (
        <Button
          className="text-gray-600 p-0 pe-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          From
          <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
        </Button>
      ),
      cell: ({ row }) => row.original.flightSchedule.latestDeparture,
    },
    {
      accessorKey: 'flightSchedule.latestArrival',
      header: ({ column }) => (
        <Button
          className="text-gray-600 p-0 pe-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          To
          <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
        </Button>
      ),
      cell: ({ row }) => row.original.flightSchedule.latestArrival,
    },
    {
      accessorKey: 'alertSentOn',
      header: ({ column }) => (
        <Button
          className="text-gray-600 p-0 pe-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Alert Sent On
          <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
        </Button>
      ),
      cell: ({ row }) => new Date(row.original.alertSentOn).toLocaleString(),
    },
    {
      accessorKey: 'responsibleOfficerId',
      header: ({ column }) => (
        <Button
          className="text-gray-600 p-0 pe-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Assigned Officer
          <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        if (!row.original.responsibleOfficer) {
          return <div className="text-center">---</div>;
        }
        const fullName = capitalizeEachWord(
          `${row.original.responsibleOfficer.firstName} ${row.original.responsibleOfficer.middleName} ${row.original.responsibleOfficer.lastName}`,
        );
        return <div>{fullName}</div>;
      },
    },
    {
      accessorKey: 'handleStatusLastUpdate',
      header: ({ column }) => (
        <Button
          className="text-gray-600 p-0 pe-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status Last Updated
          <ArrowUpDown className="ml-2 h-fit w-fit max-w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        if (!row.original.responsibleOfficer) return '';
        return new Date(row.original.handleStatusLastUpdate).toLocaleString();
      },
    },
    {
      id: 'Actions',
      header: () => (
        <div className="py-2 text-center text-gray-600 text-xs">Actions</div>
      ),
      cell: ({ row }) => (
        <div className="">
          <ReportRowActions row={row.original} />
        </div>
      ),
    },
  ];
