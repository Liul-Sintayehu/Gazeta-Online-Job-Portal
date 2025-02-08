import React from 'react';
import { BreadCrumbs } from '../../_lib/definitions';
import clsx from 'clsx';
import Link from 'next/link';

const Breadcrumb = ({ breadcrumbs }: { breadcrumbs: BreadCrumbs[] }) => {
  return (
    <nav aria-label="Breadcrumb" className="md:block ml-2 font-poppins">
      <ol className={clsx('', 'flex text-sm')}>
        {breadcrumbs.map((items, index) => (
          <li
            key={items.to + index}
            aria-current={items.active}
            className={clsx(items.active ? 'text-green-700' : 'text-gray-900')}
          >
            <Link href={items.to} className="text-xl">
              {items.label}
            </Link>
            {index < breadcrumbs?.length - 1 ? (
              <span className="mx-2 inline-block">/</span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
