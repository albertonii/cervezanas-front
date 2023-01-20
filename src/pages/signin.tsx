import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { type NextPage } from "next";
import { SignInForm } from "../components/SignIn/Form";
import { useEffect, useState } from "react";
import Router from "next/router";
import { type UserProps } from "../lib/types";
import { SignInGoogle } from "../components/SignIn/SignInGoogle";
import { useUser } from "../components/Auth/UserContext";
import {
  LiteralUnion,
  ClientSafeProvider,
  useSession,
  getProviders,
  signIn,
  signOut,
  getCsrfToken,
} from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers";
import { useTranslation } from "react-i18next";
import { FaLock } from "react-icons/fa";
import { useForm } from "react-hook-form";

interface FormData {
  email: string;
  password: string;
}

interface SignInProps {
  csrfToken: string;
}

const SignIn: NextPage<SignInProps> = ({ csrfToken }: SignInProps) => {
  const { data } = useSession();

  const { register, handleSubmit } = useForm<FormData>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    signIn("credentials", { email, password });
  };

  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);

  // If the user is already logged in, then
  // redirect them to home.
  useEffect(() => {
    if (data?.user) {
      Router.push("/");
    }

    const setTheProviders = async () => {
      const setupProviders = await getProviders();
      setProviders(setupProviders);
    };

    setTheProviders();
  }, [data]);

  // if (status === "loading") return <h1>{t("loading")}</h1>;

  return (
    <>
      <Head>
        <title>Cervezanas · Acceso 🍺</title>
        <meta name="signin" content="Access login Cervezanas" />
      </Head>

      <main className="flex h-full min-h-screen bg-white">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-6 text-start text-3xl font-bold tracking-tight text-gray-900">
                Acceder
              </h2>
            </div>

            {providers?.google && (
              <>
                <div className="mt-8">
                  <div className="mt-6">
                    <p className="mt-2 text-sm text-gray-600">
                      O inicia sesión con
                    </p>

                    <SignInGoogle />
                  </div>
                </div>
              </>
            )}

            {providers?.credentials && (
              <>
                {/* <SignInForm /> */}
                <form
                  className="mt-4 space-y-4"
                  onSubmit={handleSubmit(onSubmit)}
                  method="post"
                  action="/api/auth/callback/credentials"
                >
                  <div className="flex w-full flex-col space-y-3">
                    <input
                      name="csrfToken"
                      type="hidden"
                      defaultValue={csrfToken}
                    />

                    <label
                      htmlFor="email-address"
                      className="text-sm text-gray-600"
                    >
                      Correo electrónico
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      id="email-address"
                      placeholder="ejemplo@gmail.com"
                      required
                      className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex w-full flex-col space-y-2 ">
                    <label htmlFor="password" className="text-sm text-gray-600">
                      contraseña
                    </label>
                    <input
                      {...register("password")}
                      type="password"
                      id="password"
                      required
                      className="relative flex w-full appearance-none justify-center rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="*****"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {/*TODO: REMEMBER ME AND FORGOT PASSWORD FUNCTIONALITY */}
                  {/* <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    id='remember-me'
                    name='remember-me'
                    type='checkbox'
                    className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                  />
                  <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-900'>
                    {' '}
                    Remember me{' '}
                  </label>
                </div>

                <div className='text-sm'>
                  <a href='#' className='font-medium text-indigo-600 hover:text-indigo-500'>
                    {' '}
                    Forgot your password?{' '}
                  </a>
                </div>
              </div> */}
                  <button
                    type="submit"
                    className="group relative my-4 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaLock className="text-base text-indigo-500 group-hover:text-indigo-400" />
                    </span>
                    Acceder
                  </button>
                </form>
              </>
            )}

            <p className="my-2 flex w-full justify-center text-sm text-gray-700">
              ¿No estás registrado?
              <Link className="cursor-pointer font-bold" href={"/signup"}>
                <span className="mx-1 text-blue-600 hover:underline">
                  Dame de alta
                </span>
              </Link>
            </p>
          </div>
        </div>

        <div className="relative hidden w-0 flex-1 lg:block">
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src="/barriles.jpg"
            alt=""
            layout="fill"
          />
        </div>
      </main>
    </>
  );
};

export default SignIn;

export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
