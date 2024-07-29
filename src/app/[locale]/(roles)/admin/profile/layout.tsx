import React from 'react';
import readUserSession from '@/lib//actions';
import { redirect } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { ROLE_ENUM } from '@/lib//enums';
import { Sidebar } from '@/app/[locale]/components/common/Sidebar';
import { faUser, faBox, faBell } from '@fortawesome/free-solid-svg-icons';

type LayoutProps = {
    children: React.ReactNode;
};

const sidebarLinks = [
    {
        name: 'contracts_cps',
        icon: faUser,
        option: 'contracts_cps',
    },
    {
        name: 'monthly_products',
        icon: faBox,
        option: 'monthly_products',
    },
    {
        name: 'admin_products',
        icon: faBox,
        option: 'products',
    },
    {
        name: 'admin_events',
        icon: faBox,
        option: 'events',
    },
    {
        name: 'admin_cps',
        icon: faBox,
        option: 'consumption_points',
    },
    {
        name: 'admin_campaigns',
        icon: faBox,
        option: 'campaigns',
    },
    {
        name: 'notifications.label',
        icon: faBell,
        option: 'notifications',
    },
    {
        name: 'user_reports',
        icon: faBell,
        option: 'reports',
    },
    {
        name: 'authorized_users',
        icon: faUser,
        option: 'authorized_users',
    },
];

export default async function layout({ children }: LayoutProps) {
    const hasAuthorization = await checkAuthorizatedUser();

    return (
        <>
            {hasAuthorization ? (
                <section className="relative flex w-full min-h-[80vh]">
                    <Sidebar sidebarLinks={sidebarLinks} />

                    <div
                        className="w-full relative pt-4 sm:pt-8"
                        aria-label="Container Admin settings"
                    >
                        {children}
                    </div>
                </section>
            ) : (
                <section>
                    <h2>
                        No tienes los permisos necesarios para acceder a esta
                        página
                    </h2>
                </section>
            )}
        </>
    );
}

async function checkAuthorizatedUser() {
    const session: User | null = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const isRoleAdmin = await checkAuthorizatedUserByRole(session);
    return isRoleAdmin;
}

async function checkAuthorizatedUserByRole(user: User) {
    const roles: string[] = user.user_metadata.access_level;
    return roles.includes(ROLE_ENUM.Admin);
}
