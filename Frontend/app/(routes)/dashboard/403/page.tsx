'use client';

import { Lock } from 'lucide-react';
import PageNavbar, {
  PageNavbarLeftContent,
  PageNavbarRightContent,
} from '@/app/_components/layout/PageNavbar';
import Breadcrumb from '@/app/_components/ui/Breadcrumb';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Can } from '@/app/_services/serverRoleService';

export default async function Page() {
  return (
    <>
      <PageNavbar>
        <PageNavbarLeftContent>
          <div className="whitespace-nowrap flex items-center">
            <Lock color="green" className="text-3xl" />
            <Breadcrumb
              breadcrumbs={[
                {
                  label: 'Unauthorized',
                  to: ``,
                  active: true,
                },
              ]}
            />
          </div>
        </PageNavbarLeftContent>

        <PageNavbarRightContent className="pr-2"></PageNavbarRightContent>
      </PageNavbar>

      <div className="mx-4">
        <div className="mt-10 md:mt-50 lg:mt-80 all-center text-gray-500">
          <div className="flex flex-col items-center gap-4">
            <Lock size={60} />
            <div className="text-center">
              <span className="text-2xl">403 | Not Authorized</span>
              <p className="text-xs text-gray-600">
                You do not have permission to access this page.
              </p>
            </div>
            {(await Can('View-Dashboard')) && (
              <Link href={'/dashboard'}>
                <Button>Go to Dashboard</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
