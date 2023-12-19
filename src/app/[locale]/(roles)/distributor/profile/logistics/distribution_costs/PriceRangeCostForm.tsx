"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../../components/common/Button";
import { useFieldArray } from "react-hook-form";
import { z, ZodType } from "zod";
import { PriceRangeCostFormData } from "../../../../../../../lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DisplayInputError } from "../../../../../components/common/DisplayInputError";
import { DeleteButton } from "../../../../../components/common/DeleteButton";

const schema: ZodType<PriceRangeCostFormData> = z.object({
  distribution_range_cost: z.array(
    z.object({
      lower: z.number().positive({ message: "errors.input_min_0" }),
      upper: z.number().positive({ message: "errors.input_min_0" }),
      shippingCost: z.number().positive({ message: "errors.input_min_0" }),
    })
  ),
});

type ValidationSchema = z.infer<typeof schema>;

/* Tarifa de envío por rango de coste del pedido */
const PriceRangeCostForm: React.FC = () => {
  const t = useTranslations();

  // TODO: Mejorarlo usando useForm y useFieldArray de react-hook-form
  // TODO: Añadir validaciones
  const {
    control,
    register,
    formState: { errors },
  } = useForm<ValidationSchema>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: {
      distribution_range_cost: [
        {
          lower: 0,
          upper: 0,
          shippingCost: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "distribution_range_cost",
    control,
  });

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // const newPriceRanges = [...priceRanges];
    // newPriceRanges[index] = {
    //   ...newPriceRanges[index],
    //   [event.target.name]: parseFloat(event.target.value),
    // };
    // setPriceRanges(newPriceRanges);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // event.preventDefault();
    // // Aquí enviarías los datos al servidor, por ejemplo usando fetch o Axios
    // console.log(priceRanges);
  };

  const addPriceRange = () => {
    append({ lower: 0, upper: 0, shippingCost: 0 });
  };

  const removePriceRange = (index: number) => {
    remove(index);
  };

  return (
    <form onSubmit={handleSubmit} className="round-xl border p-4">
      <fieldset className="w-full space-y-4 rounded-xl border border-beer-softBlondeBubble border-b-gray-200 bg-beer-foam p-4">
        <legend className="text-2xl font-medium text-beer-dark">
          {t("distribution_cost")}
        </legend>

        <Button
          btnType="submit"
          // onClick={handleSubmit(onSubmit)}
          class=""
          primary
          medium
        >
          {t("save")}
        </Button>

        {fields.map((priceRange, index) => (
          <div key={index} className="mb-4">
            <fieldset className="mr-2 flex gap-4 rounded-xl border p-2">
              <legend className=" text-gray-600">
                Franja de Precio {index + 1}
              </legend>

              <label className="">
                {t("lower_limit") + " (€)"}

                <input
                  type="number"
                  {...register(`distribution_range_cost.${index}.lower`, {
                    required: true,
                    valueAsNumber: true,
                  })}
                  placeholder="Límite superior"
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                  min={0}
                />
              </label>

              <label className="">
                {t("upper_limit") + " (€)"}
                <input
                  type="number"
                  {...register(`distribution_range_cost.${index}.upper`, {
                    required: true,
                    valueAsNumber: true,
                  })}
                  placeholder="Costo de envío"
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                />
              </label>

              <label className="">
                {t("shipping_cost") + " (€)"}
                <input
                  type="number"
                  {...register(
                    `distribution_range_cost.${index}.shippingCost`,
                    {
                      required: true,
                      valueAsNumber: true,
                    }
                  )}
                  placeholder="Límite inferior"
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                  min={0}
                />
              </label>

              <div className="align-end flex items-end">
                <DeleteButton onClick={() => removePriceRange(index)} />
              </div>
            </fieldset>

            {errors.distribution_range_cost &&
              errors.distribution_range_cost[index] && (
                <DisplayInputError
                  message={errors.distribution_range_cost[index]?.message}
                />
              )}
          </div>
        ))}

        <Button onClick={addPriceRange} btnType={"button"} accent small>
          Añadir Franja de Precio
        </Button>
      </fieldset>
    </form>
  );
};

export default PriceRangeCostForm;
