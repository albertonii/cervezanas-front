import Head from "next/head";
import SignIn from "./SignIn";

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>Cervezanas · Acceso 🍺</title>
        <meta name="signin" content="Access login Cervezanas" />
      </Head>

      <SignIn />
    </>
  );
}
