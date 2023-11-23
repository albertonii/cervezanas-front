import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../constants";
import readUserSession from "../../../../actions";

export default async function ServerProfilePage() {
  const {
    data: { session },
  } = await readUserSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  return (
    <div>
      <h1>Accede con tu usuario para poder ver esta sección</h1>
    </div>
  );
}
