'use client';

import React from 'react';
import {
    faUser,
    faBox,
    faBell,
    faTruck,
    faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import { Sidebar } from '@/app/[locale]/components/layout/Sidebar';

type LayoutProps = {
    children: React.ReactNode;
};

export default function layout({ children }: LayoutProps) {
    const sidebarLinks = [
        {
            name: 'profile',
            icon: faUser,
            option: 'settings',
        },
        {
            name: 'logistics',
            icon: faTruck,
            option: 'logistics',
        },
        {
            name: 'contracts',
            icon: faBox,
            option: 'contracts',
        },
        {
            name: 'online_orders',
            icon: faShoppingCart,
            option: 'business_orders',
        },
        {
            name: 'notifications.label',
            icon: faBell,
            option: 'notifications',
        },
    ];

    return (
        <section className="relative flex w-full bg-[url('/assets/home/bg-home.webp')] bg-auto bg-repeat bg-top max-w-[1530px] m-auto">
            <Sidebar sidebarLinks={sidebarLinks} />

            <div
                className="w-full bg-[url('/assets/madera-account.webp')] bg-auto bg-top bg-repeat sm:pt-[5vh] md:pt-[5vh] rounded-b-2xl"
                aria-label="Container Distributor settings"
            >
                {children}
            </div>
        </section>
    );
}
