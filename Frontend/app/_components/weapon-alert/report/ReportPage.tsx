import { useEffect, useState } from 'react';
import { WeaponHandlingResponse } from '../types';
import {
  fetchWeaponAlertById,
  isAlertAlreadySent,
} from '@/app/_lib/data/weapon-alert';
import { toast } from 'sonner';
import Spinner from '../../common/Spinner';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import FlightSchedule from '../../common/FlightScheduleCard';
import WeaponsTable from '../weapons/WeaponsTable';
import { ReportDetail } from './ReportDetail';
import { useWeaponAlertStore } from '../store/WeaponAlertStore';

export default function ReportPage({
  flightScheduleId,
}: {
  flightScheduleId: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [weaponHandling, setWeaponHandling] =
    useState<WeaponHandlingResponse | null>(null);
  const {
    setIsDeparturePassed,
    setIsArrivalPassed,
    setIsAlreadySent,
    setCheckAlertAlreadySent,
  } = useWeaponAlertStore();

  const checkAlertAlreadySent = async () => {
    try {
      const response: boolean = await isAlertAlreadySent({ flightScheduleId });
      setIsAlreadySent(response);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchWeapon = async () => {
      if (flightScheduleId) {
        setLoading(true);
        setError(null);
        try {
          const response = await fetchWeaponAlertById({ flightScheduleId });
          setWeaponHandling(response);
        } catch (error: any) {
          const errorMessage =
            error?.message ?? 'Something went wrong, please try again!';
          toast.error(`Failed to fetch. ${errorMessage}`);
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWeapon();
  }, [flightScheduleId]);

  useEffect(() => {
    if (weaponHandling?.flightSchedule) {
      const currentTime = Date.now();
      const scheduledDeparture = new Date(
        weaponHandling.flightSchedule.scheduledDepartureTime,
      ).getTime();
      const scheduledArrival = new Date(
        weaponHandling.flightSchedule.scheduledArrivalTime,
      ).getTime();

      setIsDeparturePassed(currentTime > scheduledDeparture);
      setIsArrivalPassed(currentTime > scheduledArrival);
    } else {
      setIsDeparturePassed(false);
      setIsArrivalPassed(false);
    }
  }, [weaponHandling?.flightSchedule]);

  useEffect(() => {
    checkAlertAlreadySent();
    setCheckAlertAlreadySent(checkAlertAlreadySent);
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <Spinner />
          <h2 className="m-3">Loading Detailed Report...</h2>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-gray-500">{error}</h2>
          {!error.includes('404') && (
            <Button variant={'outline'} onClick={() => router.refresh()}>
              Refresh
            </Button>
          )}
        </div>
      </div>
    );

  if (!weaponHandling)
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-gray-500">
            This flight has no weapon alert report!
          </h2>
        </div>
      </div>
    );

  return (
    <div className="mx-4 flex flex-col gap-5">
      <FlightSchedule flightSchedule={weaponHandling.flightSchedule} />
      <ReportDetail weaponHandling={weaponHandling} />
      <WeaponsTable isReport={true} params={{ flightScheduleId }} />
    </div>
  );
}
