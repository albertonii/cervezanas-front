import { redirect } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { ROLE_ENUM } from '@/lib//enums';
import React from 'react';
import readUserSession from '@/lib//actions';
import createServerClient from '@/utils/supabaseServer';
import AuthorizedAccessLayout from '@/app/[locale]/components/AuthorizedAccessLayout';
import IsNotYourRoleLayout from '@/app/[locale]/components/IsNotYourRoleLayout';

type LayoutProps = {
    children: React.ReactNode;
};

export default async function layout({ children }: LayoutProps) {
    const { isAuthorized, isRoleConsumptionPoint } =
        await checkAuthorizatedUser();

    return (
        <>
            {isAuthorized && isRoleConsumptionPoint ? (
                children
            ) : (
                <>
                    {!isAuthorized && isRoleConsumptionPoint && (
                        <AuthorizedAccessLayout
                            role={ROLE_ENUM.Consumption_point}
                        />
                    )}

                    {!isRoleConsumptionPoint && (
                        <IsNotYourRoleLayout
                            role={ROLE_ENUM.Consumption_point}
                        />
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

    const isRoleConsumptionPoint = await checkAuthorizatedUserByRole(session);
    const isAuthorized = await checkAuthorizedConsumptionPointByAdmin(
        session.id,
    );
    return { isRoleConsumptionPoint, isAuthorized };
}

async function checkAuthorizatedUserByRole(user: User) {
    const roles: string[] = user.user_metadata.access_level;
    return roles.includes(ROLE_ENUM.Consumption_point);
}

// We are checking if the consumption point has been authorized by the admin
async function checkAuthorizedConsumptionPointByAdmin(userId: string) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
        .from('consumption_point_user')
        .select(
            `
                *
            `,
        )
        .eq('user_id', userId)
        .is('is_authorized', true);

    if (error) {
        throw error;
    }
    return data.length > 0;
}
