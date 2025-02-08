'use client';

import React from 'react';
import Sidebar from '@/app/_components/sidebars/Sidebar';
import { useCentralStore } from '@/app/Store';
import '../globals.css';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen, setIsSidebarOpen } = useCentralStore();

  return (
    <div
      className={`font-inter ${
        isSidebarOpen ? 'overflow-hidden' : ''
      } h-screen relative`}
    >
      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="bg-black/60 absolute top-0 left-0 md:hidden w-full h-screen z-20"
        />
      )}

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="absolute md:hidden z-30 top-0 left-0">
          <Sidebar />
        </div>
      )}

      <div className="grid md:grid-cols-[240px_1fr] w-screen overflow-x-visible">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="w-full overflow-x-auto">{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
