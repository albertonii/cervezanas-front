import { redirect } from "next/navigation";
import readUserSession from "../../../actions";
import SignIn from "./SignIn";

export default async function SignInPage() {
  const {
    data: { session },
  } = await readUserSession();

  if (session) {
    redirect("/es");
  }

  return (
    <>
      <SignIn />
    </>
  );
}
