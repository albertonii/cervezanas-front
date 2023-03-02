import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { supabase } from "../../../utils/supabaseClient";
import { Spinner } from "../../common/Spinner";
import { Button } from "../../common";
import { Profile } from "../../../lib/types";

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
      birthdate: birthdate,
      email: email,
    },
  });

  const onSubmit = async (formValues: FormData) => {
    try {
      setLoading(true);

      const { name, lastname, birthdate, username, email } = formValues;

      let { error } = await supabase
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
    } catch (error) {
      alert("Error updating the data!");
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="account_basic_data"
      className="container px-6 py-4 bg-white space-y-3 mb-4"
    >
      <div id="account-data" className="text-2xl">
        {t("profile_title_acc_data")}
      </div>

      {!loading ? (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                value={username}
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
                value={birthdate}
                {...register("birthdate")}
              />
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
                value={name}
                {...register("name", {
                  required: true,
                  maxLength: 15,
                })}
              />
              {errors.name?.type === "required" && (
                <p>Campo nombre es requerido</p>
              )}
              {errors.name?.type === "maxLength" && (
                <p>Nombre debe tener menos de 15 caracteres</p>
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
                value={lastname}
                {...register("lastname", {
                  required: true,
                  maxLength: 25,
                })}
              />
            </div>

            {errors.lastname?.type === "required" && (
              <p>Campo apellido es requerido</p>
            )}
            {errors.lastname?.type === "maxLength" && (
              <p>Apellido debe tener menos de 25 caracteres</p>
            )}
          </div>

          <div className="flex flex-row items-end">
            <div className="w-full">
              <label htmlFor="email" className="text-sm text-gray-600">
                {t("profile_acc_email")}
              </label>
              <input
                placeholder="ejemplo@gmail.com"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                value={email}
                {...register("email", {
                  required: true,
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                })}
              />

              {errors.email?.type === "pattern" && (
                <p>El formato del email es incorrecto</p>
              )}
            </div>

            <div className="pl-12 ">
              <Button primary medium class={""} btnType={"submit"}>
                {t("save")}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <Spinner color="beer-blonde" size={"medium"} />
      )}
    </div>
  );
}
