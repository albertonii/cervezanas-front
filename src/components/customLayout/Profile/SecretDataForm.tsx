import { Button } from "@supabase/ui";
import { useForm } from "react-hook-form";
import React from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../../utils/supabaseClient";

interface FormProps {
  oldPassword: string;
  newPassword: string;
  newPassword2: string;
}

export function SecretDataForm() {
  const { t } = useTranslation();

  const {
    formState: { errors },
    watch,
    handleSubmit,
    register,
    reset,
  } = useForm<FormProps>({
    mode: "onSubmit",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      newPassword2: "",
    },
  });

  const onSubmit = async (formValues: FormProps) => {
    try {
      const { oldPassword, newPassword, newPassword2 } = formValues;

      // TODO: Check old password before updating

      if (newPassword == newPassword2) {
        const { data, error } = await supabase.auth.update({
          password: newPassword,
        });

        if (error) throw error;

        reset();
      } else {
      }
    } catch (error) {
    } finally {
    }
  };

  return (
    <div
      id="account_secret_data"
      className="container px-6 py-4  bg-white space-y-3 mb-4"
    >
      <div id="password" className="text-2xl">
        {t("password")}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-full flex-row space-x-3 ">
          <div className="w-full ">
            <label htmlFor="actual_password" className="text-sm text-gray-600">
              {t("actual_password")}
            </label>
            <input
              {...register("oldPassword")}
              type="password"
              id="old_password"
              placeholder="**********"
              required
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
            />
          </div>
        </div>

        <div className="flex w-full flex-row space-x-3 mb-4">
          <div className="w-full ">
            <label htmlFor="newPassword" className="text-sm text-gray-600">
              {t("new_password")}
            </label>
            <input
              {...register("newPassword")}
              type="password"
              id="new_password_1"
              placeholder="**********"
              required
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
            />
          </div>

          <div className="w-full space-y">
            <label htmlFor="newPassword2" className="text-sm text-gray-600">
              {t("confirm_password")}
            </label>
            <input
              {...register("newPassword2", {
                required: true,
                validate: (val: string) => {
                  if (watch("newPassword") != val) {
                    return "Your passwords do no match";
                  }
                },
              })}
              type="password"
              id="new_password_2"
              placeholder="**********"
              required
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
            />

            {errors.newPassword2?.message && <p>{t("confirm_match")}</p>}
          </div>
        </div>

        <div className="flex flex-row items-end">
          <div className="pl-0">
            <Button size="medium"> {t("save")}</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
