import { useTranslations } from "next-intl";
import React, { useState } from "react";
import PriceRangeCostForm from "./PriceRangeCostForm";

export default function DistributionCost() {
  const t = useTranslations();

  const [deliveryCostFlatRate, setDeliveryCostFlatRate] = useState<number>(0);

  const handleDeliveryCost = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryCostFlatRate(Number(e.target.value));
  };

  return (
    <>
      <section className="space-y-4">
        {/* Indicar el coste de distribución internacional por cada país y el coste de envío por cada país (si es diferente al coste de distribución) */}
        <label htmlFor="address_doc" className="text-sm text-gray-600">
          {t("international_distribution_flatrate_cost") + " (€)"}
        </label>

        <input
          type="number"
          id="address_doc"
          placeholder="10 €"
          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
          value={deliveryCostFlatRate}
          onChange={handleDeliveryCost}
          min={0}
          max={1000}
        />

        <PriceRangeCostForm />
      </section>

      {/* Tarifa de envío por franja de peso del pedido (kg) */}
      {/* Tarifa de envío por franja de volumen del pedido (m3) */}
      {/* Tarifa de envío por franja de unidades del pedido (unidades) */}
    </>
  );
}
