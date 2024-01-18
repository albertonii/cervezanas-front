import { redirect } from "next/navigation";
import React from "react";
import { VIEWS } from "../../../../constants";
import readUserSession from "../../../../lib/actions";
import { ROLE_ENUM } from "../../../../lib/enums";
import { IUser } from "../../../../lib/types";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function layout({ children }: LayoutProps) {
  const hasAuthorization = await checkAuthorizatedUserByRole();

  return (
    <>
      {hasAuthorization ? (
        children
      ) : (
        <div>
          <h2>No tienes los permisos necesarios para acceder a esta página</h2>
        </div>
      )}
    </>
  );
}

async function checkAuthorizatedUserByRole() {
  const {
    data: { session },
  } = await readUserSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const user = session.user as IUser;
  const role = user.user_metadata.access_level;

  return role === ROLE_ENUM.Productor;
}
