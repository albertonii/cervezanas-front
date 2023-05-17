"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, DisplayInputError, Spinner } from "../../common";
import { useSupabase } from "../../Context/SupabaseProvider";
import { useMessage } from "../../message";

interface FormProps {
  oldPassword: string;
  newPassword: string;
  newPassword2: string;
}

export function SecretDataForm() {
  const { t } = useTranslation();
  const { supabase } = useSupabase();

  const [loading, setLoading] = useState(false);

  const { handleMessage } = useMessage();

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
    setLoading(true);

    // TODO: Check if old password is correct

    // TODO: Update and fix error Not Logged In after update pass

    const { newPassword, newPassword2 } = formValues;

    if (newPassword === newPassword2) {
      setTimeout(async () => {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) throw error;

        handleMessage({
          type: "success",
          message: `${t("password_updated")}`,
        });

        reset();

        setLoading(false);
      }, 700);
    }
  };

  return (
    <div
      id="account_secret_data"
      className="container mb-4 space-y-3  bg-white px-6 py-4"
    >
      <div id="password" className="text-2xl">
        {t("password")}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-2">
        <div className="flex w-full flex-row space-x-3 ">
          <div className="w-full ">
            <label htmlFor="actual_password" className="text-sm text-gray-600">
              {t("actual_password")}
            </label>

            <input
              {...register("oldPassword", {
                required: true,
              })}
              type="password"
              id="actual_password"
              placeholder="**********"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
            />

            {errors.oldPassword?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </div>
        </div>

        <div className="w-full ">
          <label htmlFor="newPassword" className="text-sm text-gray-600">
            {t("new_password")}
          </label>

          <input
            {...register("newPassword", {
              required: true,
            })}
            type="password"
            id="new_password_1"
            placeholder="**********"
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
          />

          {errors.newPassword?.type === "required" && (
            <DisplayInputError message="errors.input_required" />
          )}
        </div>

        <div className="w-full ">
          <label htmlFor="newPassword2" className="text-sm text-gray-600">
            {t("confirm_password")}
          </label>

          <input
            {...register("newPassword2", {
              required: true,
              validate: (val: string) => {
                if (watch("newPassword") != val) {
                  return "errors.password_match";
                }
              },
            })}
            type="password"
            id="new_password_2"
            placeholder="**********"
            required
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
          />

          {errors.newPassword2?.type === "validate" && (
            <DisplayInputError message="errors.newPassword2?.message" />
          )}
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
