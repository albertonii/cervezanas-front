import { redirect } from "next/navigation";
import React from "react";
import { VIEWS } from "../../../../constants";
import readUserSession from "../../../../lib/actions";
import { ROLE_ENUM } from "../../../../lib/enums";
import { IUser } from "../../../../lib/types";
import createServerClient from "../../../../utils/supabaseServer";

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

  const isRoleDistributor = await checkAuthorizatedUserByRole(user);
  const isAuthorized = await checkAuthorizedDistributorByAdmin(user.id);
  return isRoleDistributor && isAuthorized;
}

async function checkAuthorizatedUserByRole(user: IUser) {
  const role = user.user_metadata.access_level;
  return role === ROLE_ENUM.Distributor;
}

async function checkAuthorizedDistributorByAdmin(userId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("distributor_user")
    .select("*")
    .eq("user", userId)
    .is("is_authorized", true);

  if (error) {
    throw error;
  }
  return data.length > 0;
}
