"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../components/Auth";
import { useMessage } from "../../components/message";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Spinner } from "../../components/common";

interface FormData {
  username: string;
  email: string;
  password: string;
}

export default function SignIn() {
  const router = useRouter();

  const { signInWithProvider, signIn, loading, user } = useAuth();

  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({});
  const { handleMessage } = useMessage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCredentialsSignIn = async () => {
    signIn(email, password);
  };

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const handleCredentialsSignIn = async () => {
        signIn(email, password);
      };

      if (event.key === "Enter") handleCredentialsSignIn();
    },
    [email, handleMessage, password, signIn]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    // remove the event listener
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const handleGoogleSignIn = async () => {
    signInWithProvider("google");
  };

  if (loading) {
    return <Spinner color="beer-blonde" size={"medium"} />;
  }

  if (user) {
    router.push("/");
  }

  return (
    <>
      <main className="flex h-full min-h-screen bg-white">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-6 text-start text-3xl font-bold tracking-tight text-gray-900">
                {t("sign_in")}
              </h2>
            </div>

            <form
              className="mt-4 space-y-4"
              onSubmit={handleSubmit(handleCredentialsSignIn)}
            >
              <fieldset className="space-y-4">
                {/* email  */}
                <div className="flex w-full flex-col space-y-3">
                  <label
                    htmlFor="email-address"
                    className="text-sm text-gray-600"
                  >
                    {t("email")}
                    <input
                      {...register("email", {
                        required: true,
                        pattern: /^\S+@\S+$/i,
                      })}
                      type="email"
                      id="email-address"
                      placeholder="ejemplo@gmail.com"
                      className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    {errors.email?.type === "required" && (
                      <p>{t("errors.input_required")}</p>
                    )}
                  </label>
                </div>

                {/* password  */}
                <div className="flex w-full flex-col space-y-2 ">
                  <label htmlFor="password" className="text-sm text-gray-600">
                    {t("password")}
                    <input
                      {...register("password", {
                        required: true,
                        minLength: 6,
                      })}
                      type="password"
                      id="password"
                      className="relative flex w-full appearance-none justify-center rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                      placeholder="*****"
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    {errors.password?.type === "required" && (
                      <p>{t("errors.input_required")}</p>
                    )}
                  </label>
                </div>

                {/* submit  */}
                <Button
                  btnType="submit"
                  title={""}
                  class={
                    "group relative my-4 flex w-full justify-center rounded-md border border-none border-transparent bg-beer-blonde px-4 py-2 text-sm font-medium hover:bg-beer-draft hover:font-semibold hover:text-beer-blonde focus:outline-none focus:ring-2 focus:ring-beer-softBlonde focus:ring-offset-2 "
                  }
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FontAwesomeIcon
                      icon={faLock}
                      style={{ color: "bear-dark" }}
                      // onClick={() => setOpen(true)}
                      // onMouseEnter={() => setHoverColor("filled")}
                      // onMouseLeave={() => setHoverColor("unfilled")}
                      title={"Lock"}
                      className="text-base text-beer-softBlonde group-hover:text-beer-blonde"
                    />
                  </span>
                  {t("access")}
                </Button>
              </fieldset>
            </form>

            <p className="my-2 flex w-full justify-start text-sm text-gray-700">
              {t("not_registered_question")}
              <Link className="cursor-pointer font-bold" href={"/signup"}>
                <span className="mx-1 text-beer-blonde hover:underline">
                  {t("sign_me_up")}
                </span>
              </Link>
            </p>

            <br />

            <Button
              accent
              class="mb-2 mr-2 flex w-full flex-row items-center rounded-lg border border-gray-300 bg-white 
              px-3 py-0 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 
              dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              onClick={() => handleGoogleSignIn()}
            >
              <div className="flex items-center ">
                <span className="mx-2 my-4 flex h-6 w-6 items-center justify-center">
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
                </span>

                <span className="ml-2 text-lg">
                  {t("continue_with_google")}
                </span>
              </div>
            </Button>
          </div>
        </div>

        <div className="relative hidden w-0 flex-1 lg:block ">
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src="/barriles.jpg"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>
      </main>
    </>
  );
}
