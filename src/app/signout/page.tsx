import { useEffect } from "react";
import { useAuth } from "../../components/Auth";

export default function SignOut() {
  const { signOut } = useAuth();

  useEffect(() => {
    signOut();
  }, [signOut]);

  return;
}
