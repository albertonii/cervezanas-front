import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { type NextPage } from "next";
import { useState } from "react";
import { type UserProps } from "../lib/types";
import { FaLock } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { useAuth } from "../components/Auth/useAuth";
import { UserCredentials } from "@supabase/supabase-js";
import Router from "next/router";

interface FormData {
  email: string;
  password: string;
}

const SignIn: NextPage<UserProps> = () => {
  const { signInWithProvider, signIn, signOut, loading, loggedIn, user } =
    useAuth();

  const { register, handleSubmit } = useForm<FormData>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCredentialsSignIn = async () => {
    const userCredentials: UserCredentials = {
      email,
      password,
    };
    signIn(userCredentials);
    Router.push("/");
  };

  const handleGoogleSignIn = async () => {
    signInWithProvider("google");
    Router.push("/");
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (loggedIn) {
    return (
      <>
        Signed in as {user?.email} <br />
        <button type="button" onClick={() => signOut()}>
          Sign out
        </button>
      </>
    );
  }

  return (
    <>
      <Layout useBackdrop={true} usePadding={false}>
        <Head>
          <title>Cervezanas · Acceso 🍺</title>
          <meta name="signin" content="Access login Cervezanas" />
        </Head>

        <main className="flex h-full min-h-screen bg-white">
          <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div>
                <h2 className="mt-6 text-start text-3xl font-bold tracking-tight text-gray-900">
                  Acceder
                </h2>
              </div>

              <form
                className="mt-4 space-y-4"
                onSubmit={handleSubmit(handleCredentialsSignIn)}
              >
                <div className="flex w-full flex-col space-y-3">
                  <label
                    htmlFor="email-address"
                    className="text-sm text-gray-600"
                  >
                    Correo electrónico
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    id="email-address"
                    placeholder="ejemplo@gmail.com"
                    required
                    className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex w-full flex-col space-y-2 ">
                  <label htmlFor="password" className="text-sm text-gray-600">
                    contraseña
                  </label>
                  <input
                    {...register("password")}
                    type="password"
                    id="password"
                    required
                    className="relative flex w-full appearance-none justify-center rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="*****"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="group relative my-4 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaLock className="text-base text-indigo-500 group-hover:text-indigo-400" />
                  </span>
                  Acceder
                </button>
              </form>

              <p className="my-2 flex w-full justify-center text-sm text-gray-700">
                ¿No estás registrado?
                <Link className="cursor-pointer font-bold" href={"/signup"}>
                  <span className="mx-1 text-blue-600 hover:underline">
                    Dame de alta
                  </span>
                </Link>
              </p>

              <br />
              <br />
              {/* <SignInGoogle /> */}
              <button
                className="flex flex-row items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 
              focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-0 mr-2 mb-2 dark:bg-gray-800 dark:text-white 
              dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 my-2"
                onClick={() => handleGoogleSignIn()}
              >
                <svg
                  className="w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 32 32"
                  width="64"
                  height="64"
                >
                  <defs>
                    <path
                      id="A"
                      d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                    />
                  </defs>
                  <clipPath id="B">
                    <use xlinkHref="#A" />
                  </clipPath>
                  <g transform="matrix(.727273 0 0 .727273 -.954545 -1.45455)">
                    <path
                      d="M0 37V11l17 13z"
                      clipPath="url(#B)"
                      fill="#fbbc05"
                    />
                    <path
                      d="M0 11l17 13 7-6.1L48 14V0H0z"
                      clipPath="url(#B)"
                      fill="#ea4335"
                    />
                    <path
                      d="M0 37l30-23 7.9 1L48 0v48H0z"
                      clipPath="url(#B)"
                      fill="#34a853"
                    />
                    <path
                      d="M48 48L17 24l-4-3 35-10z"
                      clipPath="url(#B)"
                      fill="#4285f4"
                    />
                  </g>
                </svg>
                <span className="ml-2 text-lg">Continuar con Google</span>
              </button>
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
      </Layout>
    </>
  );
};

export default SignIn;
