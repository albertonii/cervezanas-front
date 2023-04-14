import React from "react";
import MonthlyCardItem from "./MonthlyCardItem";
import { Product } from "../../lib/types";

interface Props {
  monthlyProducts: Product[];
}

export default function MonthlyBeers({ monthlyProducts }: Props) {
  if (monthlyProducts.length === 0) return null;
  console.log(monthlyProducts);
  return (
    <div className="w-100% h-[150vh] bg-beer-foam flex justify-center pt-56 ">
      <div className="container ">
        {/* Copywriting  */}
        <div className="flex flex-col space-y-6">
          {/* Title  */}
          <div className="text-4xl text-beer-draft">
            Selección Cervezanas del mes
          </div>

          {/* Subtitle  */}
          <div className="text-xl text-beer-dark">
            Cada mes te presentamos aquellas cervezas que han conseguido ser
            aptas para los certificados de calidad que emitimos desde
            Cervezanas. Dando visibilidad a aquella seleccionada por nuestra
            comunidad de Cervezanos, el comité de expertos y la más atrevida y
            experimental.
          </div>

          {/* Cards  */}
          <div className="grid grid-cols-3 grid-gap-4">
            {monthlyProducts.map((product) => (
              <div key={product.id} className="">
                <MonthlyCardItem product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
