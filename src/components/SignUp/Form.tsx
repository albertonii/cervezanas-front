import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";

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

export const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsetname] = useState("");
  const [role, setRole] = useState(role_enum.Cervezano);

  const router = useRouter();

  const handleSignUp = async () => {
    const data = {
      access_level: role,
      username: username,
      given_name: "",
      lastname: "",
    };

    const options = {
      data,
    };

    const { user, error } = await supabase.auth.signUp(
      { email, password },
      options
    );
    if (error) alert(error.message);
    else {
      router.push("/confirm-email");
    }
  };

  const handleChangeRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value: any = event?.target.value;
    setRole(value);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSignUp();
      }}
      className="mt-4 flex flex-col space-y-4"
    >
      <div className="flex w-full flex-col space-y-2">
        <select
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
          Nombre de usuario
        </label>
        <input
          type="username"
          id="username"
          autoComplete="username"
          placeholder="user_123"
          required
          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          value={username}
          onChange={(e) => setUsetname(e.target.value)}
        />
      </div>

      <div className="flex w-full flex-col space-y-2">
        <label htmlFor="email-address" className="text-sm text-gray-600">
          Correo electrónico
        </label>
        <input
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
          Contraseña
        </label>
        <input
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
      <button
        type="submit"
        className="group relative my-4 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Regístrame
      </button>
    </form>
  );
};
