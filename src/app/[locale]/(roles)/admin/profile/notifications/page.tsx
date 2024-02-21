import { redirect } from 'next/navigation';
import React from 'react';
import { VIEWS } from '../../../../../../constants';
import readUserSession from '../../../../../../lib/actions';
import { INotification } from '../../../../../../lib/types';
import createServerClient from '../../../../../../utils/supabaseServer';
import Notifications from '../../../../(common-display)/notifications/Notifications';

export default async function NotificationsPage() {
  const notificationsData = await getNotificationsData();
  const [notifications] = await Promise.all([notificationsData]);
  return <Notifications notifications={notifications} />;
}

async function getNotificationsData() {
  const supabase = await createServerClient();

  const session = await readUserSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  // Select only the orders where business orders have the distributor_id associated to session user id
  const { data, error } = await supabase
    .from('notifications')
    .select(
      `
        *,
        source_user:users!notifications_user_id_fkey (
          username
        )
      `,
    )
    .eq('source', [session.id])
    .order('created_at', { ascending: false });
  if (error) throw error;

  return data as INotification[];
}
