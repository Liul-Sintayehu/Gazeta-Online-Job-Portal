import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { UserRound, ChevronsUpDown, LogOut, KeySquare } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

interface SideBarFooterProps {
  isSidebarOpen: boolean;
  profileName: string;
  handleSignOut: () => void;
}

const SideBarFooter: React.FC<SideBarFooterProps> = ({
  isSidebarOpen,
  profileName,
  handleSignOut,
}) => {
  return (
    <div className="p-2 mt-auto border-t border-gray-700">
      <div className="flex flex-col gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full flex items-center gap-3 p-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-xl transition-colors duration-200">
              <UserRound
                className="border border-gray-300 rounded-full p-1"
                size={30}
                width={30}
              />
              {isSidebarOpen && (
                <div className="flex-1 flex items-center justify-between">
                  <h2 className="text-sm font-semibold m-0">{profileName}</h2>
                  <ChevronsUpDown
                    size={18}
                    className="text-gray-400 hover:text-gray-200"
                  />
                </div>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="m-2 rounded-xl flex flex-col gap-4 bg-slate-50">
            <div className="w-52 flex flex-row items-center gap-3 text-gray-800">
              <UserRound
                className="border border-gray-300 rounded-full p-1"
                size={30}
                width={30}
              />
              <div className="flex-1">
                <h2 className="text-sm font-semibold m-0">{profileName}</h2>
              </div>
            </div>

            <div className="flex flex-col gap-1 py-2 border-t">
              <Link
                href={'/dashboard/change-password'}
                className="w-full flex items-center gap-3 p-2 text-gray-800 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                <KeySquare size={18} />
                <span>Change Password</span>
              </Link>
              <form action={handleSignOut} className="w-full">
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 p-2 text-gray-800 hover:text-red-500  rounded-md transition-colors duration-200"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default SideBarFooter;
