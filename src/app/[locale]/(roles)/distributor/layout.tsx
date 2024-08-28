import createServerClient from '@/utils/supabaseServer';
import readUserSession from '@/lib//actions';
import { User } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { ROLE_ENUM } from '@/lib//enums';
import AuthorizedAccessLayout from '@/app/[locale]/components/AuthorizedAccessLayout';
import IsNotYourRoleLayout from '@/app/[locale]/components/IsNotYourRoleLayout';

type LayoutProps = {
    children: React.ReactNode;
};

export default async function layout({ children }: LayoutProps) {
    const { isAuthorized, isRoleDistributor } = await checkAuthorizatedUser();

    return (
        <>
            {isAuthorized && isRoleDistributor ? (
                children
            ) : (
                <>
                    {!isAuthorized && isRoleDistributor && (
                        <AuthorizedAccessLayout role={ROLE_ENUM.Distributor} />
                    )}

                    {!isRoleDistributor && (
                        <IsNotYourRoleLayout role={ROLE_ENUM.Distributor} />
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

    const isRoleDistributor = await checkAuthorizatedUserByRole(session);
    const isAuthorized = await checkAuthorizedDistributorByAdmin(session.id);

    return { isRoleDistributor, isAuthorized };
}

async function checkAuthorizatedUserByRole(user: User) {
    const roles: string[] = user.user_metadata.access_level;
    return roles.includes(ROLE_ENUM.Distributor);
}

// We are checking if the distributor has been authorized by the admin
async function checkAuthorizedDistributorByAdmin(userId: string) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
        .from('distributor_user')
        .select('*')
        .eq('user_id', userId)
        .is('is_authorized', true);

    if (error) {
        throw error;
    }

    return data.length > 0;
}
