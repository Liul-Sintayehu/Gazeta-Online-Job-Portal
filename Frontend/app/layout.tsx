import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import Provider from './_components/Provider';
import { AppSidebar } from './Sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export const metadata: Metadata = {
  title: 'Fitness Planer',
  description: 'desc',
  keywords: 'key',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
      <SidebarProvider>
        <AppSidebar/>
        {/* <Provider> */}
        <main className='w-full'>
        
        <SidebarTrigger className='w-full bg-purple-500 flex justify-start p-4 text-white rounded-none'/>
         
        <Toaster position="top-right" expand={true} richColors />
        {children}
          </main>
          
        {/* </Provider> */}
        </SidebarProvider>
      </body>
    </html>
  );
}
