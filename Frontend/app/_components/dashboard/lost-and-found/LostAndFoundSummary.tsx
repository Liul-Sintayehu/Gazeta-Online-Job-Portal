'use client';

import { useState, useEffect } from 'react';
import { Area, AreaChart, CartesianGrid, LabelList, XAxis } from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { TbShoppingBagSearch } from 'react-icons/tb';
import SkeletonSummary from '../common/SkeletonSummary';
import { fetchLostAndFoundDashboard } from '@/app/_lib/data/dashboard/dashboard';
import { formatChartData, getDateRangeParams } from '../utils';
import SummaryError from '../common/SummaryError';

const chartConfig = {
  items: {
    label: 'Items Found',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function LostAndFoundSummary() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('Weekly');
  const [chartData, setChartData] = useState<{ date: string; items: number }[]>(
    [],
  );
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPrices, setTotalPrices] = useState<number>(0);

  useEffect(() => {
    loadLostAndFound();
  }, [dateRange]);

  const loadLostAndFound = async () => {
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRangeParams(dateRange);
      const formattedData = formatChartData(dateRange, startDate, endDate);

      const response = await fetchLostAndFoundDashboard({
        StartDate: startDate.toISOString(),
        EndDate: endDate.toISOString(),
      });

      if (response.isSuccess && response.payload) {
        response.payload.forEach(item => {
          const itemDate = new Date(item.date);
          let index: number;

          if (dateRange === 'Weekly') {
            index = itemDate.getDay();
          } else if (dateRange === 'Monthly') {
            index = itemDate.getDate() - 1;
          } else {
            index = itemDate.getMonth();
          }

          if (index >= 0 && index < formattedData.length) {
            formattedData[index].items += item.items;
          }
        });

        setChartData(formattedData);
        setTotalItems(formattedData.reduce((sum, item) => sum + item.items, 0));
        setTotalPrices(
          response.payload.reduce(
            (sum, item) => sum + parseFloat(item.price || '0'),
            0,
          ),
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <SkeletonSummary />;

  if (!chartData.length) {
    return (
      <SummaryError
        name="Lost and Found"
        Icon={TbShoppingBagSearch}
        message={'Failed to load lost and found dashbaord, please try again!'}
        reload={loadLostAndFound}
      />
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="pb-0 flex justify-between items-start gap-4 text-sm font-medium font-poppins">
          <div className="flex gap-2">
            <span>Lost and Found</span>
            <TbShoppingBagSearch size={20} className="text-gray-400" />
          </div>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger id="date" className="w-fit h-7 text-xs">
              <SelectValue placeholder="Report Date" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Yearly">Yearly</SelectItem>
              <SelectItem value="Last Year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around gap-5 mb-4 text-gray-700 text-center">
          <div className="flex flex-col gap-1 justify-between items-center">
            <span className="text-sm text-gray-600">
              Total Items Found {dateRange}
            </span>
            <span className="text-lg font-semibold">{totalItems}</span>
          </div>
          <div className="flex flex-col gap-1 justify-between items-center">
            <span className="text-sm text-gray-600">
              Total Estimated Price of Items
            </span>
            <span className="text-lg font-semibold">
              {`ETB ${totalPrices.toLocaleString('en-US', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}`}
            </span>
          </div>
        </div>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <defs>
              <linearGradient id="fillItems" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-items)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-items)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="items"
              type="natural"
              fill="url(#fillItems)"
              fillOpacity={0.4}
              stroke="var(--color-items)"
              stackId="a"
            >
              <LabelList
                dataKey="items"
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Area>
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
