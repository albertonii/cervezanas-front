import readUserSession from '@/lib//actions';
import { ROLE_ENUM } from '@/lib//enums';
import { redirect } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import {
    faUser,
    faBox,
    faBell,
    faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';
import ProfileSidebarLayout from '@/app/[locale]/components/ui/ProfileSidebarLayout';

type LayoutProps = {
    children: React.ReactNode;
};

const sidebarLinks = [
    {
        name: 'monthly_products',
        icon: faBox,
        option: 'monthly_products',
    },
    {
        name: 'authorized_users',
        icon: faUser,
        option: 'authorized_users',
    },
    {
        name: 'invoice_module.title',
        icon: faMoneyBill,
        option: 'invoice_module',
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
        name: 'contracts_cps',
        icon: faUser,
        option: 'contracts_cps',
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
];

export default async function layout({ children }: LayoutProps) {
    const hasAuthorization = await checkAuthorizatedUser();

    return (
        <>
            {hasAuthorization ? (
                <ProfileSidebarLayout sidebarLinks={sidebarLinks}>
                    <div>{children}</div>
                </ProfileSidebarLayout>
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
