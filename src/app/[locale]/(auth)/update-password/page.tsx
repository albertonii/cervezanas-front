import UpdatePassword from "./UpdatePassword";
import readUserSession from "../../../actions";
import { redirect } from "next/navigation";

export default async function UpdatePasswordPage() {
  const {
    data: { session },
  } = await readUserSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <>
      <UpdatePassword />
    </>
  );
}
