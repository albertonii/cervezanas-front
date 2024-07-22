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
import { IMonthlyProduct } from '@/lib//types/types';
import QRCode from 'react-qr-code';
import Spinner from './components/common/Spinner';

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
        <section className="h-full ">
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
