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
import { TbLuggageOff } from 'react-icons/tb';
import { useCallback, useEffect, useState } from 'react';
import { DateRange, DateRangeMapping } from '../constants';
import { DateSelector } from '../common/ReportDateSelection';
import SkeletonSummary from '../common/SkeletonSummary';
import SummaryError from '../common/SummaryError';
import { fetchOffloadBaggageDashboard } from '@/app/_lib/data/dashboard/dashboard';
import { OffloadBaggageDashboardResponseDto } from '../types';

const chartConfig = {
  Bag: { label: 'Pax', color: 'hsl(var(--chart-2))' },
  Cargo: { label: 'Cargo', color: 'hsl(var(--chart-3))' },
  Other: { label: 'Others', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;

export default function OffloadBaggagesSummary() {
  const id = 'pie-interactive';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateValue, setDateValue] = useState<DateRange>(DateRange.THIS_MONTH);
  const [baggageData, setBaggageData] = useState<
    { type: string; count: number; fill: string }[]
  >([]);

  const loadBaggageData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetchOffloadBaggageDashboard({
        RecordDate: dateValue,
      });

      if (response.isSuccess && response.payload != null) {
        setBaggageData(
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

  useEffect(() => {
    loadBaggageData();
  }, [loadBaggageData]);

  const totalBaggages = baggageData.reduce((sum, item) => sum + item.count, 0);

  const defaultActiveIndex = baggageData.reduce(
    (maxIndex, item, index, array) =>
      item.count > array[maxIndex].count ? index : maxIndex,
    0,
  );

  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

  if (loading) return <SkeletonSummary />;
  if (error || !baggageData.length) {
    return (
      <SummaryError
        name="Offload Baggages"
        Icon={TbLuggageOff}
        message={
          error || 'Failed to load offload baggage dashboard, please try again!'
        }
        reload={loadBaggageData}
      />
    );
  }

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader>
        <CardTitle className="pb-0 flex justify-between items-start gap-4 text-sm font-medium font-poppins">
          <div className="flex gap-2 flex-wrap">
            <span>Offload Baggages</span>
            <TbLuggageOff size={20} className="text-gray-400" />
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
        {totalBaggages <= 0 ? (
          <div className="all-center min-h-[300px] flex-col gap-4 text-gray-500">
            <TbLuggageOff className="h-fit w-10" />
            <span className="text-xl text-center">
              No Offload Baggage Recorded {DateRangeMapping[dateValue]}!
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
                data={baggageData}
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
                            {totalBaggages.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Baggages
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>

              <ChartLegend content={<CustomLegend chartData={baggageData} />} />
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
  chartData: OffloadBaggageDashboardResponseDto[];
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
