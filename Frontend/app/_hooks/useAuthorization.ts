import { useEffect, useState } from 'react';
import { Can } from '@/app/_services/serverRoleService';

export const useAuthorization = (permissions: string | string[]) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (Array.isArray(permissions)) {
        const results = await Promise.all(
          permissions.map(permission => Can(permission)),
        );
        setIsAuthorized(results.every(result => result));
      } else {
        const result = await Can(permissions);
        setIsAuthorized(result);
      }
    };
    checkAuthorization();
  }, [permissions]);

  return isAuthorized;
};
