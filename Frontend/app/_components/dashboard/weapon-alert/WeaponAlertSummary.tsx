import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaPersonRifle } from 'react-icons/fa6';
import { Label, Pie, PieChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { DateSelector } from '../common/ReportDateSelection';
import { DateRange, DateRangeMapping } from '../constants';
import SkeletonSummary from '../common/SkeletonSummary';
import { WeaponAlertDashboardResponseDto } from '../types';
import { fetchWeaponAlertDashboard } from '@/app/_lib/data/dashboard/dashboard';
import SummaryError from '../common/SummaryError';
import { Ban } from 'lucide-react';

const chartConfig = {
  count: {
    label: 'Count',
  },
  onTime: {
    label: 'On Time',
    color: 'hsl(var(--chart-2))',
  },
  late: {
    label: 'Late',
    color: 'hsl(var(--chart-warning))',
  },
  notAssigned: {
    label: 'Not Assigned',
    color: 'hsl(var(--chart-red))',
  },
} satisfies ChartConfig;

export default function WeaponAlertSummary() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateValue, setDateValue] = useState<DateRange>(DateRange.TODAY);
  const [responsePayload, setResponsePayload] =
    useState<WeaponAlertDashboardResponseDto | null>(null);

  const loadWeaponAlertData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetchWeaponAlertDashboard({
        RecordDate: dateValue,
      });

      if (response.isSuccess) {
        setResponsePayload(response.payload);
      } else {
        setError(response.errors[0] || 'An unexpected error occurred.');
      }
    } catch (e) {
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  }, [dateValue]);

  useEffect(() => {
    loadWeaponAlertData();
  }, [loadWeaponAlertData]);

  const chartData = useMemo(() => {
    if (!responsePayload) return [];
    return [
      {
        assignedTime: 'onTime',
        count: responsePayload.onTime,
        fill: chartConfig.onTime.color,
      },
      {
        assignedTime: 'late',
        count: responsePayload.late,
        fill: chartConfig.late.color,
      },
      {
        assignedTime: 'notAssigned',
        count: responsePayload.notAssigned,
        fill: chartConfig.notAssigned.color,
      },
    ];
  }, [responsePayload]);

  const totalFlightsCount = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  if (loading) return <SkeletonSummary />;

  if (!responsePayload || error) {
    return (
      <SummaryError
        name="Weapon Alerts"
        Icon={FaPersonRifle}
        message={error || 'Failed to load weapon alerts, please try again!'}
        reload={loadWeaponAlertData}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="pb-0 flex justify-between items-start gap-4 text-sm font-medium font-poppins">
          <div className="flex gap-2">
            <span>Weapon Alerts</span>
            <FaPersonRifle size={20} className="text-gray-400" />
          </div>
          <DateSelector
            value={dateValue}
            onChange={(value: DateRange) => setDateValue(value)}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1 justify-between items-center">
          <span className="text-sm text-gray-600">
            Total Weapons Recorded {DateRangeMapping[dateValue]}
          </span>
          <span className="text-lg font-semibold">
            {responsePayload.totalWeapons.toLocaleString()}
          </span>
        </div>
        {responsePayload.totalWeapons <= 0 ? (
          <div className="all-center min-h-[300px] flex-col gap-4 text-gray-500">
            <FaPersonRifle className="h-fit w-10" />
            <span className="text-2xl text-center">
              No Weapon Alert Sent {DateRangeMapping[dateValue]}!
            </span>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[350px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent className="bg-white" indicator="line" />
                }
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="assignedTime"
                innerRadius={80}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            className="text-3xl font-bold text-blue-500"
                          >
                            {totalFlightsCount.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            dy="1.5em"
                            className="text-lg fill-muted-foreground"
                          >
                            Alert Sent
                          </tspan>
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </Pie>
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
