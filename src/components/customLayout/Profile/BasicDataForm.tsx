import { Button } from "@supabase/ui";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { supabase } from "../../../utils/supabaseClient";
import { Spinner } from "../../common/Spinner";

export const BasicDataForm = (props: any) => {
  const { t } = useTranslation();

  const {
    id: id_,
    username: username_,
    birthdate: birthdate_,
    given_name: given_name_,
    lastname: lastname_,
    email: email_,
  } = props.profileData[0];

  const [loading, setLoading] = useState(false);

  const [id, setId] = useState(id_);
  const [username, setUsername] = useState(username_);
  const [name, setName] = useState(given_name_);
  const [lastname, setLastname] = useState(lastname_);
  const [email, setEmail] = useState(email_);
  const [birthdate, setBirthdate] = useState(birthdate_);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      username: username,
      given_name: name,
      lastname: lastname,
      birthdate: birthdate,
      email: email,
    },
  });

  useEffect(() => {
    setId(id_);
  }, [id_]);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const updates = {
        id,
        given_name: name,
        lastname,
        birthdate,
      };

      let { error } = await supabase.from("users").update(updates).eq("id", id);
      setLoading(false);

      if (error) throw error;
    } catch (error) {
      alert("Error updating the data!");
      console.log(error);
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
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={username}
                {...register("username")}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="w-full ">
              <label htmlFor="birthdate" className="text-sm text-gray-600">
                {t("profile_acc_birthdate")}
              </label>
              <input
                type="date"
                id="birthdate"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={birthdate}
                {...register("birthdate")}
                onChange={(e) => setBirthdate(e.target.value)}
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
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={name}
                {...register("given_name", {
                  required: true,
                  maxLength: 15,
                })}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.given_name?.type === "required" && (
                <p>Campo nombre es requerido</p>
              )}
              {errors.given_name?.type === "maxLength" && (
                <p>Nombre debe tener menos de 15 caracteres</p>
              )}
            </div>

            <div className="w-full ">
              <label htmlFor="lastname" className="text-sm text-gray-600">
                {t("profile_acc_lastname")}
              </label>
              <input
                type="text"
                id="lastname"
                placeholder="Niironen"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={lastname}
                {...register("lastname", {
                  required: true,
                  maxLength: 25,
                })}
                onChange={(e) => setLastname(e.target.value)}
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
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={email}
                {...register("email", {
                  required: true,
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                })}
                onChange={(e) => setEmail(e.target.value)}
              />

              {errors.email?.type === "pattern" && (
                <p>El formato del email es incorrecto</p>
              )}
            </div>

            <div className="pl-12 ">
              <Button type="primary" size="medium">
                {t("save")}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <Spinner />
      )}
    </div>
  );
};
