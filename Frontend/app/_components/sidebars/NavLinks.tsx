'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Can } from '@/app/_services/serverRoleService'; // Server-side service
import { SideBarLink, sidebarLinks } from './sidebar-links';
import ParentNav from './ParentNav';
import { SidebarLink } from './SidebarLink';
import Spinner from '../common/Spinner';

const NavLinks = () => {
  const pathname = usePathname();
  const [authorizedLinks, setAuthorizedLinks] = useState<SideBarLink[]>([]);
  const [loading, setLoading] = useState(true);

  const isActiveDropdown = (nav: SideBarLink): boolean => {
    if (!nav.children) return false;
    return nav.children.some(
      child => child.link && pathname?.startsWith(child.link),
    );
  };

  useEffect(() => {
    const fetchAuthorizedLinks = async () => {
      const filteredLinks = await Promise.all(
        sidebarLinks.map(async link => ({
          ...link,
          children: link.children
            ? await Promise.all(
                link.children.map(async child => ({
                  ...child,
                  authorized: await Can(child.claim),
                })),
              ).then(children => children.filter(child => child.authorized))
            : [],
          authorized: await Can(link.claim),
        })),
      );

      const finalLinks = filteredLinks.filter(
        link => link.authorized || link.children.length > 0,
      );

      setAuthorizedLinks(finalLinks);
      setLoading(false);
    };

    fetchAuthorizedLinks();
  }, []);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4`}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-900">
      {authorizedLinks.map((nav, index) => (
        <div key={index}>
          {nav.children && nav.children.length > 0 ? (
            <ParentNav
              key={index}
              label={nav.label}
              icon={nav.icon}
              isDropdownOpen={isActiveDropdown(nav)}
            >
              {nav.children.map((navChild, innerIndex) => (
                <SidebarLink
                  key={`${index}-${innerIndex}`}
                  href={navChild.link}
                  icon={navChild.icon}
                  label={navChild.label}
                  isActive={pathname?.startsWith(navChild.link) ?? false}
                />
              ))}
            </ParentNav>
          ) : (
            <SidebarLink
              key={index}
              href={nav.link}
              icon={nav.icon}
              label={nav.label}
              isActive={pathname?.startsWith(nav.link) ?? false}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default NavLinks;
