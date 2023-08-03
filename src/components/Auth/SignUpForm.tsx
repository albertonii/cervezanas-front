import {  useState } from "react";
import { Spinner } from "../common/Spinner";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useAuth } from ".";
import { Button, DisplayInputError } from "../common";
import { ROLE_ENUM } from "../../lib/types.d";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { SignUpWithPasswordCredentials } from "./AuthContext";

const ROLE_OPTIONS = [
  {
    label: "Cervezano",
    value: ROLE_ENUM.Cervezano,
  },
  {
    label: "Productor",
    value: ROLE_ENUM.Productor,
  },{
    label: "Distribuidor",
    value: ROLE_ENUM.Distributor,
  },
];

interface FormData {
  access_level: string;
  username: string;
  email: string;
  password: string;
  avatar_url: string;
  email_verified: boolean;
  full_name: string;
  iss: string;
  name: string;
  lastname: string;
  picture: string;
  provider_id: string;
  sub: string;
}

export const SignUpForm = () => {
  const t = useTranslations();

  const { signUp, isLoading: loading } = useAuth();




  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      access_level: ROLE_ENUM.Cervezano,
      username: "",
      email: "",
      password: "",
      avatar_url: "",
      email_verified: false,
      full_name: "",
      iss: "",
      name: "",
      lastname: "",
      picture: "",
      provider_id: "",
      sub: "",
    },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(ROLE_ENUM.Cervezano);

  const handleChangeRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value: any = event?.target.value;
    setRole(value);
  };

  const onSubmit = async () => {
    const data = {
      access_level: role,
      username: username,
      email: email,
      email_verified: false,
    };

    const signUpInfo: SignUpWithPasswordCredentials = {
      email: email,
      password: password,
      options: {
        emailRedirectTo: `${location.origin}/api/auth/callback`,
        captchaToken: "",
        data: data,
      },
    };

    signUp(signUpInfo);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-4 flex flex-col space-y-4"
    >
      <div className="flex w-full flex-col space-y-2">
        <select
          {...register("access_level")}
          value={role}
          onChange={handleChangeRole}
          className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
        >
          {ROLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex w-full flex-col space-y-2">
        <label htmlFor="username" className="text-sm text-gray-600">
          {t("username")}
        </label>

        <input
          {...register("username", {
            required: true,
          })}
          type="text"
          id="username"
          autoComplete="username"
          placeholder="user_123"
          required
          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {errors.username?.type === "required" && (
          <DisplayInputError message="errors.input_required" />
        )}
      </div>

      <div className="flex w-full flex-col space-y-2">
        <label htmlFor="email-address" className="text-sm text-gray-600">
          {t("email")}
        </label>
        <input
          {...register("email", { required: true })}
          type="email"
          id="email-address"
          autoComplete="username"
          placeholder="ejemplo@gmail.com"
          required
          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {errors.email?.type === "required" && (
          <DisplayInputError message="errors.input_required" />
        )}
      </div>

      <div className="flex w-full flex-col space-y-2 ">
        <label htmlFor="password" className="text-sm text-gray-600">
          {t("password")}
        </label>
        <input
          {...register("password", {
            required: true,
          })}
          type="password"
          id="password"
          autoComplete="new-password"
          required
          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
          placeholder="*****"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errors.password?.type === "required" && (
          <DisplayInputError message="errors.input_required" />
        )}
      </div>

      {loading ? (
        <span>
          <Spinner color={""} size={""} />
        </span>
      ) : (
        <>
          <Button
            title={"sign_up"}
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
            {t("sign_up")}
          </Button>
        </>
      )}
    </form>
  );
};
