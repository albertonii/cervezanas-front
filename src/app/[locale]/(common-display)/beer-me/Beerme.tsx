import React from "react";
import BMGoogleMap from "../../components/BMGoogleMap";
import { IConsumptionPoints } from "../../../../lib/types.d";

interface Props {
  cps: IConsumptionPoints[];
}

export default function Beerme({ cps }: Props) {
  return (
    <div className="mx-auto sm:py-2 lg:py-3">
      <BMGoogleMap cps={cps} />
    </div>
  );
}
