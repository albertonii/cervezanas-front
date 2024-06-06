import React from 'react';
import readUserSession from '../../../../lib/actions';
import { User } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { ROLE_ENUM } from '../../../../lib/enums';

type LayoutProps = {
    children: React.ReactNode;
};

export default async function layout({ children }: LayoutProps) {
    const hasAuthorization = await checkAuthorizatedUser();
    return (
        <>
            {hasAuthorization ? (
                <>{children}</>
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

    const isRoleConsumer = await checkAuthorizatedUserByRole(session);
    return isRoleConsumer;
}

async function checkAuthorizatedUserByRole(user: User) {
    const roles: string[] = user.user_metadata.access_level;
    const isFromProvider = user.app_metadata.provider === 'google';
    return roles.includes(ROLE_ENUM.Cervezano) || isFromProvider;
}
