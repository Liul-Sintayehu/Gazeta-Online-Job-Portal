import React, { useEffect, useState, useCallback } from 'react';
import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GoShieldCheck } from 'react-icons/go';
import { Clock } from 'lucide-react';
import CountUp from '../common/CountUp';
import SkeletonSummary from '../common/SkeletonSummary';
import { ClearanceDashboardResponseDto } from '@/app/_components/dashboard/types';
import { fetchClearanceDashboard } from '@/app/_lib/data/dashboard/dashboard';
import SummaryError from '../common/SummaryError';

export default function ClearanceSummary() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clearanceData, setClearanceData] =
    useState<ClearanceDashboardResponseDto | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const loadClearanceData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetchClearanceDashboard({
        DepartureDate: format(selectedDate, 'yyyy-MM-dd'),
      });

      if (response.isSuccess) {
        setClearanceData(response.payload);
      } else {
        setError(response.errors[0] || 'An unexpected error occurred.');
      }
    } catch (e) {
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadClearanceData();
  }, [loadClearanceData]);

  if (loading) return <SkeletonSummary />;

  if (!clearanceData || error) {
    return (
      <SummaryError
        name="Flight Clearance"
        Icon={GoShieldCheck}
        message={
          error ||
          'Failed to load the clearance dashboard, please reload to try again!'
        }
        reload={loadClearanceData}
      />
    );
  }

  const totalFlights =
    clearanceData.unassignedCount + clearanceData.assignedCount;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="pb-0 flex justify-between items-start gap-4 text-sm font-medium font-poppins">
          <div className="flex gap-2">
            <span>Flight Clearance</span>
            <GoShieldCheck size={20} className="text-gray-400" />
          </div>
          <DatePickerWithPresets
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col w-full items-start gap-4">
          <div className="flex flex-col">
            <span className="">Completed Before Departure</span>
            <div className="font-semibold">
              {clearanceData.approvedCount <= 0 ? (
                <span className="text-gray-600 text-xl">
                  No Approved Flights
                </span>
              ) : (
                <span
                  className={`flex items-center text-xl ${
                    clearanceData.averageMinutes > 0
                      ? 'text-gray-700'
                      : 'text-red-500'
                  }`}
                >
                  <Clock className="w-4 mr-2" />{' '}
                  {Math.abs(clearanceData.averageMinutes) > 60
                    ? `${(clearanceData.averageMinutes / 60).toFixed(
                        0,
                      )}Hrs ${Math.abs(
                        clearanceData.averageMinutes % 60,
                      ).toFixed(0)}Mins`
                    : `${clearanceData.averageMinutes.toFixed(1)} Mins`}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400">
              The average time for the completion of clearance after aircraft
              search before the standard time of departure (STD) of the flights
              on {selectedDate.toDateString()}.
            </span>
          </div>
          <div className="w-full flex gap-3 justify-between text-sm">
            <div>
              <div className="">Approved</div>
              <div className="flex gap-1 ordinal">
                <span className="text-xl font-semibold text-gray-700">
                  <CountUp targetNumber={clearanceData.approvedCount} />
                </span>
                <span className="text-sm text-green-500 font-bold">
                  {((clearanceData.approvedCount / totalFlights) * 100).toFixed(
                    2,
                  )}
                  %
                </span>
              </div>
            </div>
            <div>
              <div className="">Assigned</div>
              <div className="flex gap-1 ordinal">
                <span className="text-xl font-semibold text-gray-700">
                  <CountUp targetNumber={clearanceData.assignedCount} />
                </span>
                <span className="text-sm text-yellow-500 font-bold">
                  {((clearanceData.assignedCount / totalFlights) * 100).toFixed(
                    2,
                  )}
                  %
                </span>
              </div>
            </div>
            <div>
              <div className="">Unassigned</div>
              <div className="flex gap-1 ordinal">
                <span className="text-xl font-semibold text-gray-700">
                  <CountUp targetNumber={clearanceData.unassignedCount} />
                </span>
                <span className="text-sm text-red-500 font-bold">
                  {(
                    (clearanceData.unassignedCount / totalFlights) *
                    100
                  ).toFixed(2)}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DatePickerWithPresets({
  selectedDate,
  onDateChange,
}: {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-fit h-7 text-xs justify-start text-left font-normal',
            !selectedDate && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="w-4 mr-2" />
          {selectedDate ? (
            format(selectedDate, 'PPP')
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex w-auto flex-col space-y-2 p-2"
      >
        <Select
          onValueChange={value =>
            onDateChange(addDays(new Date(), parseInt(value, 10)))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="-1">Yesterday</SelectItem>
            <SelectItem value="-3">Before 3 days</SelectItem>
            <SelectItem value="-7">Before a week</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={day => {
              if (day) {
                onDateChange(day);
              }
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
