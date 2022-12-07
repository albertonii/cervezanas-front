import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "react-query";
import { supabase } from "../utils/supabaseClient";

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

const createUser = async (user: User, data: Options) => {
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

  const { user: u, error: signUpError } = await supabase.auth.signUp(
    {
      email: user.email,
      password: user.password,
    },
    options
  );

  if (signUpError) {
    alert(signUpError.message);
    throw signUpError;
  }

  return u;
};

export default function useCreateUser(user: User, data: Options) {
  return useMutation(() => createUser(user, data), {
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
