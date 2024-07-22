'use client';

import React from 'react';
import MonthlyCardItem from './MonthlyCardItem';
import { IMonthlyProduct } from '@/lib//types/types';

interface Props {
    monthlyProducts: IMonthlyProduct[];
}

export default function MonthlyBeers({ monthlyProducts }: Props) {
    if (monthlyProducts.length === 0 || !monthlyProducts) return null;

    return (
        <section className="w-100% flex h-full justify-center bg-beer-foam sm:h-full ">
            <div className="container p-4 sm:p-0">
                {/* Copywriting  */}
                <div className="flex flex-col space-y-6">
                    {/* Title  */}
                    <div className="text-3xl text-beer-draft sm:text-4xl">
                        Selección Cervezanas del mes
                    </div>

                    {/* Subtitle  */}
                    <div className="text-md text-beer-dark sm:text-xl">
                        Cada mes te presentamos aquellas cervezas que han
                        conseguido ser aptas para los certificados de calidad
                        que emitimos desde Cervezanas. Dando visibilidad a
                        aquella seleccionada por nuestra comunidad de
                        Cervezanos, el comité de expertos y la más atrevida y
                        experimental.
                    </div>

                    {/* Cards  */}
                    <div className="grid-gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        {/* {monthlyProducts.map((mProduct) => (
              <div key={mProduct.product_id}>
                <MonthlyCardItem mProduct={mProduct} />
              </div>
            ))} */}

                        <MonthlyCardItem mProduct={monthlyProducts[0]} />
                    </div>
                </div>
            </div>
        </section>
    );
}
