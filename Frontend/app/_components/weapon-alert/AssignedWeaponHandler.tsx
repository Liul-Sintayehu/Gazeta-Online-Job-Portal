import { Pencil, UserPlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import WarningCard from '../common/WarningCard';
import { WeaponHandlingResponse } from './types';
import { fetchWeaponAlertById } from '@/app/_lib/data/weapon-alert';
import { toast } from 'sonner';
import { capitalizeEachWord } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { TaskStatus, TaskStatusVariantMap } from '../common/constants';
import UpdateHandleStatus from './actions/UpdateHandleStatus';
import Spinner from '../common/Spinner';
import AssignOfficer from './actions/AssignOfficer';
import { Can } from '@/app/_services/serverRoleService';

export default function AssignedWeaponHandler({
  flightScheduleId,
}: {
  flightScheduleId: number;
}) {
  const [canAssignOfficer, setCanAssignOfficer] = useState(false);
  const [canUpdateHandle, setCanUpdateHandle] = useState(false);

  const [isError, setIsError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [weaponAlertHandling, setWeaponAlertHandling] =
    useState<WeaponHandlingResponse | null>(null);

  const loadWeaponAlert = async () => {
    setLoading(true);
    setIsError(false);
    try {
      const weaponAlert = await fetchWeaponAlertById({ flightScheduleId });

      if (weaponAlert) {
        setWeaponAlertHandling(weaponAlert);
      } else {
        setWeaponAlertHandling(null);
        throw new Error('Failed to fetch weapon handling information!');
      }
    } catch (error: any) {
      setIsError(true);
      toast.error(
        error.message ?? 'Failed to fetch weapon handling information!',
      );
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    const canAssignOfficer = await Can('WeaponAlert-AssignOfficer');
    const canUpdateHandle = await Can('WeaponAlert-UpdateHandle');

    setCanAssignOfficer(canAssignOfficer);
    setCanUpdateHandle(canUpdateHandle);
  };

  useEffect(() => {
    loadWeaponAlert();
    loadPermissions();
  }, [flightScheduleId]);

  if (loading) {
    return (
      <div
        style={{ borderRadius: '15px' }}
        className="my-2 border rounded-lg shadow-md p-4 h-20 w-full text-gray-700 font-inter"
      >
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ borderRadius: '15px' }}
      className="my-2 border rounded-lg shadow-md p-4 max-w-full text-gray-700 font-inter"
    >
      {isError || !weaponAlertHandling ? (
        <p className="text-center text-gray-400">
          Failed to fetch weapon alert handling data!
        </p>
      ) : (
        <>
          <div className="w-full mb-4 flex flex-wrap gap-3 items-baseline justify-between">
            <h2 className="w-fit text-md font-semibold">Assigned Officer</h2>
            {canAssignOfficer && (
              <>
                {new Date(weaponAlertHandling.completedOn).getTime() < 0 && (
                  <AssignOfficer
                    id={weaponAlertHandling.id}
                    assignedEmployeeId={
                      weaponAlertHandling.responsibleOfficer?.employeeId ?? ''
                    }
                    reloadData={loadWeaponAlert}
                  />
                )}
              </>
            )}
          </div>

          <div className="">
            {weaponAlertHandling?.responsibleOfficer ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-3 justify-between items-center">
                  <div className="flex gap-1 flex-col  justify-between">
                    <span className="font-medium text-sm text-gray-500">
                      Name
                    </span>
                    <span>
                      {capitalizeEachWord(
                        `${weaponAlertHandling.responsibleOfficer?.firstName} ${weaponAlertHandling.responsibleOfficer?.middleName} ${weaponAlertHandling.responsibleOfficer?.lastName}`,
                      )}
                    </span>
                  </div>
                  <div className="flex gap-1 flex-col  justify-between">
                    <span className="font-medium text-sm text-gray-500">
                      ID Number
                    </span>
                    <span>
                      {weaponAlertHandling.responsibleOfficer?.employeeId}
                    </span>
                  </div>
                  <div className="flex gap-1 flex-col  justify-between">
                    <span className="font-medium text-sm text-gray-500">
                      Assigned By
                    </span>
                    <span>
                      {weaponAlertHandling?.assignedBy
                        ? capitalizeEachWord(
                            `${weaponAlertHandling.assignedBy?.firstName} ${weaponAlertHandling.assignedBy?.middleName} ${weaponAlertHandling.assignedBy?.lastName} `,
                          )
                        : '---'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 justify-between items-start">
                  <div className="flex gap-1 flex-col  justify-between">
                    <span className="font-medium text-sm text-gray-500">
                      Handle Status
                    </span>
                    <Badge
                      variant={
                        TaskStatusVariantMap[
                          weaponAlertHandling.handleStatus
                        ] ?? 'default'
                      }
                      className="w-fit"
                    >
                      {TaskStatus[weaponAlertHandling.handleStatus]}
                    </Badge>
                  </div>

                  {new Date(weaponAlertHandling.completedOn).getTime() > 0 ? (
                    <div className="flex gap-1 flex-col  justify-between">
                      <span className="font-medium text-sm text-gray-500">
                        Completed On
                      </span>
                      <span>
                        {new Date(
                          weaponAlertHandling.handleStatusLastUpdate,
                        ).toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-1 flex-col  justify-between">
                        <span className="font-medium text-sm text-gray-500">
                          Last Updated On
                        </span>
                        <span>
                          {new Date(
                            weaponAlertHandling.handleStatusLastUpdate,
                          ).getTime() > 0 &&
                            new Date(
                              weaponAlertHandling.handleStatusLastUpdate,
                            ).toLocaleString()}
                        </span>
                      </div>
                      {canUpdateHandle && (
                        <UpdateHandleStatus
                          status={{
                            id: weaponAlertHandling.id,
                            handleStatus: weaponAlertHandling.handleStatus,
                          }}
                          reload={loadWeaponAlert}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <WarningCard warning="Weapon alert handler officer not assigned yet!" />
            )}
          </div>
        </>
      )}
    </div>
  );
}
