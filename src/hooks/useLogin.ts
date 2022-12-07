import { useMutation } from "react-query";
import { supabase } from "../utils/supabaseClient";

interface User {
  email: string;
  password: string;
}

const grantAccessUser = async (user: User) => {
  const { user: data, error: signInError } = await supabase.auth.signIn({
    email: user.email,
    password: user.password,
  });

  

  if (signInError) {
    alert(signInError.message);
    throw signInError;
  }

  return data;
};

export default function useLogin(user: User) {
  return useMutation("login", () => grantAccessUser(user), {});
}
