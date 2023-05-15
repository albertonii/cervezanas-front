import React from "react";
import { Hero } from "../components/homepage";
import MonthlyBeers from "../components/homepage/MonthlyBeers";
import { IMonthlyProduct } from "../lib/types.d";

interface Props {
  monthlyProducts: IMonthlyProduct[];
}

export default function Homepage({ monthlyProducts }: Props) {
  return (
    <div className="mt-[10vh] h-full ">
      <Hero />
      <MonthlyBeers monthlyProducts={monthlyProducts} />
    </div>
  );
}
