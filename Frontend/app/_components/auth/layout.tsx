import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Metadata } from 'next';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'SeMS',
  description: 'ETG - Security Management System',
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <SessionProvider>
      <html lang="en">
        <head>
          {/* <link rel="icon" href="/favicon.ico" /> */}icon
        </head>
        <body>
          {/* Add Toaster for Sonner */}
          <Toaster position="top-right" richColors />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
};

export default RootLayout;
