'use client';

import React from 'react';
import { Sidebar } from '../../../components/common/Sidebar';

type LayoutProps = {
    children: React.ReactNode;
};

export default function layout({ children }: LayoutProps) {
    const sidebarLinks = [
        {
            name: 'profile',
            icon: 'user',
            option: 'settings',
        },
        {
            name: 'logistics',
            icon: 'box',
            option: 'logistics',
        },
        {
            name: 'contracts',
            icon: 'box',
            option: 'contracts',
        },
        {
            name: 'online_orders',
            icon: 'box',
            option: 'business_orders',
        },
        // {
        //   name: ("distributor_feedback"),
        //   icon: "box",
        //   option: "reviews",
        // },
        {
            name: 'notifications',
            icon: 'bell',
            option: 'notifications',
        },
    ];

    return (
        <section className="relative flex w-full">
            <Sidebar sidebarLinks={sidebarLinks} />

            <div
                className="w-full bg-[url('/assets/madera-account.webp')] bg-auto bg-top bg-repeat sm:pt-[5vh] md:pt-[5vh]"
                aria-label="Container Distributor settings"
            >
                {children}
            </div>
        </section>
    );
}
