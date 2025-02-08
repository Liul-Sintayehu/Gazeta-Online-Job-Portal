import { tokenProvider } from './tokenServices';

type ClaimCache = {
  claims: string[];
  expiration: number;
};

let claimCache: ClaimCache | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function Can(action: string): Promise<boolean> {
  if (!claimCache || Date.now() > claimCache.expiration) {
    await refreshClaimCache();
  }

  return claimCache!.claims.includes(action);
}

async function refreshClaimCache(): Promise<void> {
  const { claims } = await tokenProvider();
  const parsedClaims = claims ? JSON.parse(claims) : [];

  claimCache = {
    claims: parsedClaims,
    expiration: Date.now() + CACHE_DURATION,
  };
}
