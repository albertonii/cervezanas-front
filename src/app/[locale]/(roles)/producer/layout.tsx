import { redirect } from 'next/navigation';
import React from 'react';
import { VIEWS } from '../../../../constants';
import readUserSession from '../../../../lib/actions';
import { ROLE_ENUM } from '../../../../lib/enums';
import { IUser } from '../../../../lib/types';
import createServerClient from '../../../../utils/supabaseServer';

type LayoutProps = {
  children: React.ReactNode;
};

export default async function layout({ children }: LayoutProps) {
  const hasAuthorization = await checkAuthorizatedUser();

  return (
    <>
      {hasAuthorization ? (
        children
      ) : (
        <section>
          <h2>No tienes los permisos necesarios para acceder a esta página</h2>
        </section>
      )}
    </>
  );
}

async function checkAuthorizatedUser() {
  const {
    data: { session },
  } = await readUserSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const user = session.user as IUser;

  const isRoleProducer = await checkAuthorizatedUserByRole(user);
  const isAuthorized = await checkAuthorizedProducerByAdmin(user.id);
  return isRoleProducer && isAuthorized;
}

async function checkAuthorizatedUserByRole(user: IUser) {
  const role = user.user_metadata.access_level;
  return role === ROLE_ENUM.Productor;
}

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
