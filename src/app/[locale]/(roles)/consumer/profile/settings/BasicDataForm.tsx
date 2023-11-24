"use client";

import { z, ZodType } from "zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useAuth } from "../../../../Auth/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { IUserTable } from "../../../../../../lib/types";
import { Button } from "../../../../components/common/Button";
import { Spinner } from "../../../../components/common/Spinner";
import { DisplayInputError } from "../../../../components/common/DisplayInputError";
import { useMutation } from "react-query";
import { useMessage } from "../../../../components/message/useMessage";

type FormData = {
  name: string;
  lastname: string;
};

const schema: ZodType<FormData> = z.object({
  name: z.string().min(2, { message: "Required" }).max(50, {
    message: "The name is too long, max length are 50 characters",
  }),
  lastname: z.string().min(2, { message: "Required" }).max(50, {
    message: "The lastname is too long, max length are 50 characters",
  }),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
  profile: IUserTable;
}

export function BasicDataForm({ profile }: Props) {
  const t = useTranslations();
  const { supabase } = useAuth();

  const { id, username, name, lastname, email } = profile;

  const [loading, setLoading] = useState(false);
  const successMessage = t("profile_acc_data_updated");

  const { handleMessage } = useMessage();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name,
      lastname,
      email,
      username,
    },
  });

  const handleUpdateBasicData = async (form: ValidationSchema) => {
    const { name, lastname } = form;

    const { error } = await supabase
      .from("users")
      .update({
        name,
        lastname,
      })
      .eq("id", id);

    setLoading(false);

    if (error) throw error;
  };

  const handleUpdateBasicDataMutation = useMutation({
    mutationKey: "updateBasicData",
    mutationFn: handleUpdateBasicData,
    onSuccess: () => {
      handleMessage({
        type: "success",
        message: successMessage,
      });
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
      handleUpdateBasicDataMutation.mutate(formValues);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section
      id="account_basic_data"
      className="container mb-4 space-y-3 bg-white px-6 py-4"
    >
      <span id="account-data" className="text-2xl">
        {t("profile_title_acc_data")}
      </span>

      <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-2">
        <div className="flex w-full flex-row space-x-3 ">
          <div className="w-full ">
            <label htmlFor="username" className="text-sm text-gray-600">
              {t("profile_acc_username")}
            </label>

            <input
              placeholder="user123"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 hover:cursor-not-allowed focus:z-10 sm:text-sm"
              {...register("username")}
              disabled
            />
          </div>
        </div>

        <div className="flex flex-row items-end">
          <div className="w-full">
            <label htmlFor="email" className="text-sm text-gray-600">
              {t("profile_acc_email")}
            </label>

            <input
              placeholder="ejemplo@gmail.com"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 hover:cursor-not-allowed focus:z-10 sm:text-sm"
              {...register("email", {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
              })}
              disabled
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

            {errors.name && <DisplayInputError message={errors.name.message} />}
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

            {errors.lastname && (
              <DisplayInputError message={errors.lastname.message} />
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
    </section>
  );
}
