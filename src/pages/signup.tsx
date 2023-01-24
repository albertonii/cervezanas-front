import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { type NextPage } from "next";
import { SignUpForm } from "../components/SignUp/Form";
import { type UserProps } from "../lib/types";
import { useEffect } from "react";
import Router from "next/router";
import { SignUpGoogle } from "../components/SignUp/SignUpGoogle";
import { useAuth } from "../components/Auth/useAuth";

const SignUp: NextPage<UserProps> = () => {
  const { user } = useAuth();

  // If the user is already logged in, then
  // redirect them to home.
  useEffect(() => {
    if (user) {
      Router.push("/");
    }
  });

  return (
    <>
      <Head>
        <title>Cervezanas · Registro 🍺</title>
        <meta name="signup" content="Signup user Cervezanas" />
      </Head>
      <main className="flex h-full min-h-screen bg-white">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-6 text-start text-3xl font-bold tracking-tight text-gray-900">
                Create an account
              </h2>
            </div>

            {/* <SignUpGoogle /> */}

            <SignUpForm />

            <p className="my-2 flex w-full justify-center text-sm text-gray-700">
              ¿Ya tienes una cuenta?
              <Link className="cursor-pointer font-bold" href={"/signin"}>
                <span className="mx-1 text-blue-600 hover:underline">
                  Acceso de usuarios
                </span>
              </Link>
            </p>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src="/barriles.jpg"
            alt=""
            layout="fill"
          />
        </div>
      </main>
    </>
  );
};

export default SignUp;
