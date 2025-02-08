import React, { useEffect, useState, useCallback } from 'react';
import { FetchParameter, Weapon, WeaponHandlingResponse } from '../types';
import {
  fetchWeaponAlertById,
  fetchWeapons,
} from '@/app/_lib/data/weapon-alert';
import { toast } from 'sonner';
import { DataTable } from './DataTable';
import { columns } from './TableColumns';
import AddWeapon from './actions/AddWeapon';
import SendAlert from '../actions/SendAlert';
import ExportWeapons from './actions/ExportWeapons';
import { usePermissions } from '@/app/_hooks/usePermissions';

const permissionKeys = [
  'WeaponAlert-SendAlert',
  'Weapon-Create',
  'Weapon-Export',
];

type PermissionKey = (typeof permissionKeys)[number];

export default function WeaponsTable({
  params,
  isReport,
}: {
  params: FetchParameter;
  isReport?: boolean;
}) {
  const permissions = usePermissions<PermissionKey>(permissionKeys);

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [weaponAlert, setWeaponAlert] = useState<WeaponHandlingResponse | null>(
    null,
  );

  const [isReadyToResend, setIsReadyToResend] = useState<boolean>(true);

  const loadWeaponAlert = useCallback(async () => {
    setLoading(true);
    try {
      const weaponAlertResponse = await fetchWeaponAlertById({
        flightScheduleId: params.flightScheduleId,
      });
      if (weaponAlertResponse) {
        setWeaponAlert(weaponAlertResponse);
      }
    } catch (error) {
      toast.error('Failed to fetch weapon alert information');
    } finally {
      setLoading(false);
    }
  }, [params.flightScheduleId]);

  const loadWeapons = useCallback(
    async (params: FetchParameter) => {
      try {
        setIsError(false);
        const fetchedWeapons = await fetchWeapons(params);
        if (fetchedWeapons) {
          setWeapons(fetchedWeapons);
        } else {
          toast.error('Cannot load weapons table data!');
        }
      } catch (error: any) {
        setIsError(true);
        toast.error(error.message);
      }
    },
    [params.flightScheduleId],
  );

  const reload = async () => {
    loadWeapons(params);
    loadWeaponAlert();
  };

  useEffect(() => {
    loadWeapons(params);
    loadWeaponAlert();
  }, [loadWeaponAlert, loadWeapons]);

  useEffect(() => {
    const isReady: boolean =
      weaponAlert == null ||
      weaponAlert == undefined ||
      weaponAlert?.isReadyToResend == true;

    setIsReadyToResend(isReady);
  }, [weaponAlert]);

  return (
    <div className="">
      <div className="m-0 flex flex-col md:flex-row gap-3 items-baseline justify-between py-2">
        <div className="w-fit mt-4 ps-4">
          <h2 className="w-fit font-semibold text-gray-700">
            Registered Weapons
          </h2>
        </div>
        <div className="flex flex-auto gap-3 flex-wrap lg:flex-nowrap items-baseline justify-center md:justify-end">
          {weaponAlert && weaponAlert.isSent && !isReadyToResend && (
            <span className="text-lg text-yellow-500 font-semibold">
              Alert has been Sent!
            </span>
          )}

          {weaponAlert && weaponAlert.isSent && isReadyToResend && (
            <span className="text-lg text-yellow-500 font-semibold">
              Alert is ready to be resend for updates!
            </span>
          )}
          {permissions['WeaponAlert-SendAlert'] && (
            <>
              {!isReport && !loading && (
                <SendAlert
                  isReadyToSend={
                    weaponAlert == null || weaponAlert.isReadyToResend
                      ? true
                      : false
                  }
                  isError={isError}
                  hasData={weapons.length > 0}
                  flightScheduleId={params.flightScheduleId}
                  oldRemark={weaponAlert?.remark || ''}
                  reloadData={reload}
                />
              )}
            </>
          )}
          {permissions['Weapon-Export'] && (
            <ExportWeapons
              isError={isError}
              hasData={weapons.length > 0}
              params={params}
            />
          )}
          {permissions['Weapon-Create'] && !isReport && !loading && (
            <AddWeapon
              flightScheduleId={params.flightScheduleId}
              reloadData={reload}
            />
          )}
        </div>
      </div>
      <DataTable
        columns={columns({
          reloadData: () => reload(),
        })}
        data={weapons}
      />
    </div>
  );
}
