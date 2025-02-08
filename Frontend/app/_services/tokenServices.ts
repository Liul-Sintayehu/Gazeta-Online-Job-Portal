import { getSession } from 'next-auth/react';

export async function tokenProvider() {
  try {
    const session = await getSession();

    if (!session) {
      return {
        idToken: '',
        accessToken: '',
        username: '',
        firstName: '',
        lastName: '',
        claims: null,
        expiry: '',
        fingerprint: '', // Add fingerprint
      };
    }

    const {
      idToken = '',
      accessToken = '',
      username = '',
      firstName = '',
      lastName = '',
      claims = null,
      expiry = '',
      fingerprint = '',
    } = session?.user || {};

    return {
      idToken,
      accessToken,
      username,
      firstName,
      lastName,
      claims,
      expiry,
      fingerprint, // Include fingerprint
    };
  } catch (error) {
    return {
      idToken: '',
      accessToken: '',
      username: '',
      firstName: '',
      lastName: '',
      claims: null,
      expiry: '',
      fingerprint: '', // Default empty fingerprint
    };
  }
}
