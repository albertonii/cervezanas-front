import Head from "next/head";
import { type UserProps } from "../lib/types";
import { NextPage } from "next";
import "../lib/i18n/i18n";
import { useEffect } from "react";
import { useAuth } from "../components/Auth/useAuth";
import { User } from "@supabase/supabase-js";

const Submit: NextPage<UserProps> = () => {
  const { supabaseClient, loggedIn, user } = useAuth();

  useEffect(() => {
    // Now you can query with RLS enabled.
    const getUsers = async () => {
      const { data, error } = await supabaseClient!.from("users").select("*");
      console.log(data);
    };

    getUsers();
  }, [supabaseClient]);

  return (
    <>
      <Head>
        <title>Cervezanas</title>
      </Head>

      <main className="flex justify-center py-10 px-4 pt-10 sm:px-12">
        <div className="w-full bg-white p-4 shadow-lg sm:w-4/5 md:w-2/3 lg:w-1/2">
          {loggedIn ? User(user) : Guest()}
        </div>
      </main>
    </>
  );
};

export default Submit;

// Authorize User
function User(prop: User | null) {
  return (
    <>
      <h1 className="text-2xl font-bold text-center">Welcome {prop?.email}</h1>
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
