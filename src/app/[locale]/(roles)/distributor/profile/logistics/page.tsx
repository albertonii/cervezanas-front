import readUserSession from "../../../../../../lib/actions";
import CoverageLayout from "./CoverageLayout";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";

export default async function OrdersPage() {
  await checkSession();

  return (
    <>
      <CoverageLayout />
    </>
  );
}

async function checkSession() {
  const {
    data: { session },
  } = await readUserSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }
}
