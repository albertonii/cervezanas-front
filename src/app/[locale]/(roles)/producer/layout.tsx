import React from 'react';
import readUserSession from '@/lib//actions';
import createServerClient from '@/utils/supabaseServer';
import IsNotYourRoleLayout from '../../components/layout/IsNotYourRoleLayout';
import AuthorizedAccessLayout from '@/app/[locale]/components/AuthorizedAccessLayout';
import { redirect } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { ROLE_ENUM } from '@/lib//enums';

type LayoutProps = {
    children: React.ReactNode;
};

export default async function layout({ children }: LayoutProps) {
    const { isAuthorized, isRoleProducer } = await checkAuthorizatedUser();

    return (
        <>
            {isAuthorized && isRoleProducer ? (
                children
            ) : (
                <>
                    {!isAuthorized && isRoleProducer && (
                        <AuthorizedAccessLayout role={ROLE_ENUM.Productor} />
                    )}

                    {!isRoleProducer && (
                        <IsNotYourRoleLayout role={ROLE_ENUM.Productor} />
                    )}
                </>
            )}
        </>
    );
}

async function checkAuthorizatedUser() {
    const session: User | null = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const isRoleProducer = await checkAuthorizatedUserByRole(session);
    const isAuthorized = await checkAuthorizedProducerByAdmin(session.id);

    return { isRoleProducer, isAuthorized };
}

async function checkAuthorizatedUserByRole(user: User) {
    const roles: string[] = user.user_metadata.access_level;
    return roles.includes(ROLE_ENUM.Productor);
}

// We are checking if the producer has been authorized by the admin
async function checkAuthorizedProducerByAdmin(userId: string) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
        .from('producer_user')
        .select('*')
        .eq('user_id', userId)
        .is('is_authorized', true);

    if (error) {
        throw error;
    }

    return data.length > 0;
}
