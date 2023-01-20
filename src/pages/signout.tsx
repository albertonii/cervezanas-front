import { type NextPage } from "next";
import { useEffect } from "react";
import { useUser } from "../components/Auth/UserContext";
import { type UserProps } from "../lib/types";
import { signOut } from "next-auth/react";

const SignOut: NextPage<UserProps> = () => {
  const { setUser } = useUser();

  useEffect(() => {
    setUser(null);
    signOut();
  }, [setUser]);

  return <div>The user should have signed out.</div>;
};

export default SignOut;
