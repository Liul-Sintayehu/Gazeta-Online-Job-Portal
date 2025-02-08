'use client';

import * as React from 'react';
import { Label, LegendProps, Pie, PieChart, Sector } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
} from '@/components/ui/chart';
import { Ban, CarTaxiFront } from 'lucide-react';
import { DateSelector } from '../common/ReportDateSelection';
import { DateRange, DateRangeMapping } from '../constants';
import { useState } from 'react';
import SkeletonSummary from '../common/SkeletonSummary';
import { fetchEscortDashboard } from '@/app/_lib/data/dashboard/dashboard';
import { EscortDashboardResponseDto } from '../types';
import SummaryError from '../common/SummaryError';

const chartConfig = {
  Vip: { label: 'VIP', color: 'hsl(var(--chart-2))' },
  Cargo: { label: 'Cargo', color: 'hsl(var(--chart-3))' },
  LandSide: { label: 'LandSide', color: 'hsl(var(--chart-1))' },
  InFlight: { label: 'InFlight', color: 'hsl(var(--chart-5))' },
  Other: { label: 'Others', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;

export default function EscortSummary() {
  const id = 'pie-interactive';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateValue, setDateValue] = useState<DateRange>(DateRange.THIS_WEEK);
  const [chartData, setChartData] = useState<
    { type: string; count: number; fill: string }[]
  >([]);

  const loadEscortData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetchEscortDashboard({
        RecordDate: dateValue,
      });

      if (response.isSuccess && response.payload != null) {
        setChartData(
          response.payload.map((item: { type: string; count: number }) => ({
            ...item,
            fill:
              chartConfig[item.type as keyof typeof chartConfig]?.color ||
              'hsl(var(--muted))',
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

  React.useEffect(() => {
    loadEscortData();
  }, [loadEscortData]);

  const totalEscorts = chartData.reduce((sum, item) => sum + item.count, 0);

  const defaultActiveIndex = chartData.reduce(
    (maxIndex, item, index, array) =>
      item.count > array[maxIndex].count ? index : maxIndex,
    0,
  );
  const [activeIndex, setActiveIndex] = React.useState(defaultActiveIndex);

  if (loading) return <SkeletonSummary />;
  if (error || !chartData.length) {
    return (
      <SummaryError
        name="Offload Baggages"
        Icon={CarTaxiFront}
        message={error || 'Failed to load escort dashboard, please try again!'}
        reload={loadEscortData}
      />
    );
  }

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader>
        <CardTitle className="pb-0 flex justify-between items-start gap-4 text-sm font-medium font-poppins">
          <div className="flex gap-2 flex-wrap">
            <span>Escorts</span>
            <CarTaxiFront size={20} className="text-gray-400" />
          </div>
          <DateSelector
            value={dateValue}
            onChange={(value: DateRange): void => {
              setDateValue(value);
            }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center">
        {totalEscorts <= 0 ? (
          <div className="all-center min-h-[300px] flex-col gap-4 text-gray-500">
            <CarTaxiFront className="h-fit w-10" />
            <span className="text-xl text-center">
              No Escort Recorded {DateRangeMapping[dateValue]}!
            </span>
          </div>
        ) : (
          <ChartContainer
            id={id}
            config={chartConfig}
            className="mx-auto aspect-square w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="type"
                innerRadius={50}
                outerRadius={70}
                strokeWidth={5}
                activeIndex={activeIndex}
                activeShape={({
                  outerRadius = 0,
                  ...props
                }: PieSectorDataItem) => (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 5} />
                    <Sector
                      {...props}
                      outerRadius={outerRadius + 15}
                      innerRadius={outerRadius + 8}
                    />
                  </g>
                )}
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
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalEscorts.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Escorts
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>

              <ChartLegend content={<CustomLegend chartData={chartData} />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

const CustomLegend = ({
  payload,
  chartData,
}: LegendProps & {
  chartData: EscortDashboardResponseDto[];
}) => {
  return (
    <ul className="flex flex-wrap justify-between gap-3 text-xs mt-4">
      {payload?.map((entry, index) => (
        <li key={`legend-item-${index}`} className="flex items-center gap-1">
          <span
            className="block w-2 h-2"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-nowrap">{`${entry.value} - ${chartData[index].count}`}</span>
        </li>
      ))}
    </ul>
  );
};
