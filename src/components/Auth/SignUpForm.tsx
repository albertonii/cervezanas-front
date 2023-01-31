import { useState } from "react";
import { Spinner } from "../common/Spinner";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { SignUpInterface, useAuth } from ".";
import Button from "../common/Button";

enum role_enum {
  Cervezano = "consumer",
  Productor = "producer",
}

const role_options = [
  {
    label: "Cervezano",
    value: role_enum.Cervezano,
  },
  {
    label: "Productor",
    value: role_enum.Productor,
  },
];

interface FormData {
  access_level: string;
  username: string;
  email: string;
  password: string;
}

export const SignUpForm = () => {
  const { t } = useTranslation();

  const { signUp, loading } = useAuth();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      access_level: role_enum.Cervezano,
      username: "",
      email: "",
      password: "",
    },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(role_enum.Cervezano);

  const data = {
    access_level: role,
    name: "",
    lastname: "",
    username: username,
  };

  const handleChangeRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value: any = event?.target.value;
    setRole(value);
  };

  const onSubmit = async () => {
    const userCredentials: SignUpInterface = {
      userCredentials: { email: email, password: password, phone: "" },
      options: {
        redirectTo: "",
        data: data,
        captchaToken: "",
      },
    };

    signUp(userCredentials);
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
          className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          {role_options.map((option) => (
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
          {...register("username")}
          type="text"
          id="username"
          autoComplete="username"
          placeholder="user_123"
          required
          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="flex w-full flex-col space-y-2">
        <label htmlFor="email-address" className="text-sm text-gray-600">
          {t("email")}
        </label>
        <input
          {...register("email")}
          type="email"
          id="email-address"
          autoComplete="username"
          placeholder="ejemplo@gmail.com"
          required
          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

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
          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          placeholder="*****"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {loading ? (
        <span>
          <Spinner />
        </span>
      ) : (
        <>
          <Button
            onClick={() => {
              onSubmit();
            }}
            class={"w-96"}
            title={t("sign_up")}
            xLarge
            primary
          >
            {t("sign_up")}
          </Button>
        </>
      )}
    </form>
  );
};
