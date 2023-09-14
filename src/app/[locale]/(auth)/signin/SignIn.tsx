"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, DisplayInputError, Spinner } from "../../components/common";
import { useAuth } from "../../Auth/useAuth";
import { useMutation } from "react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";
import { useMessage } from "../../components/message/useMessage";

type FormData = {
  email: string;
  password: string;
};

const schema: ZodType<FormData> = z.object({
  email: z
    .string()
    .email({
      message: "Must be a valid email",
    })
    .min(5, { message: "Required" }),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters" }),
});

type ValidationSchema = z.infer<typeof schema>;

export default function SignIn() {
  const router = useRouter();
  const { signInWithProvider, signIn, user } = useAuth();

  const t = useTranslations();
  const signInMessage = t("sign_in_success");

  const locale = useLocale();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { handleMessage } = useMessage();

  const [isPageLoad, setIsPageLoad] = useState(false);

  useEffect(() => {
    setIsPageLoad(true);
  }, []);

  useEffect(() => {
    if (user) router.push(`/${locale}`);
  }, [user]);

  const handleCredentialsSignIn = async (form: ValidationSchema) => {
    const { email, password } = form;
    signIn(email, password);
  };

  const handleCredentialsMutation = useMutation({
    mutationKey: "credentialsSignIn",
    mutationFn: handleCredentialsSignIn,
    onMutate: () => {},
    onSuccess: () => {
      handleMessage({
        type: "success",
        message: signInMessage,
      });
    },
    onError: (error: Error) => {
      handleMessage({
        type: "error",
        message: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (formValues: FormData) => {
    try {
      handleCredentialsMutation.mutate(formValues);
    } catch (e) {
      console.error(e);
    }
  };

  // const handleKeyPress = useCallback(
  //   (event: KeyboardEvent) => {
  //     const handleCredentialsSignIn = async (
  //       email: string,
  //       password: string
  //     ) => {
  //       signIn(email, password);
  //     };

  //     if (event.key === "Enter") handleCredentialsSignIn();
  //   },
  //   [email, handleMessage, password, signIn]
  // );

  // useEffect(() => {
  //   document.addEventListener("keydown", handleKeyPress);
  //   // remove the event listener
  //   return () => {
  //     document.removeEventListener("keydown", handleKeyPress);
  //   };
  // }, [handleKeyPress]);

  const handleGoogleSignIn = async () => {
    signInWithProvider("google");
  };

  if (!isPageLoad) {
    return <Spinner color="beer-blonde" size={"fullScreen"} absolute />;
  }

  return (
    <section className="w-[60vw] gap-8 space-y-4 px-4 py-12 sm:px-6 lg:grid lg:grid-cols-2 lg:px-20 xl:px-24">
      <div>
        {/* Login form */}
        <div className="justify-startlg:w-full mx-auto flex flex-1 flex-col lg:flex-none ">
          <div>
            <h2 className="mt-6 text-start text-3xl font-bold tracking-tight text-gray-900">
              {t("sign_in")}
            </h2>
          </div>

          <form
            className="mt-4 space-y-4"
            onSubmit={handleSubmit(onSubmit)}
            id="login-form"
          >
            <fieldset className="space-y-4">
              {/* email  */}
              <div className="flex w-full flex-col space-y-3">
                <label htmlFor="email" className="text-sm text-gray-600">
                  {t("email")}
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="user@cervezanas.com"
                    className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                  />

                  {errors.email && (
                    <DisplayInputError message={errors.email.message} />
                  )}
                </label>
              </div>

              {/* password  */}
              <div className="flex w-full flex-col space-y-2 ">
                <label htmlFor="password" className="text-sm text-gray-600">
                  {t("password")}
                  <input
                    {...register("password")}
                    id="password"
                    type="password"
                    className="relative flex w-full appearance-none justify-center rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                    placeholder="*****"
                  />

                  {errors.password && (
                    <DisplayInputError message={errors.password.message} />
                  )}
                </label>
              </div>

              {/* submit  */}
              <Button
                title={"sign_in"}
                class={
                  "group relative my-4 flex w-full justify-center rounded-md border border-none border-transparent bg-beer-blonde px-4 py-2 text-sm font-medium hover:bg-beer-draft hover:font-semibold hover:text-beer-blonde focus:outline-none focus:ring-2 focus:ring-beer-softBlonde focus:ring-offset-2 "
                }
                btnType="submit"
                form="login-form"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FontAwesomeIcon
                    icon={faLock}
                    style={{ color: "bear-dark" }}
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
            <Link
              className="cursor-pointer font-bold"
              href={"/signup"}
              locale={locale}
            >
              <span className="mx-1 text-beer-darkGold hover:underline">
                {t("sign_me_up")}
              </span>
            </Link>
          </p>
        </div>

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
                  <path d="M0 37V11l17 13z" clipPath="url(#B)" fill="#fbbc05" />
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

            <span className="ml-2 text-lg">{t("continue_with_google")}</span>
          </div>
        </Button>
      </div>

      {/* Hero Image */}
      <div className="hidden w-full justify-center lg:flex">
        <Image
          className="inset-0 rounded-3xl lg:w-[30vw]"
          src="/assets/profile_signin.jpg"
          alt="Cervezanas artesanales"
          sizes="(max-width: 1024px) 100vw, 1024px"
          width={1024}
          height={768}
        />
      </div>
    </section>
  );
}
