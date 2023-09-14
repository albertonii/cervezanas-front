"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "../../Auth/useAuth";
import { SignUpForm } from "../../Auth/SignUpForm";
import { VIEWS } from "../../../../constants";
import { Spinner } from "../../components/common";

export default function Signup() {
  const t = useTranslations();
  const locale = useLocale();
  const [isPageLoad, setIsPageLoad] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsPageLoad(true);
  }, []);

  // If the user is already logged in, then
  // redirect them to home.
  useEffect(() => {
    if (user) {
      router.push(`/${locale}`);
    }
  }, [user]);

  if (!isPageLoad) {
    return <Spinner color="beer-blonde" size={"fullScreen"} absolute />;
  }

  return (
    <div className="w-full lg:grid lg:grid-cols-2">
      {/* Signup form  */}
      <div className="mx-auto flex w-[60vw] flex-1 flex-col justify-start px-4 py-12 sm:px-6 lg:w-full lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-start text-3xl font-bold tracking-tight text-gray-900">
              {t("create_account")}
            </h2>
          </div>

          <SignUpForm />

          <p className="my-2 flex w-full justify-start text-sm text-gray-700">
            {t("already_account")}
            <Link
              className="cursor-pointer font-bold"
              href={VIEWS.SIGN_IN}
              locale={locale}
            >
              <span className="mx-1 text-beer-darkGold hover:underline">
                {t("access_account")}
              </span>
            </Link>
          </p>
        </div>
      </div>

      {/* Hero Image */}
      <div className="hidden w-full justify-center lg:flex">
        <Image
          className="inset-0 rounded-3xl lg:w-[30vw]"
          alt="Cervezanas artesanales"
          sizes="(max-width: 1024px) 100vw, 1024px"
          width={1024}
          height={768}
          src="/assets/profile_signup.jpg"
        />
      </div>
    </div>
  );
}
