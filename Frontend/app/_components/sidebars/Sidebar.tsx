'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import {
  ArrowRight,
  Headphones,
  LayoutDashboard,
  UserRound,
  LogOut,
  KeySquare,
  ChevronsUpDown,
} from 'lucide-react';

import { tokenProvider } from '@/app/_services/tokenServices';
import { handleSignOut } from '@/app/_lib/auth/authActions';
import NavLinks from './NavLinks';
// import NotificationNavBar from './NotificationNavBar';
import { SidebarLink } from './SidebarLink';
import { usePermissions } from '@/app/_hooks/usePermissions';
import { Select } from '@/components/ui/select';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { CardHeader } from '@nextui-org/react';
import SideBarFooter from './SidebarFooter';

const permissionKeys = ['View-Dashboard'];

type PermissionKey = (typeof permissionKeys)[number];

export default function Sidebar() {
  const permissions = usePermissions<PermissionKey>(permissionKeys);

  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const [profileName, setProfilename] = useState('');

  useEffect(() => {
    const getUsername = async () => {
      const { username, firstName, lastName } = await tokenProvider();
      setProfilename(`${firstName} ${lastName} (${username})`);
    };

    getUsername();
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gray-800 text-white z-40 flex flex-col transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex flex-col flex-1 h-full">
        {/* Logo */}
        <div className={`px-8 py-4 flex items-center border-b border-gray-700`}>
          {isSidebarOpen && (
            <div className="w-full flex flex-col items-center justify-center gap-3">
              <div className="text-white flex items-center justify-center">
                <Image
                  alt="Ethiopian Logo"
                  src={'/images/ethiopian.png'}
                  width={200}
                  height={100}
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
              <div className="flex flex-col gap-1 text-center">
                <span className="font-poppins tracking-wider font-semibold text-gray-200 text-2xl">
                  SeMS
                </span>
                <span className="font-inter tracking-wider w-full  text-sm text-gray-300">
                  ETG - Security Management System (ESeMS)
                </span>
              </div>
            </div>
          )}
        </div>
        {/* Sidebar Links */}
        <div className="flex-1 py-4 overflow-y-auto ">
          {permissions['View-Dashboard'] && (
            <SidebarLink
              key={'dashboard'}
              href={'/dashboard'}
              icon={LayoutDashboard}
              label={isSidebarOpen ? 'Dashboard' : undefined}
              isActive={pathname == '/dashboard'}
            />
          )}
          {/* <NotificationNavBar isSidebarOpen={isSidebarOpen} /> */}
          <NavLinks />
        </div>
        {/* Footer */}
        <SideBarFooter
          isSidebarOpen={isSidebarOpen}
          profileName={profileName}
          handleSignOut={handleSignOut}
        />
      </div>
    </div>
  );
}
