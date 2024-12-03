// components/layout/Breadcrumb.tsx

'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { getBreadcrumbs, Breadcrumb } from '@/utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const BreadcrumbComponent = () => {
    const locale = useLocale();
    const pathname = usePathname();
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

    useEffect(() => {
        const fetchBreadcrumbs = async () => {
            const crumbs = await getBreadcrumbs(pathname, locale);
            setBreadcrumbs(crumbs);
        };
        fetchBreadcrumbs();
    }, [pathname, locale]);

    return (
        <nav
            aria-label="breadcrumb"
            className="bg-beer-dark p-2 rounded-lg shadow-lg my-2"
        >
            <ul className="flex items-center text-beer-blonde text-sm space-x-2">
                <li className="flex items-center">
                    <Link
                        href={`/${locale}`}
                        aria-label="Home"
                        className="hover:text-beer-amber transition-colors duration-300"
                    >
                        <FontAwesomeIcon icon={faHome} />
                    </Link>
                </li>

                {breadcrumbs.length > 0 && (
                    <li className="text-beer-light">
                        <FontAwesomeIcon icon={faChevronRight} />
                    </li>
                )}

                {breadcrumbs.map((breadcrumb, index) => {
                    const isActive = index === breadcrumbs.length - 1;

                    return (
                        <React.Fragment key={index}>
                            <li
                                className={`flex items-center transition-colors duration-300 ${
                                    isActive
                                        ? 'text-beer-amber font-semibold'
                                        : 'hover:text-beer-light hover:font-semibold'
                                }`}
                            >
                                <Link
                                    href={breadcrumb.path}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {breadcrumb.name}
                                </Link>
                            </li>

                            {index < breadcrumbs.length - 1 && (
                                <li className="text-beer-light">
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </li>
                            )}
                        </React.Fragment>
                    );
                })}
            </ul>
        </nav>
    );
};

export default BreadcrumbComponent;
