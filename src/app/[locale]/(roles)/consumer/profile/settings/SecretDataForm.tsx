"use client";

import { z, ZodType } from "zod";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useAuth } from "../../../../Auth/useAuth";
import { Button } from "../../../../components/common/Button";
import { DisplayInputError } from "../../../../components/common/DisplayInputError";
import { Spinner } from "../../../../components/common/Spinner";
import { useMessage } from "../../../../components/message/useMessage";
import { useMutation } from "react-query";

type FormData = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

const schema: ZodType<FormData> = z
  .object({
    old_password: z.string().min(8, { message: "Required" }),
    new_password: z.string().min(8, { message: "Required" }),
    confirm_password: z.string().min(8, { message: "Required" }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Password don't match",
  });

type ValidationSchema = z.infer<typeof schema>;

export function SecretDataForm() {
  const t = useTranslations();
  const { supabase } = useAuth();

  const [loading, setLoading] = useState(false);

  const { handleMessage } = useMessage();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const handleUpdataPassword = async (form: ValidationSchema) => {
    setLoading(true);

    // TODO: Check if old password is correct

    // TODO: Update and fix error Not Logged In after update pass

    const { new_password } = form;

    const { error } = await supabase.auth.updateUser({
      password: new_password,
    });

    if (error) throw error;
  };

  const handleUpdatePasswordMutation = useMutation({
    mutationKey: "updatePassword",
    mutationFn: handleUpdataPassword,
    onSuccess: () => {
      handleMessage({
        type: "success",
        message: "password_updated",
      });

      reset();
      setLoading(false);
    },
    onError: (error: Error) => {
      handleMessage({
        type: "error",
        message: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<ValidationSchema> = async (
    formValues: FormData
  ) => {
    try {
      handleUpdatePasswordMutation.mutate(formValues);
    } catch (e) {
      console.error(e);
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
              {...register("old_password", {
                required: true,
              })}
              type="password"
              id="actual_password"
              placeholder="**********"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
            />

            {errors.old_password && (
              <DisplayInputError message={errors.old_password.message} />
            )}
          </div>
        </div>

        <div className="w-full ">
          <label htmlFor="new_password" className="text-sm text-gray-600">
            {t("new_password")}
          </label>

          <input
            {...register("new_password", {
              required: true,
            })}
            type="password"
            id="new_password_1"
            placeholder="**********"
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
          />

          {errors.new_password && (
            <DisplayInputError message={errors.new_password.message} />
          )}
        </div>

        <div className="w-full ">
          <label htmlFor="confirm_password" className="text-sm text-gray-600">
            {t("confirm_password")}
          </label>

          <input
            {...register("confirm_password", {
              required: true,
            })}
            type="password"
            id="confirm_password"
            placeholder="**********"
            required
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
          />

          {errors.confirm_password && (
            <DisplayInputError message={errors.confirm_password.message} />
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
