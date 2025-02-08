// app/layout.tsx
import { ReactNode } from 'react';
import AppLayout from './applayout';
import { SessionProvider } from 'next-auth/react';

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <SessionProvider>
      {/* <AppLayout> */}
        {children}
        {/* </AppLayout> */}
    </SessionProvider>
  );
};

export default RootLayout;
