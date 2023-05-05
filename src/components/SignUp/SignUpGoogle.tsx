import { supabase } from "../../utils/supabase-browser";
import { Auth } from "@supabase/ui";

export default async function signUpGoogle() {
  const { error } = await supabase.auth.signUp({ provider: "google" });
  if (error) console.error(error);
}

export const SignUpGoogle = () => {
  const { user } = Auth.useUser();

  return (
    <>
      {!user && (
        <>
          <button
            className="my-2 mr-2 mb-2 flex flex-row items-center rounded-lg border border-gray-300 
              bg-white px-3 py-0 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 
              dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            onClick={() => signUpGoogle()}
          >
            <svg
              className="w-6"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 32 32"
              width="64"
              height="64"
            >
              <defs>
                <path
                  id="A"
                  d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                />
              </defs>
              <clipPath id="B">
                <use xlinkHref="#A" />
              </clipPath>
              <g transform="matrix(.727273 0 0 .727273 -.954545 -1.45455)">
                <path d="M0 37V11l17 13z" clipPath="url(#B)" fill="#fbbc05" />
                <path
                  d="M0 11l17 13 7-6.1L48 14V0H0z"
                  clipPath="url(#B)"
                  fill="#ea4335"
                />
                <path
                  d="M0 37l30-23 7.9 1L48 0v48H0z"
                  clipPath="url(#B)"
                  fill="#34a853"
                />
                <path
                  d="M48 48L17 24l-4-3 35-10z"
                  clipPath="url(#B)"
                  fill="#4285f4"
                />
              </g>
            </svg>
            <span className="ml-2 text-lg">Registrarme con Google</span>
          </button>
        </>
      )}
    </>
  );
};
