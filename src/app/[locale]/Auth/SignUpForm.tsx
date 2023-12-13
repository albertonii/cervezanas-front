import { useState } from "react";
import Spinner from "../components/common/Spinner";
import { useTranslations } from "next-intl";
import { SubmitHandler, useForm } from "react-hook-form";
import { DisplayInputError } from "../components/common/DisplayInputError";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { SignUpWithPasswordCredentials } from "./AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";
import { useMutation } from "react-query";
import { useMessage } from "../components/message/useMessage";
import { useAuth } from "./useAuth";
import { Button } from "../components/common/Button";
import { ROLE_ENUM, ROLE_OPTIONS } from "../../../lib/enums";

interface FormData {
  access_level: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  // avatar_url: string;
  // email_verified: boolean;
  // full_name: string;
  // iss: string;
  // name: string;
  // lastname: string;
  // picture: string;
  // provider_id: string;
  // sub: string;
}

const schema: ZodType<FormData> = z
  .object({
    access_level: z.string(),
    username: z.string().min(5, { message: "Required" }),
    email: z
      .string()
      .email({
        message: "Must be a valid email",
      })
      .min(5, { message: "Required" }),
    password: z
      .string()
      .min(8, { message: "Password must be atleast 8 characters" }),
    confirm_password: z
      .string()
      .min(8, { message: "Password must be atleast 8 characters" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Password don't match",
  });

type ValidationSchema = z.infer<typeof schema>;

export const SignUpForm = () => {
  const t = useTranslations();

  const { signUp, isLoading: loading } = useAuth();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      access_level: ROLE_ENUM.Cervezano,
      username: "",
      email: "",
      password: "",
    },
  });

  const [role, setRole] = useState(ROLE_ENUM.Cervezano);
  const { handleMessage } = useMessage();

  const handleChangeRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value: any = event?.target.value;
    setRole(value);
  };

  const handleCredentialsSignUp = async (form: ValidationSchema) => {
    const { username, email, password } = form;

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

  const handleCredentialsMutation = useMutation({
    mutationKey: "credentialsSignUp",
    mutationFn: handleCredentialsSignUp,
    onMutate: () => {
      console.info("onMutate");
    },
    onSuccess: () => {
      console.info("success sign up");
      reset();
    },
    onError: (error: Error) => {
      handleMessage({
        type: "error",
        message: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (formValues: FormData) => {
    try {
      handleCredentialsMutation.mutate(formValues);
    } catch (e) {
      console.error(e);
    }
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
          {...register("username")}
          type="text"
          id="username"
          autoComplete="username"
          placeholder="user_123"
          required
          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
        />

        {errors.username && (
          <DisplayInputError message={errors.username.message} />
        )}
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
          placeholder="ejemplo@cervezanas.com"
          required
          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
        />

        {errors.email && <DisplayInputError message={errors.email.message} />}
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
          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
          placeholder="*****"
        />

        {errors.password && (
          <DisplayInputError message={errors.password.message} />
        )}
      </div>

      <div className="flex w-full flex-col space-y-2 ">
        <label htmlFor="confirm_password" className="text-sm text-gray-600">
          {t("confirm_password")}
        </label>
        <input
          {...register("confirm_password")}
          type="password"
          id="confirm_password"
          autoComplete="confirm_password"
          required
          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
          placeholder="*****"
        />

        {errors.confirm_password && (
          <DisplayInputError message={errors.confirm_password.message} />
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
