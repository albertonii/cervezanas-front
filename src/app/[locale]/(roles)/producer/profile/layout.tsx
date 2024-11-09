'use client';

import ProfileSidebarLayout from '@/app/[locale]/components/ui/ProfileSidebarLayout';
import React from 'react';
import {
    faUser,
    faBox,
    faTruck,
    faMapMarkerAlt,
    faStar,
    faShoppingCart,
    faBell,
    faIndustry,
    faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';

type LayoutProps = {
    children: React.ReactNode;
};

export default function layout({ children }: LayoutProps) {
    const sidebarLinks = [
        { name: 'profile', icon: faUser, option: 'settings' },
        { name: 'products', icon: faBox, option: 'products' },
        {
            name: 'distributors_associated',
            icon: faTruck,
            option: 'distributors_associated',
        },
        { name: 'events', icon: faMapMarkerAlt, option: 'events' },
        {
            name: 'consumption_points',
            icon: faMapMarkerAlt,
            option: 'consumption_points',
        },
        {
            name: 'breweries',
            icon: faIndustry,
            option: 'breweries',
        },
        {
            name: 'invoice_module.title',
            icon: faMoneyBill,
            option: 'invoice_module',
        },
        { name: 'experiences', icon: faStar, option: 'experiences' },
        { name: 'reviews', icon: faStar, option: 'reviews' },
        {
            name: 'online_orders',
            icon: faShoppingCart,
            option: 'online_orders',
        },
        { name: 'event_orders', icon: faShoppingCart, option: 'event_orders' },
        { name: 'notifications.label', icon: faBell, option: 'notifications' },
    ];

    return (
        <ProfileSidebarLayout sidebarLinks={sidebarLinks}>
            <div>{children}</div>
        </ProfileSidebarLayout>
    );
}
