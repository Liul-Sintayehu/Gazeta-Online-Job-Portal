import React, { useEffect, useState, useCallback } from 'react';
import FlightSchedule from '../common/FlightScheduleCard';
import { FlightScheduleDetailDto } from '../clearance/types';
import { fetchFlightScheduleById } from '@/app/_lib/data/flight_schedule';
import { toast } from 'sonner';
import WeaponsTable from './weapons/WeaponsTable';
import Spinner from '../common/Spinner';
import AssignedWeaponHandler from './AssignedWeaponHandler';
import { isAlertAlreadySent } from '@/app/_lib/data/weapon-alert';
import { useWeaponAlertStore } from './store/WeaponAlertStore';
import { Can } from '@/app/_services/serverRoleService';
import NotFoundMessage from '../common/NotFoundMessage';

export default function WeaponAlert({
  flightScheduleId,
}: {
  flightScheduleId: number;
}) {
  const [canViewHandler, setCanViewHandler] = useState(false);
  const [canViewWeapon, setCanViewWeapon] = useState(false);

  const [loading, setLoading] = useState(true);
  const [flightSchedule, setFlightSchedule] =
    useState<FlightScheduleDetailDto | null>(null);

  const { setIsAlreadySent, setCheckAlertAlreadySent, isAlreadySent } =
    useWeaponAlertStore();

  const checkAlertAlreadySent = useCallback(async () => {
    try {
      const response: boolean = await isAlertAlreadySent({ flightScheduleId });
      setIsAlreadySent(response);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [flightScheduleId, setIsAlreadySent]);

  const loadFlightSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const flightScheduleData = await fetchFlightScheduleById({
        dataToFetch: {
          id: flightScheduleId,
        },
      });
      if (flightScheduleData) {
        setFlightSchedule(flightScheduleData);
      } else {
        setFlightSchedule(null);
      }
    } catch (error) {
      toast.error('Failed to fetch flight schedule');
    } finally {
      setLoading(false);
    }
  }, [flightScheduleId]);

  const loadPermissions = async () => {
    const canViewHandler = await Can('SubTaskAssignment-GetAll');
    const canViewWeapon = await Can('Weapon-GetAll');
    setCanViewHandler(canViewHandler);
    setCanViewWeapon(canViewWeapon);
  };

  useEffect(() => {
    if (flightScheduleId) {
      loadFlightSchedule();
    }
    loadPermissions();
  }, [loadFlightSchedule]);

  useEffect(() => {
    checkAlertAlreadySent();
    setCheckAlertAlreadySent(checkAlertAlreadySent);
  }, [checkAlertAlreadySent, setCheckAlertAlreadySent]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (!flightSchedule) {
    return (
      <div className="h-screen flex justify-center items-center">
        <NotFoundMessage message="The scheduled flight not found!" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 my-2 mx-4">
      <FlightSchedule flightSchedule={flightSchedule} />

      {canViewWeapon && <WeaponsTable params={{ flightScheduleId }} />}

      {canViewHandler && (
        <>
          {isAlreadySent && (
            <AssignedWeaponHandler flightScheduleId={flightSchedule.id} />
          )}
        </>
      )}
    </div>
  );
}
