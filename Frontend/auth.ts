// auth.ts

import NextAuth, { DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { AuthConfig, getUser } from './app/_services/authService';
import { User } from './app/_lib/definitions';
import { authSecret, tokenExpiry } from './app/_services/envService';

declare module 'next-auth' {
  interface Session {
    user: {
      idToken?: string;
      accessToken?: string;
      username?: string;
      firstName?: string;
      lastName?: string;
      claims?: string;
      expiry?: string;
      fingerprint?: string;
    } & DefaultSession['user'];
  }

  interface User {
    idToken?: string;
    accessToken?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    claims?: string;
    expiry?: string;
    fingerprint?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...AuthConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            username: z.string(),
            password: z.string().min(6),
            fingerprint: z.string(),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password, fingerprint } = parsedCredentials.data;
          try {
            const user: User | undefined = await getUser(username, password);

            if (user) {
              user.fingerprint = fingerprint;
            }

            return user || null;
          } catch (error) {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],
  secret: authSecret,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const expiryInHours = Number(tokenExpiry) || 4;
        const expiryDate = new Date(
          Date.now() + expiryInHours * 60 * 60 * 1000,
        ).toISOString();
        token.expiry = expiryDate;

        token.idToken = user.idToken;
        token.accessToken = user.accessToken;
        token.username = user.username;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.claims = user.claims;

        token.fingerprint = user.fingerprint;
      }

      return token;
    },
    async session({ session, token }) {
      if (typeof token.idToken === 'string') {
        session.user.idToken = token.idToken;
      }
      if (typeof token.accessToken === 'string') {
        session.user.accessToken = token.accessToken;
      }
      if (typeof token.username === 'string') {
        session.user.username = token.username;
      }
      if (typeof token.firstName === 'string') {
        session.user.firstName = token.firstName;
      }
      if (typeof token.lastName === 'string') {
        session.user.lastName = token.lastName;
      }
      if (typeof token.claims === 'string') {
        session.user.claims = token.claims;
      }
      if (typeof token.expiry === 'string') {
        session.user.expiry = token.expiry;
      }
      if (typeof token.fingerprint === 'string') {
        session.user.fingerprint = token.fingerprint;
      }

      return session;
    },
  },
});
