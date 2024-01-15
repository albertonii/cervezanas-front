"use client";

import { SupabaseClient } from "@supabase/supabase-js";
import { useMutation } from "react-query";
import { useAuth } from "../app/[locale]/Auth/useAuth";

interface User {
  email: string;
  password: string;
}

interface Options {
  username: string;
  access_level: string;
  given_name: string;
  lastname: string;
}

const createUser = async (
  user: User,
  data: Options,
  supabase: SupabaseClient<any>
) => {
  // Check if username exists
  const { data: userWithUsername } = await supabase
    .from("users")
    .select("*")
    .eq("username", data.username)
    .single();

  const options = { data };

  if (userWithUsername) {
    throw new Error("User with username exists");
  }

  const { data: u, error: signUpError } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options,
  });

  if (signUpError) {
    alert(signUpError.message);
    throw signUpError;
  }

  return u;
};

export default function useCreateUser(user: User, data: Options) {
  const { supabase } = useAuth();

  return useMutation("register", () => createUser(user, data, supabase), {
    /*
    onSuccess: async (u) => {
      const { data: insertData, error: insertError } = await supabase
        .from("users")
        .insert({
          username: data.username,
          email: user.email,
          id: u?.id,
        });

      if (insertError) {
        throw insertError;
      }

      return insertData;
    },
      */
  });
}
