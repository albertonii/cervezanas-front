"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { IDistributorUser } from "../../../../../../lib/types";
import { Button } from "../../../../components/common/Button";
import { DisplayInputError } from "../../../../components/common/DisplayInputError";
import { Spinner } from "../../../../components/common/Spinner";
import { useAuth } from "../../../../Auth/useAuth";

interface FormData {
  name: string;
  lastname: string;
  username: string;
  email: string;
}

interface Props {
  profile: IDistributorUser;
}

export function BasicDataForm({ profile }: Props) {
  const t = useTranslations();
  const { supabase } = useAuth();

  if (!profile || !profile.users) return <></>;

  const { id, username, name, lastname, email } = profile.users;

  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      username: username,
      name: name,
      lastname: lastname,
      email: email,
    },
  });

  const onSubmit = async (formValues: FormData) => {
    setLoading(true);

    const { name, lastname, username, email } = formValues;

    setTimeout(async () => {
      const { error } = await supabase
        .from("users")
        .update({
          name,
          lastname,
          username,
          email,
        })
        .eq("id", id);

      setLoading(false);

      if (error) throw error;
    }, 700);
  };

  return (
    <div
      id="account_basic_data"
      className="container mb-4 space-y-3 bg-white px-6 py-4"
    >
      <div id="account-data" className="text-2xl">
        {t("profile_title_acc_data")}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-2">
        <div className="flex w-full flex-row space-x-3 ">
          <div className="w-full ">
            <label htmlFor="username" className="text-sm text-gray-600">
              {t("profile_acc_username")}
            </label>

            <input
              type="text"
              id="username"
              placeholder="user123"
              readOnly
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 hover:cursor-not-allowed hover:bg-beer-softFoam focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              {...register("username")}
            />
          </div>
        </div>

        <div className="flex w-full flex-row space-x-3 ">
          <div className="space-y w-full">
            <label htmlFor="username" className="text-sm text-gray-600">
              {t("profile_acc_name")}
            </label>

            <input
              type="text"
              id="name"
              placeholder="Alberto"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              {...register("name", {
                required: true,
                maxLength: 30,
              })}
            />

            {errors.name?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
            {errors.name?.type === "maxLength" && (
              <DisplayInputError message="errors.error_30_max_length" />
            )}
          </div>

          <div className="w-full ">
            <label htmlFor="lastname" className="text-sm text-gray-600">
              {t("lastname")}
            </label>

            <input
              type="text"
              id="lastname"
              placeholder="Niironen"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              {...register("lastname", {
                required: true,
                maxLength: 50,
              })}
            />

            {errors.lastname?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
            {errors.lastname?.type === "maxLength" && (
              <DisplayInputError message="errors.error_50_max_length" />
            )}
          </div>
        </div>

        <div className="flex flex-row items-end">
          <div className="w-full">
            <label htmlFor="email" className="text-sm text-gray-600">
              {t("profile_acc_email")}
            </label>
            <input
              placeholder="ejemplo@gmail.com"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              {...register("email", {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
              })}
            />

            {errors.email?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}

            {errors.email?.type === "pattern" && (
              <DisplayInputError message="errors.input_email_invalid" />
            )}
          </div>
        </div>

        {loading && (
          <Spinner color="beer-blonde" size={"xLarge"} absolute center />
        )}

        <Button primary medium btnType={"submit"} disabled={loading}>
          {t("save")}
        </Button>
      </form>
    </div>
  );
}
