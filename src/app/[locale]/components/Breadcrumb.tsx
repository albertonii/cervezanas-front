'use client';

import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import { getBreadcrumbs } from '@/utils/utils';
import { useLocale } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Breadcrumb = () => {
    const locale = useLocale();
    const paths = usePathname();

    const breadcrumbs =
        locale == 'en'
            ? getBreadcrumbs(paths, 'en')
            : getBreadcrumbs(paths, 'es');

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
                                className={`flex items-center hover:text-beer-light transition-colors duration-300 hover:font-semibold ${
                                    isActive && 'text-beer-amber font-semibold'
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

export default Breadcrumb;
