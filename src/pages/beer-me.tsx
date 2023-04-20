import React, { useState } from "react";
import BMGoogleMap from "../components/BMGoogleMap";
import { IConsumptionPoints } from "../lib/types";
import { supabase } from "../utils/supabaseClient";

interface Props {
  cps: IConsumptionPoints[];
}

export default function BeerMe({ cps }: Props) {
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

export async function getServerSideProps() {
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

  return {
    props: {
      cps,
    },
  };
}
