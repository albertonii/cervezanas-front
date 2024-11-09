'use client';

import ProfileSidebarLayout from '@/app/[locale]/components/ui/ProfileSidebarLayout';
import React from 'react';
import {
    faUser,
    faBox,
    faBell,
    faTruck,
    faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';

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
        <ProfileSidebarLayout sidebarLinks={sidebarLinks}>
            <div>{children}</div>
        </ProfileSidebarLayout>
    );
}
