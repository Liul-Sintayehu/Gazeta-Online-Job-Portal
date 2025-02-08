'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

//authenticate
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Invalid credentials.';
      }
    }
    throw error;
  }
}

//Logout
import { signOut as signOutAction } from '@/auth';

export const logOut = async () => {
  await signOutAction();
};
