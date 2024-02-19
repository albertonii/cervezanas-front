import { redirect } from 'next/navigation';
import React from 'react';
import { VIEWS } from '../../../../constants';
import readUserSession from '../../../../lib/actions';
import { ROLE_ENUM } from '../../../../lib/enums';
import { IUser } from '../../../../lib/types';

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

  const isRoleConsumer = await checkAuthorizatedUserByRole(user);
  return isRoleConsumer;
}

async function checkAuthorizatedUserByRole(user: IUser) {
  const role = user.user_metadata.access_level;
  const isFromProvider = user.app_metadata.provider === 'google';
  return role === ROLE_ENUM.Cervezano || isFromProvider;
}
