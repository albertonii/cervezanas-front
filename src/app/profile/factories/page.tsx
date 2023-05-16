import { ROUTE_SIGNIN } from "../../../config";
import { createServerClient } from "../../../utils/supabaseServer";

export default async function FactoriesPage() {
  //   const {} = await getFactoriesData();

  return <></>;
}

async function getFactoriesData() {
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: ROUTE_SIGNIN,
        permanent: false,
      },
    };

  return {};
}
