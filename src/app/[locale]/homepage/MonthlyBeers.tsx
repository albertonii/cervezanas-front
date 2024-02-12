'use client';

import React from 'react';
import MonthlyCardItem from './MonthlyCardItem';
import { IMonthlyProduct } from '../../../lib/types';
import Image from 'next/image';

interface Props {
  monthlyProducts: IMonthlyProduct[];
}

export default function MonthlyBeers({ monthlyProducts }: Props) {
  if (monthlyProducts.length === 0 || !monthlyProducts) return null;

  return (
    <section className="relative -top-12 m-auto w-full max-w-screen-2xl justify-center bg-cerv-titlehigh p-5">
      <div className="absolute right-0 h-[600px] w-[600px] bg-[url('/assets/rec-graF3.webp')] bg-contain bg-right-top bg-no-repeat opacity-20 mix-blend-multiply"></div>
      <header className="relative z-10 text-3xl font-bold text-white md:text-5xl">
        SELECCIÓN CERVEZANA DEL MES
        <Image
          src="/assets/detalle-w.svg"
          width="160"
          height="160"
          className="float-left m-auto p-3"
          alt="Decorador de la sección de selección cervezana del mes"
        />
      </header>

      <p className="relative z-10 w-full pb-6 pt-6 text-cerv-cream lg:w-8/12">
        Cada mes te presentamos aquellas cervezas que han conseguido ser aptas
        para los certificados de calidad que emitimos desde Cervezanas. Dando
        visibilidad a aquella seleccionada por nuestra comunidad de Cervezanos,
        el comité de expertos y la más atrevida y experimental.
      </p>

      <div className="grid w-full grid-cols-3 rounded-lg ">
        {monthlyProducts.map((mProduct) => (
          <>
            <MonthlyCardItem mProduct={mProduct} key={mProduct.product_id} />
          </>
        ))}
      </div>
    </section>
  );
}
