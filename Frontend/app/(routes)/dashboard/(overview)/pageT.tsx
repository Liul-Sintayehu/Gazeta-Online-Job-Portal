'use client';

import React, { useEffect } from 'react';
import PageNavbar, {
  PageNavbarLeftContent,
  PageNavbarRightContent,
} from '@/app/_components/layout/PageNavbar';
import { LayoutDashboard } from 'lucide-react';
import Breadcrumb from '@/app/_components/ui/Breadcrumb';
import { useRouter } from 'next/navigation';
import { useAuthorization } from '@/app/_hooks/useAuthorization';
import Spinner from '@/app/_components/common/Spinner';
import Dashboard from '@/app/_components/dashboard/Dashboard';

const Page = () => {
  const router = useRouter();

  const isAuthorized = useAuthorization('View-Dashboard');

  useEffect(() => {
    if (isAuthorized === false) {
      router.push('/dashboard/403');
    }
  }, [isAuthorized, router]);

  if (isAuthorized === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }
  return (
    <>
      <PageNavbar>
        <PageNavbarLeftContent>
          <div className="whitespace-nowrap flex items-center">
            <LayoutDashboard color="green" className="text-3xl" />
            <Breadcrumb
              breadcrumbs={[
                {
                  label: 'Dashboard',
                  to: `/dashboard`,
                  active: true,
                },
              ]}
            />
          </div>
        </PageNavbarLeftContent>
        <PageNavbarRightContent className="pr-2"></PageNavbarRightContent>
      </PageNavbar>

      <div className="ml-4">
        <Dashboard />
      </div>
    </>
  );
};

export default Page;
