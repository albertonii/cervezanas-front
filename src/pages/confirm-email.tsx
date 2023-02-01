import Head from "next/head";
import { type NextPage } from "next";
import { faEnvelopeCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ConfirmEmail: NextPage = () => {
  return (
    <>
      <Head>
        <title>Confirm Email</title>
        <meta name="email" content="Confirm Email Cervezanas" />
      </Head>
      <main className="flex h-full min-h-screen items-center justify-center bg-gray-50">
        <div className="grid w-full max-w-xs grid-cols-1 justify-items-center gap-y-4 rounded-lg bg-white p-6 shadow-lg sm:max-w-md">
          <FontAwesomeIcon
            icon={faEnvelopeCircleCheck}
            style={{ color: "bear-dark" }}
            // onClick={() => setOpen(true)}
            // onMouseEnter={() => setHoverColor("filled")}
            // onMouseLeave={() => setHoverColor("unfilled")}
            title={"Envelope"}
            className="h-28 w-28 fill-beer-blonde text-base"
          />
          <p className="text-center text-gray-700">
            Thanks for signing up! We&#39;ve sent you an email to confirm your
            account.
          </p>
        </div>
      </main>
    </>
  );
};

export default ConfirmEmail;
