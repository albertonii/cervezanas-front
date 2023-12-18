import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface PriceRange {
  lower: number;
  upper: number;
  shippingCost: number;
}

const PriceRangeCostForm: React.FC = () => {
  const t = useTranslations();
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([
    { lower: 0, upper: 0, shippingCost: 0 },
  ]);

  // TODO: Mejorarlo usando useForm y useFieldArray de react-hook-form
  // TODO: Añadir validaciones

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPriceRanges = [...priceRanges];
    newPriceRanges[index] = {
      ...newPriceRanges[index],
      [event.target.name]: parseFloat(event.target.value),
    };
    setPriceRanges(newPriceRanges);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Aquí enviarías los datos al servidor, por ejemplo usando fetch o Axios
    console.log(priceRanges);
  };

  const addPriceRange = () => {
    setPriceRanges([...priceRanges, { lower: 0, upper: 0, shippingCost: 0 }]);
  };

  return (
    <form onSubmit={handleSubmit} className="round-xl border p-4">
      <span className="text-sm text-gray-600">
        {t("international_distribution_range_cost") + " (€)"}
      </span>

      {priceRanges.map((priceRange, index) => (
        <div key={index} className="col-span-3 mb-4 grid">
          <label className="col-span-12 mr-2">
            Franja de Precio {index + 1}
          </label>

          <fieldset className="mr-2">
            <legend className="text-sm text-gray-600">
              {t("lower_limit") + " (€)"}
            </legend>
            <input
              type="number"
              name="upper"
              value={priceRange.upper}
              onChange={(e) => handleInputChange(index, e)}
              placeholder="Límite superior"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              min={0}
            />
          </fieldset>

          <fieldset className="mr-2">
            <legend className="text-sm text-gray-600">
              {t("upper_limit") + " (€)"}
            </legend>
            <input
              type="number"
              name="shippingCost"
              value={priceRange.shippingCost}
              onChange={(e) => handleInputChange(index, e)}
              placeholder="Costo de envío"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              min={0}
            />
          </fieldset>

          <fieldset className="mr-2">
            <legend className="text-sm text-gray-600">
              {t("shipping_cost") + " (€)"}
            </legend>
            <input
              type="number"
              name="lower"
              value={priceRange.lower}
              onChange={(e) => handleInputChange(index, e)}
              placeholder="Límite inferior"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              min={0}
            />
          </fieldset>
        </div>
      ))}
      <button
        type="button"
        onClick={addPriceRange}
        className="mr-2 rounded bg-blue-500 p-2 text-white"
      >
        Añadir Franja de Precio
      </button>

      <button type="submit" className="rounded bg-green-500 p-2 text-white">
        {t("save")}
      </button>
    </form>
  );
};

export default PriceRangeCostForm;
