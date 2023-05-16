"use client";

import BMGoogleMap from "../../components/BMGoogleMap";
import React, { useState } from "react";
import { IConsumptionPoints } from "../../lib/types.d";

export default async function BeerMe() {
  const cps = await getCPs();
  const [address, setAddress] = useState<string>("");

  const handleAddress = (address: string) => {
    setAddress(address);
  };

  return (
    <div className="mx-auto sm:py-2 lg:py-3 ">
      <BMGoogleMap handleAddress={handleAddress} cps={cps} />
    </div>
  );
}

async function getCPs() {
  /*
  const { data: cps, error: cpsERror } = await supabase
    .from("consumption_points")
    .select(
      `
          *,
        cp_fixed (
          *
        ),
        cp_mobile (
          *
        )
    `
    );
  if (cpsERror) throw cpsERror;

  return cps as IConsumptionPoints[];
  */
}
