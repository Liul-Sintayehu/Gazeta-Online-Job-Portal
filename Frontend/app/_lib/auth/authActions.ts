'use server';

import { useCentralStore } from '@/app/Store';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

export async function handleCredentialsSignin({
  username,
  password,
  fingerprint,
}: {
  username: string;
  password: string;
  fingerprint: string;
}) {
  try {
    const result = await signIn('credentials', {
      username,
      password,
      fingerprint,
      redirect: false,
    });

    if (result?.error) {
      return { message: result.error };
    }

    const accessToken = result?.accessToken;
    const idToken = result?.idToken;

    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('idToken', idToken);

    const { setAccessToken, setIdToken, setUsername } =
      useCentralStore.getState();
    setAccessToken(accessToken);
    setIdToken(idToken);
    setUsername(username);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
        case 'CallbackRouteError':
          return { message: 'Invalid credentials!' };
        default:
          return { message: 'Something went wrong, please try again!' };
      }
    }
  }
}

export async function handleSignOut() {
  const { clearSession } = useCentralStore.getState();
  await signOut({ redirectTo: '/auth/login' });
  clearSession();
}
