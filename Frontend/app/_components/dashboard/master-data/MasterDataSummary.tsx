import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListTodo, MapPin, Signpost, Text, Users } from 'lucide-react';
import CountUp from '../common/CountUp';
import SkeletonSummary from '../common/SkeletonSummary';
import { MasterDataDashboardResponseDto } from '@/app/_components/dashboard/types';
import { fetchMasterDataDashboard } from '@/app/_lib/data/dashboard/dashboard';
import SummaryError from '../common/SummaryError';

const icons = {
  Employees: Users,
  'Clearance Tasks': ListTodo,
  Locations: MapPin,
  Posts: Signpost,
};

export default function MasterDataSummary() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [masterData, setMasterData] =
    useState<MasterDataDashboardResponseDto | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetchMasterDataDashboard({});
      if (response.isSuccess) {
        setMasterData(response.payload);
      } else {
        if (response.errors.length > 0) setError(response.errors[0]);
      }
    } catch {
      setError('Failed to fetch master data dashboard, please try again!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <SkeletonSummary />;

  if (!masterData || error)
    return (
      <SummaryError
        name="Master Data"
        Icon={Text}
        message={
          error ||
          'Failed to load the masterdata dashboard, please reload to try again!'
        }
        reload={loadData}
      />
    );

  const masterDataElements = [
    {
      label: 'Employees',
      count: masterData.employeeCount,
      icon: icons.Employees,
    },
    {
      label: 'Clearance Tasks',
      count: masterData.clearanceTaskCount,
      icon: icons['Clearance Tasks'],
    },
    {
      label: 'Locations',
      count: masterData.locationCount,
      icon: icons.Locations,
    },
    {
      label: 'Posts',
      count: masterData.postCount,
      icon: icons.Posts,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-4 text-sm font-medium font-poppins">
          <span>Master Data</span>
          <Text size={20} className="text-gray-400" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-2">
          {masterDataElements.map((element, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="text-gray-500 border p-2 rounded-full">
                <element.icon className="h-fit w-8" />
              </div>
              <div className="flex flex-col text-xl font-semibold text-gray-800">
                <span className="text-medium text-gray-600">
                  {element.label}
                </span>
                <CountUp targetNumber={element.count} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
