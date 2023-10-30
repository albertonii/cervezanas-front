"use client";

import React from "react";
import MonthlyBeers from "./homepage/MonthlyBeers";
import { useAuth } from "./Auth/useAuth";
import { Hero } from "./homepage/Hero";
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
