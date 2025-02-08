import { useState, useEffect } from 'react';
import { Can } from '@/app/_services/serverRoleService';

export function usePermissions<T extends string>(
  permissionKeys: T[],
): Record<T, boolean> {
  const [permissions, setPermissions] = useState<Record<T, boolean>>(() =>
    permissionKeys.reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as Record<T, boolean>,
    ),
  );

  useEffect(() => {
    const loadPermissions = async () => {
      const results = await Promise.all(permissionKeys.map(key => Can(key)));
      const newPermissions = permissionKeys.reduce((acc, key, index) => {
        acc[key] = results[index];
        return acc;
      }, {} as Record<T, boolean>);

      setPermissions(newPermissions);
    };

    loadPermissions();
  }, [permissionKeys.join(',')]);

  return permissions;
}
