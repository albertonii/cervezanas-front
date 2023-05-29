"use client";

import React from "react";
import { useAuth } from "../../components/Auth";
import { Hero } from "../../components/homepage";
import MonthlyBeers from "../../components/homepage/MonthlyBeers";
import { IMonthlyProduct } from "../../lib/types.d";

interface Props {
  monthlyProducts: IMonthlyProduct[];
}

export default function Homepage({ monthlyProducts }: Props) {
  const { initial } = useAuth();

  if (initial) {
    return <div className="card h-72">Loading...</div>;
  }

  return (
    <div className="mt-[10vh] h-full ">
      <Hero />
      <MonthlyBeers monthlyProducts={monthlyProducts} />
    </div>
  );
}
