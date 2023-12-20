"use client";

import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../../../../../components/common/Button";
import { useFieldArray } from "react-hook-form";
import { z, ZodType } from "zod";
import { PriceRangeCostFormData } from "../../../../../../../lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DisplayInputError } from "../../../../../components/common/DisplayInputError";
import PriceRangeRow from "./PriceRangeRow";

const rangeObjectSchema = z
  .object({
    lower: z.number().min(0, { message: "errors.input_min_0" }),
    upper: z.number().min(0, { message: "errors.input_min_0" }),
    shippingCost: z.number().min(0, { message: "errors.input_min_0" }),
  })
  .refine((data) => data.lower < data.upper, {
    message: "errors.lower_greater_than_upper",
    path: ["upper"],
  });

const schema: ZodType<PriceRangeCostFormData> = z.object({
  distribution_range_cost: z.array(rangeObjectSchema).refine(
    (
      ranges: {
        lower: number;
        upper: number;
        shippingCost: number;
      }[]
    ) => {
      // Validar que cada rango esté correctamente definido
      for (let i = 0; i < ranges.length; i++) {
        if (ranges[i].lower >= ranges[i].upper) {
          return false;
        }
        if (i > 0 && ranges[i].lower <= ranges[i - 1].upper) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Cada rango debe ser válido y escalonado correctamente",
    }
  ),
});

export type PriceRangeCostFormValidationSchema = z.infer<typeof schema>;

/* Tarifa de envío por rango de coste del pedido */
const PriceRangeCostForm: React.FC = () => {
  const t = useTranslations();

  const [priceRanges, setPriceRanges] = React.useState<
    PriceRangeCostFormData["distribution_range_cost"]
  >([]);

  const form = useForm<PriceRangeCostFormValidationSchema>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: {
      distribution_range_cost: [],
    },
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = form;

  const { fields, append, remove } = useFieldArray({
    name: "distribution_range_cost",
    control,
  });

  const handleInputLowerChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRanges = [...priceRanges];
    newRanges[index] = {
      ...newRanges[index],
      lower: event.target.valueAsNumber,
    };
    setPriceRanges(newRanges);
  };

  const handleInputUpperChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRanges = [...priceRanges];
    newRanges[index] = {
      ...newRanges[index],
      upper: event.target.valueAsNumber,
    };
    setPriceRanges(newRanges);
  };

  const handleInputCostChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRanges = [...priceRanges];
    newRanges[index] = {
      ...newRanges[index],
      shippingCost: event.target.valueAsNumber,
    };
    setPriceRanges(newRanges);
  };

  const onSubmit: SubmitHandler<PriceRangeCostFormValidationSchema> = (
    formValues: FormData
  ) => {
    console.log(formValues);
  };

  const addPriceRange = () => {
    append({ lower: 0, upper: 0, shippingCost: 0 });
    setPriceRanges([...priceRanges, { lower: 0, upper: 0, shippingCost: 0 }]);
  };

  const removePriceRange = (index: number) => {
    remove(index);
    setPriceRanges(priceRanges.filter((_, i) => i !== index));
  };

  return (
    <section className="flex flex-col items-start space-y-4 rounded-xl border border-beer-softBlondeBubble border-b-gray-200 bg-beer-foam p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Button
          btnType="submit"
          onClick={handleSubmit(onSubmit)}
          class=""
          primary
          medium
        >
          {t("save")}
        </Button>

        {
          // Display the error message if the array of ranges is not valid
          errors.distribution_range_cost && (
            <DisplayInputError
              message={errors.distribution_range_cost.root?.message}
            />
          )
        }

        {fields.map((_, index) => (
          <div key={index} className="mb-4">
            <PriceRangeRow
              index={index}
              form={form}
              removePriceRange={removePriceRange}
              handleInputLowerChange={handleInputLowerChange}
              handleInputUpperChange={handleInputUpperChange}
              handleInputCostChange={handleInputCostChange}
            />
          </div>
        ))}

        <Button onClick={addPriceRange} btnType={"button"} accent small>
          Añadir Franja de Precio
        </Button>
      </form>

      {/* Minimalistic and simple table displaying all the ranges and costs. Información obtenida del array registrado en "distribution_range_cost*/}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="border-b-2 border-gray-300 px-6 py-3 text-left leading-4 tracking-wider text-beer-draft">
              Límite inferior
            </th>
            <th className="border-b-2 border-gray-300 px-6 py-3 text-left leading-4 tracking-wider text-beer-draft">
              Límite superior
            </th>
            <th className="border-b-2 border-gray-300 px-6 py-3 text-left leading-4 tracking-wider text-beer-draft">
              Coste de Envío
            </th>
          </tr>
        </thead>

        <tbody>
          {priceRanges.map((range, index) => (
            <tr key={index}>
              <td className="whitespace-no-wrap border-b border-gray-500 px-6 py-4">
                {range.lower} €
              </td>
              <td className="whitespace-no-wrap border-b border-gray-500 px-6 py-4">
                {range.upper} €
              </td>
              <td className="whitespace-no-wrap border-b border-gray-500 px-6 py-4">
                {range.shippingCost} €
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default PriceRangeCostForm;
