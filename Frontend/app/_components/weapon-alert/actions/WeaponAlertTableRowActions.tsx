import { ShieldAlert } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FlightScheduleDetailDto } from '../../common/types';

export default function WeaponAlertTableRowActions({
  row,
}: {
  row: FlightScheduleDetailDto;
}) {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[100px]">
          <DropdownMenuLabel className="text-gray-800">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link
            href={`/dashboard/weapon-alert/${row.id}`}
            className="p-2 flex items-center text-sm hover:bg-slate-50"
          >
            <ShieldAlert className="me-2 h-4 w-fit" />
            <span className="w-fit">Weapon Alert</span>
          </Link>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
}
