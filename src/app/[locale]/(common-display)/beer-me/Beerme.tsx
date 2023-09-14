import React from "react";
import { IConsumptionPoints } from "../../../../lib/types.d";
import BMGoogleMap from "../../components/BMGoogleMap";

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
