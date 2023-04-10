import { useEffect } from "react";
import { useAuth } from "../components/Auth/useAuth";

export default function SignOut() {
  const { signOut, setUser } = useAuth();

  useEffect(() => {
    signOut();
  }, [setUser, signOut]);

  return;
}
