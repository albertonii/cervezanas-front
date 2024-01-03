"use client";

import Image from "next/image";
import React from "react";
import { z, ZodType } from "zod";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DisplayInputError } from "../../components/common/DisplayInputError";
import { useTranslations } from "next-intl";
import { useAuth } from "../../Auth/useAuth";
import { Button } from "../../components/common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type FormData = {
  password: string;
  confirm_password: string;
};

const schema: ZodType<FormData> = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be atleast 8 characters" }),
    confirm_password: z
      .string()
      .min(8, { message: "Password must be atleast 8 characters" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Password don't match",
  });

type ValidationSchema = z.infer<typeof schema>;

/**
 * Reset password page will send a reset password email to the user
 * @returns
 */
export default function ResetPassword() {
  const t = useTranslations();

  const { updatePassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function updPassword(formData: ValidationSchema) {
    updatePassword(formData.password);
  }

  return (
    <section className="w-full lg:grid lg:grid-cols-2">
      <article className="mx-auto flex w-[60vw] flex-1 flex-col justify-start px-4 py-12 sm:px-6 lg:w-full lg:flex-none lg:px-20 xl:px-24">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {t("update_password")}
        </h1>

        <form
          onSubmit={handleSubmit(updPassword)}
          className="mt-8 w-full space-y-6"
          action="#"
          method="POST"
        >
          <div className="flex w-full flex-col -space-y-px rounded-md shadow-sm">
            <div className="flex w-full flex-col space-y-2 ">
              <label htmlFor="password" className="text-sm text-gray-600">
                {t("password")}
              </label>
              <input
                {...register("password")}
                type="password"
                id="password"
                autoComplete="new-password"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                placeholder="*****"
              />

              {errors.password && (
                <DisplayInputError message={errors.password.message} />
              )}
            </div>

            <div className="flex w-full flex-col space-y-2 ">
              <label
                htmlFor="confirm_password"
                className="text-sm text-gray-600"
              >
                {t("confirm_password")}
              </label>
              <input
                {...register("confirm_password")}
                type="password"
                id="confirm_password"
                autoComplete="confirm_password"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                placeholder="*****"
              />

              {errors.confirm_password && (
                <DisplayInputError message={errors.confirm_password.message} />
              )}
            </div>
          </div>

          <Button
            title={"reset_password"}
            btnType="submit"
            class={
              "group relative my-4 flex w-full justify-center rounded-md border border-none border-transparent bg-beer-blonde px-4 py-2 text-sm font-medium hover:bg-beer-draft hover:font-semibold hover:text-beer-blonde focus:outline-none focus:ring-2 focus:ring-beer-softBlonde focus:ring-offset-2 "
            }
            fullSize
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FontAwesomeIcon
                icon={faLock}
                style={{ color: "bear-dark" }}
                title={"Lock"}
                className="text-base text-beer-softBlonde group-hover:text-beer-blonde"
              />
            </span>
            {t("confirm_password")}
          </Button>
        </form>
      </article>

      {/* Hero Image */}
      <div className="hidden w-full justify-center lg:flex">
        <Image
          className="inset-0 rounded-3xl lg:w-[30vw]"
          alt="Cervezanas artesanales"
          sizes="(max-width: 1024px) 100vw, 1024px"
          width={1024}
          height={768}
          src={"/assets/profile_signup.jpg"}
          loader={() => "/assets/profile_signup.jpg"}
        />
      </div>
    </section>
  );
}
