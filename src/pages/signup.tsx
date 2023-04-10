import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { SignUpForm } from "../components/Auth/SignUpForm";
import { useEffect } from "react";
import Router from "next/router";
import { useAuth } from "../components/Auth/useAuth";
import { useTranslation } from "react-i18next";

export default function SignUp() {
  const { user } = useAuth();

  const { t } = useTranslation();

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
        <title>Cervezanas · {t("register")} 🍺</title>
        <meta name="signup" content="Signup user Cervezanas" />
      </Head>

      <main className="flex h-full min-h-screen bg-white">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-6 text-start text-3xl font-bold tracking-tight text-gray-900">
                {t("create_account")}
              </h2>
            </div>

            <SignUpForm />

            <p className="my-2 flex w-full justify-center text-sm text-gray-700">
              {t("already_account")}
              <Link className="cursor-pointer font-bold" href={"/signin"}>
                <span className="mx-1 text-beer-blonde hover:underline">
                  {t("access_account")}
                </span>
              </Link>
            </p>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <Image
            width={1000}
            height={1000}
            className="absolute inset-0 h-full w-full object-cover"
            src="/barriles.jpg"
            alt=""
          />
        </div>
      </main>
    </>
  );
}
