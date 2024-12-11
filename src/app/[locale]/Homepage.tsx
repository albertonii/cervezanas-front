'use client';

import React from 'react';
import Spinner from './components/ui/Spinner';
import MonthlyBeers from './homepage/MonthlyBeers';
import { Reviews } from './homepage/Reviews';
import { TopBeers } from './homepage/TopBeers';
import { Community } from './homepage/Community';
import { useAuth } from './(auth)/Context/useAuth';
import { Homeheader } from './homepage/Homeheader';
import { Highlights } from './homepage/Highlights';
import { IMonthlyProduct } from '@/lib/types/types';
import { SliderMobile } from './homepage/SliderMobile';

interface Props {
    monthlyProducts: IMonthlyProduct[];
}

export default function Homepage({ monthlyProducts }: Props) {
    const { initial } = useAuth();
    if (initial) {
        return (
            <div className="card h-72">
                <Spinner color="beer-blonde" size="fullScreen" />
            </div>
        );
    }

    return (
        <section className="h-full  bg-[url('/assets/home/bg-home.webp')] bg-auto bg-repeat bg-top">
            <SliderMobile />
            <Homeheader />
            <Highlights />
            <TopBeers />
            {/*  <History /> */}
            {/*  <MonthlyBeersDesign /> */}
            <MonthlyBeers monthlyProducts={monthlyProducts} />
            <Community />
            <Reviews />
        </section>
    );
}
