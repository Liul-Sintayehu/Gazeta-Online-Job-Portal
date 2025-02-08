'use client';

import React from 'react';
import PageNavbar, {
  PageNavbarLeftContent,
  PageNavbarRightContent,
} from '@/app/_components/layout/PageNavbar';
import { KeySquare } from 'lucide-react';
import Breadcrumb from '@/app/_components/ui/Breadcrumb';
import ChangePassword from '@/app/_components/password/ChangePassword';

const Page = () => {
  return (
    <>
      <PageNavbar>
        <PageNavbarLeftContent>
          <div className="whitespace-nowrap flex items-center">
            <KeySquare color="green" className="text-3xl" />
            <Breadcrumb
              breadcrumbs={[
                {
                  label: 'Change Password',
                  to: `/change-password`,
                  active: true,
                },
              ]}
            />
          </div>
        </PageNavbarLeftContent>
        <PageNavbarRightContent className="pr-2"></PageNavbarRightContent>
      </PageNavbar>

      <div className="ml-4">
        <ChangePassword />
      </div>
    </>
  );
};

export default Page;
