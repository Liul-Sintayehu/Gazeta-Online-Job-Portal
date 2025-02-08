'use client';

import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { useCentralStore } from '../Store';
import { tokenProvider } from '../_services/tokenServices';
import { logOut } from '../_lib/actions/auth';
import crypto from 'crypto';

function generateFingerprint(): string {
  try {
    const { userAgent, platform, language, hardwareConcurrency } = navigator;
    const { width, height, colorDepth } = screen;

    const fingerprintString = [
      userAgent,
      platform,
      language,
      hardwareConcurrency,
      width,
      height,
      colorDepth,
    ].join('|');

    const hash = crypto
      .createHash('sha256')
      .update(fingerprintString)
      .digest('hex');
    return hash;
  } catch (error) {
    return '';
  }
}

type ChildrenProp = {
  children: React.ReactNode;
};

const Provider = ({ children }: ChildrenProp) => {
  const { setClaims, setFullName, setAccessToken, setIdToken, setUsername } =
    useCentralStore();

  useEffect(() => {
    const validateSession = async () => {
      const tokenData = await tokenProvider();

      if (!tokenData) {
        logOut();
        return;
      }

      const { expiry, fingerprint: sessionFingerprint } = tokenData;
      const currentFingerprint = generateFingerprint();

      if (expiry) {
        const expiryDate = new Date(expiry);
        if (expiryDate < new Date()) {
          logOut();
        }
      }

      if (!sessionFingerprint || sessionFingerprint !== currentFingerprint) {
        logOut();
        return;
      }

      const { firstName, lastName, claims, accessToken, idToken, username } =
        tokenData;

      const parsedClaims = claims ? JSON.parse(claims) : [];
      setClaims(parsedClaims);

      setFullName(firstName && lastName ? `${firstName} ${lastName}` : 'User');
      setAccessToken(accessToken);
      setIdToken(idToken);
      setUsername(username);
    };

    validateSession();
  }, [setClaims, setFullName, setAccessToken, setIdToken, setUsername]);

  return <SessionProvider>{children}</SessionProvider>;
};

export default Provider;
