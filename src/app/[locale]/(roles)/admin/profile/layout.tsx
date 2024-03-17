import React from 'react';
import readUserSession from '../../../../../lib/actions';
import { redirect } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { VIEWS } from '../../../../../constants';
import { ROLE_ENUM } from '../../../../../lib/enums';
import { Sidebar } from '../../../components/common/Sidebar';

type LayoutProps = {
    children: React.ReactNode;
};

export default async function layout({ children }: LayoutProps) {
    const hasAuthorization = await checkAuthorizatedUser();

    const sidebarLinks = [
        {
            name: 'contracts_cps',
            icon: 'user',
            option: 'contracts_cps',
        },
        {
            name: 'monthly_products',
            icon: 'box',
            option: 'monthly_products',
        },
        {
            name: 'admin_products',
            icon: 'box',
            option: 'products',
        },
        {
            name: 'admin_events',
            icon: 'box',
            option: 'events',
        },
        {
            name: 'admin_cps',
            icon: 'box',
            option: 'consumption_points',
        },
        {
            name: 'admin_campaigns',
            icon: 'box',
            option: 'campaigns',
        },
        {
            name: 'notifications',
            icon: 'bell',
            option: 'notifications',
        },
        {
            name: 'user_reports',
            icon: 'bell',
            option: 'reports',
        },
        {
            name: 'authorized_users',
            icon: 'user',
            option: 'authorized_users',
        },
    ];

    return (
        <>
            {hasAuthorization ? (
                <section className="relative flex w-full">
                    <Sidebar sidebarLinks={sidebarLinks} />

                    <div
                        className="w-full bg-beer-softFoam sm:pt-[5vh] md:pt-[5vh]"
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
        redirect(VIEWS.SIGN_IN);
    }

    const isRoleAdmin = await checkAuthorizatedUserByRole(session);
    return isRoleAdmin;
}

async function checkAuthorizatedUserByRole(user: User) {
    const role = user.user_metadata.access_level;
    return role === ROLE_ENUM.Admin;
}
