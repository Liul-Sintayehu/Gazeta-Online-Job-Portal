'use client';

import { useCentralStore } from '../Store';

export function Can(action: string): boolean {
  const { claims = [] } = useCentralStore();
  return claims && claims?.length > 0 ? claims.includes(action) : false;
}
