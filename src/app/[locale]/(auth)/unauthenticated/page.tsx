import { redirect } from "next/navigation";
import readUserSession from "../../../actions";

export default async function Unauthenticated() {
  const {
    data: { session },
  } = await readUserSession();

  if (session) {
    redirect("/");
  }

  return (
    <div>
      <h1>Accede con tu usuario para poder ver esta sección</h1>
    </div>
  );
}
