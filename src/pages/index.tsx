import Head from "next/head";
import { type UserProps } from "../lib/types";
import Router from "next/router";
import { NextPage } from "next";
import { useForm } from "react-hook-form";
import "../lib/i18n/i18n";
import { useSession } from "next-auth/react";
import { ISODateString } from "next-auth";

const Submit: NextPage<UserProps> = () => {
  const { data: session } = useSession();

  // reference: https://react-hook-form.com/get-started#Quickstart
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  return (
    <>
      <Head>
        <title>Cervezanas</title>
      </Head>

      <main className="flex justify-center py-10 px-4 pt-10 sm:px-12">
        <div className="w-full bg-white p-4 shadow-lg sm:w-4/5 md:w-2/3 lg:w-1/2">
          {session ? User(session) : Guest()}
        </div>
      </main>
    </>
  );
};

export default Submit;

interface Session {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: ISODateString;
}

// Authorize User
function User(session: Session) {
  return (
    <>
      <h1 className="text-2xl font-bold text-center">
        Welcome {session.user?.name}
      </h1>
      <p className="text-center">You are authorized to access this page</p>
    </>
  );
}

// Guest User
function Guest() {
  return (
    <>
      <h1 className="text-2xl font-bold text-center">You are not authorized</h1>
      <p className="text-center">Please login to access this page</p>
    </>
  );
}
