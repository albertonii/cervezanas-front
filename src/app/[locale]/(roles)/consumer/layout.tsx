import { User } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import React from 'react';
import { VIEWS } from '../../../../constants';
import readUserSession from '../../../../lib/actions';
import { ROLE_ENUM } from '../../../../lib/enums';
import { IUser } from '../../../../lib/types/types';

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
