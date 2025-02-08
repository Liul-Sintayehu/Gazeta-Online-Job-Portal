import React from 'react';
import { EyeIcon } from 'lucide-react';
import Link from 'next/link';
import { WeaponHandlingResponse } from '../types';
import { usePermissions } from '@/app/_hooks/usePermissions';

const permissionKeys = ['WeaponAlert-GetReportById'];

type PermissionKey = (typeof permissionKeys)[number];

export default function ReportRowActions({
  row,
}: {
  row: WeaponHandlingResponse;
}) {
  const permissions = usePermissions<PermissionKey>(permissionKeys);

  return (
    <>
      {permissions['WeaponAlert-GetReportById'] && (
        <Link
          href={`/dashboard/weapon-alert/report/${row.flightSchedule.id}`}
          className="p-2 flex items-center text-sm hover:bg-slate-50"
        >
          <EyeIcon className="me-2 h-4 w-fit" />
          <span className="w-fit">Detail</span>
        </Link>
      )}
    </>
  );
}
