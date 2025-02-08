// app/_services/authService.ts

import axios, { AxiosResponse } from 'axios';
import { authUrl } from '@/app/_services/envService';
import type { User } from '@/app/_lib/definitions';
import type { NextAuthConfig } from 'next-auth';
import { getClientAccessToken } from './clientService';

export const AuthConfig = {
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        return isLoggedIn;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

async function getUser(
  username: string,
  password: string,
): Promise<User | undefined> {
  const credentials = { username, password };

  try {
    const accessToken = await getClientAccessToken();
    if (!accessToken) throw new Error('Failed to retrieve access token.');

    const response: AxiosResponse<User> = await axios.post(
      `${authUrl}/api/v1/User/Login`,
      credentials,
      {
        headers: { accessToken },
      },
    );

    let uniqueClaims: string[] = [];
    try {
      const roles = response?.data?.roles;

      // Fix for JSON parsing issue
      let parsedRoles = [];
      if (typeof roles === 'string') {
        try {
          parsedRoles = JSON.parse(roles);
        } catch (error) {
          parsedRoles = [];
        }
      } else {
        parsedRoles = roles || [];
      }

      uniqueClaims = Array.from(
        new Set(
          parsedRoles.flatMap((role: any) =>
            role.claims
              .filter((c: any) => c.clientId === 50)
              .map((c: any) => c.claim),
          ),
        ),
      );
    } catch (error: any) {
      uniqueClaims = [];
    }

    const stringifiedClaims = JSON.stringify(uniqueClaims);

    const userWithTokens = {
      ...response.data,
      accessToken: accessToken,
      claims: stringifiedClaims,
    };

    return userWithTokens;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Invalid credentials.');
    } else {
      throw new Error('Failed to authenticate user. Please try again.');
    }
  }
}

export { getUser };
