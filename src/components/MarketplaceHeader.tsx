import React from "react";
import { Filters } from "./Filters";

interface Props {
  changeFilters: (filters: any) => void;
}

export function MarketplaceHeader({ changeFilters }: Props) {
  return (
    <div className="my-8 ">
      <Filters changeFilters={changeFilters} />
    </div>
  );
}
