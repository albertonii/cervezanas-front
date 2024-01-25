"use client";

import React, { useEffect } from "react";
import { useAuth } from "../../Auth/useAuth";

export default function Signout() {
  const { signOut } = useAuth();

  useEffect(() => {
    signOut();
  }, [signOut]);

  return <div>Signout</div>;
}
