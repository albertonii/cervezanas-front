"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "../../../components/Auth";
import { SignUpForm } from "../../../components/Auth/SignUpForm";
import { VIEWS } from "../../../constants";
import { Spinner } from "../../../components/common";

export default function Signup() {
  const t = useTranslations();
  const locale = useLocale();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // If the user is already logged in, then
  // redirect them to home.
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  if (isLoading) {
    return <Spinner color="beer-gold" size="fullScreen" />;
  }

  return (
    <main className="flex h-full min-h-screen bg-white">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-start text-3xl font-bold tracking-tight text-gray-900">
              {t("create_account")}
            </h2>
          </div>

          <SignUpForm />

          <p className="my-2 flex w-full justify-center text-sm text-gray-700">
            {t("already_account")}
            <Link
              className="cursor-pointer font-bold"
              href={VIEWS.SIGN_IN}
              locale={locale}
            >
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
  );
}
