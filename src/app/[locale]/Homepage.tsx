"use client";

import React from "react";
import MonthlyBeers from "./homepage/MonthlyBeers";
import { useAuth } from "./Auth/useAuth";
import { Hero } from "./homepage/Hero";
import { IMonthlyProduct } from "../../lib/types";

interface Props {
  monthlyProducts: IMonthlyProduct[];
}

export default function Homepage({ monthlyProducts }: Props) {
  const { initial } = useAuth();
  if (initial) {
    return <div className="card h-72">Loading...</div>;
  }

  return (
    <div className="h-full ">
      <Hero />
      <MonthlyBeers monthlyProducts={monthlyProducts} />
    </div>
  );
}
