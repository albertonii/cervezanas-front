"use client";

import React from "react";
import MonthlyBeers from "./homepage/MonthlyBeers";
import { useAuth } from "./Auth/useAuth";
import { Hero } from "./homepage/Hero";
import { IMonthlyProduct } from "../../lib/types.d";
import useIsInsideCommunity from "../../hooks/ds/useIsInsideCommunity";

interface Props {
  monthlyProducts: IMonthlyProduct[];
}

export default function Homepage({ monthlyProducts }: Props) {
  const { initial } = useAuth();
  const { data } = useIsInsideCommunity("madrid", "-3.679749", "40.381347");

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
