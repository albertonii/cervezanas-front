"use client";

import LinkDistributor from "./LinkDistributor";
import ListAssociatedDistributors from "./ListAssociatedDistributors";
import React from "react";
import { useAuth } from "../../../../Auth/useAuth";

export default function Distributors() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <>
      <LinkDistributor producerId={user.id} />

      {/* Section displaying all asociated distributors */}
      <section className="mt-4 flex flex-col space-y-4">
        <ListAssociatedDistributors producerId={user.id} />
      </section>
    </>
  );
}
