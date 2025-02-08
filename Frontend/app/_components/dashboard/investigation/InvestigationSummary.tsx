'use client';

import { Ban, Microscope } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  LegendProps,
  XAxis,
  YAxis,
} from 'recharts';
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { DateSelector } from '../common/ReportDateSelection';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange, DateRangeMapping, getColorByStatus } from '../constants';
import SkeletonSummary from '../common/SkeletonSummary';
import { InvestigationDashboardResponseDto } from '../types';
import SummaryError from '../common/SummaryError';
import { fetchInvestigationDashboard } from '@/app/_lib/data/dashboard/dashboard';

const chartConfig = {
  count: {
    label: 'Count',
  },
  pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-grey))',
  },
  todo: {
    label: 'Todo',
    color: 'hsl(var(--chart-warning))',
  },
  inProgress: {
    label: 'In Progress',
    color: 'hsl(var(--chart-blue))',
  },
  completed: {
    label: 'Completed',
    color: 'hsl(var(--chart-2))',
  },
  onHold: {
    label: 'On Hold',
    color: 'hsl(var(--chart-red))',
  },
} satisfies ChartConfig;

export function InvestigationSummary() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateValue, setDateValue] = useState<DateRange>(DateRange.THIS_MONTH);
  const [chartData, setChartData] = useState<
    InvestigationDashboardResponseDto[]
  >([]);

  const loadInvestigationData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetchInvestigationDashboard({
        RecordDate: dateValue,
      });

      if (response.isSuccess && response.payload != null) {
        setChartData(
          response.payload.map(item => ({
            ...item,
            fill: getColorByStatus(item.status),
          })),
        );
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
    loadInvestigationData();
  }, [loadInvestigationData]);

  const totalInvestigations = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  if (loading) return <SkeletonSummary />;

  if (error || !chartData.length) {
    return (
      <SummaryError
        name="Investigation"
        Icon={Microscope}
        message={
          error || 'Failed to load investigation dashboard, please try again!'
        }
        reload={loadInvestigationData}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="pb-0 flex justify-between items-start gap-4 text-sm font-medium font-poppins">
          <div className="flex gap-2">
            <span>Investigations</span>
            <Microscope size={20} className="text-gray-400" />
          </div>
          <DateSelector
            value={dateValue}
            onChange={(value: DateRange): void => {
              setDateValue(value);
            }}
          />
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around mb-4 text-gray-700">
          <div className="flex flex-col gap-1 justify-between items-center">
            <span className="text-sm text-gray-600">
              Total Investigations Recorded {DateRangeMapping[dateValue]}
            </span>
            <span className="text-lg font-semibold">{totalInvestigations}</span>
          </div>
        </div>
        {totalInvestigations <= 0 ? (
          <div className="all-center min-h-[300px] flex-col gap-4 text-gray-500">
            <Microscope className="h-fit w-10" />
            <span className="text-2xl">
              No Investigation Created {DateRangeMapping[dateValue]}!
            </span>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                right: 16,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="status"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={value => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="count" type="number" hide />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />

              <Bar dataKey="count" layout="vertical" radius={4}>
                <LabelList
                  dataKey="status"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={12}
                />
                <LabelList
                  dataKey="count"
                  position="insideRight"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>

              <ChartLegend content={<CustomLegend chartData={chartData} />} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

const CustomLegend = ({
  chartData,
}: {
  chartData: InvestigationDashboardResponseDto[];
}) => {
  return (
    <ul className="flex flex-wrap justify-between gap-3 text-xs mt-4">
      {chartData?.map((item, index) => (
        <li key={`legend-item-${index}`} className="flex items-center gap-1">
          <span
            className="block w-2 h-2"
            style={{ background: getColorByStatus(item.status) }}
          />
          <span className="text-nowrap capitalize">{`${item.status} - ${item.count}`}</span>
        </li>
      ))}
    </ul>
  );
};
