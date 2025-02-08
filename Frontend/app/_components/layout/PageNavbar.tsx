'use client';

import React from 'react';
import { useCentralStore } from '@/app/Store';
import { Bell, Menu } from 'lucide-react';
// import { useNotificationStore } from '../notifications/NotificationStore';
import Link from 'next/link';

const PageNavbarLeftContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>((props, ref) => <div ref={ref} className="flex gap-2" {...props} />);

PageNavbarLeftContent.displayName = 'PageNavbarLeftContent';

const PageNavbarRightContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>((props, ref) => {
  // const unreadNotificationsCount = useNotificationStore(
  //   state => state.unreadNotificationsCount,
  // );

  return (
    <div ref={ref} className="text-gray-500 hidden md:flex gap-2" {...props}>
      <Link href={'/dashboard/notifications'} className="cursor-pointer">
        <span className="relative">
          <Bell size={25} className="hover:text-green-600" />
          {/* {unreadNotificationsCount > 0 && (
            <span
              style={{
                borderRadius: '9999px',
                fontSize: '12px',
                lineHeight: '6px',
              }}
              className="z-10 absolute top-1.5 left-2.5 mt-[-10px] mr-[-10px] p-1 text-white bg-red-400"
            >
              {unreadNotificationsCount}
            </span>
          )} */}
        </span>
      </Link>
    </div>
  );
});

PageNavbarRightContent.displayName = 'PageNavbarRightContent';

const PageNavbarIconButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className="all-center h-8 w-8 duration-200 hover:bg-gray-100 rounded-lg"
    {...props}
  />
));

PageNavbarIconButton.displayName = 'PageNavbarIconButton';

const PageNavbarPrimaryButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className="h-8 gap-1 bg-primary hidden py-1 px-2 duration-200 text-white rounded-lg text-xs md:flex items-center justify-center"
    {...props}
  />
));
PageNavbarPrimaryButton.displayName = 'PageNavbarPrimaryButton';

function PageNavbar({ children }: { children: React.ReactNode }) {
  const { setIsSidebarOpen } = useCentralStore();

  return (
    <div>
      <div className="flex px-4 py-5 md:px-6 text-gray-500 flex-wrap sm:flex-nowrap justify-between items-center">
        {children}

        <button
          onClick={() => setIsSidebarOpen(true)}
          className="all-center text-gray-500 h-8 w-8 md:hidden"
        >
          <Menu size={16} />
        </button>
      </div>

      <hr className="bg-gray-400 mx-4" />
    </div>
  );
}

export default PageNavbar;

export {
  PageNavbarLeftContent,
  PageNavbarRightContent,
  PageNavbarIconButton,
  PageNavbarPrimaryButton,
};
