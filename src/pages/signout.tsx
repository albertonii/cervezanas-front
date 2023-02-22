import { useEffect } from "react";
import { Layout } from "../components";
import { useAuth } from "../components/Auth/useAuth";

export default function SignOut() {
  const { signOut, setUser } = useAuth();

  useEffect(() => {
    signOut();
  }, [setUser, signOut]);

  return;
  <Layout useBackdrop={true} usePadding={false}>
    <div>The user should have signed out.</div>
  </Layout>;
}
