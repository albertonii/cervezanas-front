import { type NextPage } from "next";
import { useEffect } from "react";
import { type UserProps } from "../lib/types";
import { useAuth } from "../components/Auth/useAuth";

const SignOut: NextPage<UserProps> = () => {
  const { signOut, setUser } = useAuth();

  useEffect(() => {
    setUser(null);
    signOut();
  }, [setUser, signOut]);

  return <div>The user should have signed out.</div>;
};

export default SignOut;
