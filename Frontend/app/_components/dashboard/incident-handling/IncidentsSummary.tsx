'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { TriangleAlert } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { DateRange, DateRangeMapping } from '../constants';
import { DateSelector } from '../common/ReportDateSelection';
import SkeletonSummary from '../common/SkeletonSummary';
import { IncidentDashboardResponseDto } from '../types';
import { fetchIncidentDashboard } from '@/app/_lib/data/dashboard/dashboard';
import SummaryError from '../common/SummaryError';
const chartConfig = {
  count: {
    label: 'Count',
    color: 'hsl(var(--chart-1))',
  },
  investigation: {
    label: 'Investigation',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function IncidentsSummary() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateValue, setDateValue] = useState<DateRange>(DateRange.THIS_MONTH);
  const [chartData, setChartData] = useState<IncidentDashboardResponseDto[]>(
    [],
  );

  const loadIncidentData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetchIncidentDashboard({
        RecordDate: dateValue,
      });

      if (response.isSuccess && response.payload != null) {
        setChartData(response.payload);
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
    loadIncidentData();
  }, [loadIncidentData]);

  const totalIncidents = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  const totalInvestigations = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.investigation, 0);
  }, [chartData]);

  if (loading) return <SkeletonSummary />;

  if (error || !chartData.length) {
    return (
      <SummaryError
        name="Incident Handling"
        Icon={TriangleAlert}
        message={error || 'Failed to load incident handling, please try again!'}
        reload={loadIncidentData}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="pb-0 flex justify-between items-start gap-4 text-sm font-medium font-poppins">
          <div className="flex gap-2">
            <span>Incident Handling</span>
            <TriangleAlert size={20} className="text-gray-400" />
          </div>
          <DateSelector
            value={dateValue}
            onChange={(value: DateRange) => setDateValue(value)}
          />
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around mb-4 text-gray-700">
          <div className="flex flex-col gap-1 justify-between items-center">
            <span className="text-sm text-gray-600">
              Total Incidents Recorded {DateRangeMapping[dateValue]}
            </span>
            <span className="text-lg font-semibold">{totalIncidents}</span>
          </div>
          <div className="flex flex-col gap-1 justify-between items-center">
            <span className="text-sm text-gray-600">
              Total Investigations Recorded {DateRangeMapping[dateValue]}
            </span>
            <span className="text-lg font-semibold">{totalInvestigations}</span>
          </div>
        </div>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="incident"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="bg-white" />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={4}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
            <Bar
              dataKey="investigation"
              fill="var(--color-investigation)"
              radius={4}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
