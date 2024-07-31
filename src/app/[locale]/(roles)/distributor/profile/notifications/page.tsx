import readUserSession from '@/lib//actions';
import createServerClient from '@/utils/supabaseServer';
import Notifications from '../../../../(common-display)/notifications/Notifications';
import React from 'react';
import { redirect } from 'next/navigation';
import { INotification } from '@/lib//types/types';

export default async function NotificationsPage() {
    const notificationsData = await getNotificationsData();
    const [notifications] = await Promise.all([notificationsData]);
    return <Notifications notifications={notifications} />;
}

async function getNotificationsData() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    // Select only the orders where business orders have the distributor_id associated to session user id
    const { data, error } = await supabase
        .from('notifications')
        .select(
            `
        *,
        source_user:users!notifications_source_fkey (
          id,
          username,
          role
        )
      `,
        )
        .eq('user_id', [session.id])
        .order('created_at', { ascending: false });
    if (error) throw error;

    return data as INotification[];
}
