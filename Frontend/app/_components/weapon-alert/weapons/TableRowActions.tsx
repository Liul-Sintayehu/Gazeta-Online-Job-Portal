import React from 'react';
import EditWeapon from './actions/EditWeapon';
import DeleteWeapon from './actions/DeleteWeapon';
import ViewWeaponDetail from './actions/ViewWeaponDetail';
import { Weapon } from '../types';
import { usePermissions } from '@/app/_hooks/usePermissions';

const permissionKeys = ['Weapon-GetById', 'Weapon-Update', 'Weapon-Delete'];

type PermissionKey = (typeof permissionKeys)[number];

export function TableRowActions({
  weapon,
  isReport = false,
  reloadData,
}: {
  weapon: Weapon;
  isReport?: boolean;
  reloadData: () => void;
}) {
  const permissions = usePermissions<PermissionKey>(permissionKeys);

  if (
    !permissions['Weapon-GetById'] &&
    !permissions['Weapon-Update'] &&
    !permissions['Weapon-Delete']
  ) {
    return null;
  }

  return (
    <div className="flex justify-center gap-2">
      {permissions['Weapon-GetById'] && (
        <ViewWeaponDetail reloadData={reloadData} weapon={weapon} />
      )}

      {!isReport && permissions['Weapon-Update'] && (
        <EditWeapon weapon={weapon} reloadData={reloadData} />
      )}

      {!isReport && permissions['Weapon-Delete'] && (
        <DeleteWeapon weapon={weapon} reloadData={reloadData} />
      )}
    </div>
  );
}
