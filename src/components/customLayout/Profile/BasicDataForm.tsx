import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../../utils/supabaseClient";
import { Spinner } from "../../common/Spinner";
import { Button } from "../../common";
import { Profile } from "../../../lib/types.d";
import { formatDateDefaultInput } from "../../../utils";
import { useTranslation } from "react-i18next";

interface FormData {
  name: string;
  lastname: string;
  username: string;
  birthdate: string;
  email: string;
}

interface Props {
  profile: Profile;
}

export function BasicDataForm({ profile }: Props) {
  const { t } = useTranslation();

  const { id, username, birthdate, name, lastname, email } = profile;

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
      birthdate: formatDateDefaultInput(birthdate),
      email: email,
    },
  });

  const onSubmit = async (formValues: FormData) => {
    setLoading(true);

    const { name, lastname, birthdate, username, email } = formValues;

    setTimeout(async () => {
      const { error } = await supabase
        .from("users")
        .update({
          name,
          lastname,
          birthdate,
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
      className="container px-6 py-4 bg-white space-y-3 mb-4"
    >
      <div id="account-data" className="text-2xl">
        {t("profile_title_acc_data")}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 relative">
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
              className="hover:bg-beer-softFoam hover:cursor-not-allowed relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              {...register("username")}
            />
          </div>

          <div className="w-full ">
            <label htmlFor="birthdate" className="text-sm text-gray-600">
              {t("profile_acc_birthdate")}
            </label>

            <input
              type="date"
              id="birthdate"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              {...register("birthdate", {
                required: true,
              })}
            />

            {errors.birthdate?.type === "required" && (
              <p>{t("errors.errors.input_required")}</p>
            )}
          </div>
        </div>

        <div className="flex w-full flex-row space-x-3 ">
          <div className="w-full space-y">
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
              <p>{t("errors.errors.input_required")}</p>
            )}
            {errors.name?.type === "maxLength" && (
              <p>{t("errors.error_30_max_length")}</p>
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
              <p>{t("errors.errors.input_required")}</p>
            )}
            {errors.lastname?.type === "maxLength" && (
              <p>{t("errors.error_50_max_length")}</p>
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
              <p>{t("errors.errors.input_required")}</p>
            )}

            {errors.email?.type === "pattern" && (
              <p>{t("errors.input_email_invalid")}</p>
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
