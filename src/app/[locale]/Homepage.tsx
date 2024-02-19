'use client';

import React from 'react';
import MonthlyBeers from './homepage/MonthlyBeers';
import { useAuth } from './(auth)/Context/useAuth';
import { TopBeers } from './homepage/TopBeers';
import { Homeheader } from './homepage/Homeheader';
import { Highlights } from './homepage/Highlights';
import { MonthlyBeersDesign } from './homepage/MonthlyBeersDesign';
import { Community } from './homepage/Community';
import { Reviews } from './homepage/Reviews';
import { History } from './homepage/History';
import { IMonthlyProduct } from '../../lib/types';

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
      <Homeheader />
      <Highlights />
      <TopBeers />
      <History />
      <MonthlyBeersDesign />
      <Community />
      <Reviews />
      <MonthlyBeers monthlyProducts={monthlyProducts} />
    </div>
  );
}
