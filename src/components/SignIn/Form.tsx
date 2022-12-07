import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";
import { FaLock } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useLogin from "../../hooks/useLogin";

interface FormData {
  email: string;
  password: string;
}

export const SignInForm = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createLoginMutation = useLogin({ email, password });

  if (createLoginMutation.isSuccess) {
    router.push("/");
  }

  const onSubmit = async () => {
    createLoginMutation.mutate();
  };

  return (
    <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-full flex-col space-y-3">
        <label htmlFor="email-address" className="text-sm text-gray-600">
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
  );
};
