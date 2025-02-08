import SignIn from '@/app/_components/auth/SignIn';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | SeMS',
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <SignIn />
    </main>
  );
}
