"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/Auth";
import { VIEWS } from "../../constants";

export default function Signout() {
  const { signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    signOut();
    router.push(VIEWS.SIGN_IN);
  }, [signOut]);

  return <div>Signout</div>;
}
