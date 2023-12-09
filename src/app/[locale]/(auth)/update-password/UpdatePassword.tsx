"use client";

// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { z, ZodType } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { DisplayInputError } from "../../components/common/DisplayInputError";
import { useAuth } from "../../Auth/useAuth";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

const schema: ZodType<FormData> = z.object({
  email: z
    .string()
    .email({
      message: "Must be a valid email",
    })
    .min(5, { message: "Required" }),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters" }),
});

type ValidationSchema = z.infer<typeof schema>;

export default function UpdatePassword() {
  // const supabase = createClientComponentClient();
  const { supabase } = useAuth();

  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function resetPassword(formData: ValidationSchema) {
    const { error } = await supabase.auth.resetPasswordForEmail(
      formData?.email,
      {
        redirectTo: `${window.location.origin}/auth/update-password`,
      }
    );

    if (error) {
      console.error(error);
    }
  }

  return (
    <section className="w-[60vw] gap-8 space-y-4 px-4 py-12 sm:px-6 lg:grid lg:grid-cols-2 lg:px-20 xl:px-24">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Reset your password
        </h1>

        <form
          onSubmit={handleSubmit(resetPassword)}
          className="mt-8 space-y-6"
          action="#"
          method="POST"
        >
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="-space-y-px rounded-md shadow-sm">
            <div className="flex w-full flex-col space-y-3">
              {/* password  */}
              <div className="flex w-full flex-col space-y-2 ">
                <label htmlFor="password" className="text-sm text-gray-600">
                  Password
                  <input
                    {...register("password")}
                    id="password"
                    type="password"
                    className="relative flex w-full appearance-none justify-center rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                    placeholder="*****"
                  />
                  {errors.password && (
                    <DisplayInputError message={errors.password.message} />
                  )}
                </label>

                {/* confirm password  */}
                <div className="flex w-full flex-col space-y-2 ">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm text-gray-600"
                  >
                    Confirm Password
                    <input
                      {...register("confirmPassword")}
                      id="confirmPassword"
                      type="password"
                      className="relative flex w-full appearance-none justify-center rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                      placeholder="*****"
                    />
                    {errors.confirmPassword && (
                      <DisplayInputError
                        message={errors.confirmPassword.message}
                      />
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-beer-softBlonde px-4 py-2 text-sm font-medium text-white hover:bg-beer-draft focus:outline-none focus:ring-2 focus:ring-beer-softBlonde focus:ring-offset-2"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                {/* Heroicon name: lock-closed */}
                <svg
                  className="h-5 w-5 text-beer-draft group-hover:text-beer-softBlonde"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M4 8V6a6 6 0 1112 0v2h1a1 1 0 011 1v7a4 4 0 01-4 4H7a4 4 0 01-4-4V9a1 1 0 011-1h1zm2 0h6V6a4 4 0 10-6 0v2z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
