"use client";

import Link from "next/link";
import React from "react";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DisplayInputError } from "../../components/common/DisplayInputError";
import { useLocale, useTranslations } from "next-intl";
import { VIEWS } from "../../../../constants";
import { useAuth } from "../../Auth/useAuth";

type FormData = {
  email: string;
};

const schema: ZodType<FormData> = z.object({
  email: z
    .string()
    .email({
      message: "Must be a valid email",
    })
    .min(5, { message: "Required" }),
});

type ValidationSchema = z.infer<typeof schema>;

/**
 * Reset password page will send a reset password email to the user
 * @returns
 */
export default function ResetPassword() {
  const t = useTranslations();
  const locale = useLocale();
  const { supabase } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function resetPassword(formData: ValidationSchema) {
    const { error } = await supabase.auth.resetPasswordForEmail(
      formData?.email,
      {
        redirectTo: `${window.location.origin}/auth/update-password`,
      }
    );

    if (error) {
      console.error(error);
    }
  }

  return (
    <section className="flex w-auto flex-col items-center justify-center gap-8 space-y-4 px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
      <h1 className="text-3xl font-extrabold text-gray-900">
        Reset your password
      </h1>

      <form
        onSubmit={handleSubmit(resetPassword)}
        className="mt-8 w-full space-y-6"
        action="#"
        method="POST"
      >
        <input type="hidden" name="remember" defaultValue="true" />
        <div className="-space-y-px rounded-md shadow-sm">
          {/* email  */}
          <div className="flex w-full flex-col space-y-3">
            <label htmlFor="email" className="text-sm text-gray-600">
              Email address
              <input
                {...register("email")}
                id="email"
                type="email"
                placeholder="cervezanas@mail.com"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              />
              {errors.email && (
                <DisplayInputError message={errors.email.message} />
              )}
            </label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-beer-softBlonde px-4 py-2 text-sm font-medium text-white hover:bg-beer-draft focus:outline-none focus:ring-2 focus:ring-beer-softBlonde focus:ring-offset-2"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              {/* Heroicon name: lock-closed */}
              <svg
                className="h-5 w-5 text-beer-draft group-hover:text-beer-softBlonde"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M4 8V6a6 6 0 1112 0v2h1a1 1 0 011 1v7a4 4 0 01-4 4H7a4 4 0 01-4-4V9a1 1 0 011-1h1zm2 0h6V6a4 4 0 10-6 0v2z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            Reset Password
          </button>
        </div>
      </form>

      <p className="my-2 flex w-full justify-start text-sm text-gray-700">
        {t("remember_password")}
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
    </section>
  );
}
