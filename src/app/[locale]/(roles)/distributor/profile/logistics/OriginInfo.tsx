import Label from "../../../../components/Label";
import InputForm from "../../../../components/InputForm";
import React from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { Button } from "../../../../components/common/Button";
import { DisplayInputError } from "../../../../components/common/DisplayInputError";

interface FormData {
  id: string;
  created_at: string;
  name: string;
  lastname: string;
  document_id: string;
  company: string;
  phone: string;
  postalcode: number;
  country: string;
  province: string;
  town: string;
  address_1: string;
  address_2: string;
}

export default function OriginInfo() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const form = useForm<FormData>();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = form;

  if (!form) return <></>;

  // const handleOriginAddress = async (formValues: FormData) => {
  //   const {
  //     id,
  //     created_at,
  //     name,
  //     lastname,
  //     document_id,
  //     company,
  //     phone,
  //     postalcode,
  //     country,
  //     province,
  //     town,
  //     address_1,
  //     address_2,
  //   } = formValues;
  // };

  // const updOriginAddress = useMutation({
  //   mutationKey: ["updOriginAddress"],
  //   mutationFn: handleOriginAddress,
  //   onMutate: () => {
  //     console.info("mutating");
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["originAddress"] });
  //   },
  //   onError: (error: any) => {
  //     console.error(error);
  //   },
  // });

  // const onSubmit = (data: FormData) => {
  //   try {
  //     updOriginAddress.mutate(data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    // <form onSubmit={handleSubmit(onSubmit)}>
    <form>
      <fieldset className="w-full space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
        <legend className="text-2xl font-medium text-beer-dark">
          {t("origin_location")}
        </legend>

        {/* <Label>
            <InputForm register={register} inputName="name" required={true} />

            {errors.name && <DisplayInputError message={errors.name.message} />}
          </Label>

          <Label>
            <InputForm
              register={register}
              inputName="lastname"
              required={true}
            />

            {errors.lastname && (
              <DisplayInputError message={errors.lastname.message} />
            )}
          </Label>

          <Label>
            <InputForm
              register={register}
              inputName="document_id"
              required={true}
            />

            {errors.document_id && (
              <DisplayInputError message={errors.document_id.message} />
            )}
          </Label>

          <Label>
            <InputForm
              register={register}
              inputName="phone"
              required={true}
              type={"tel"}
            />

            {errors.phone && (
              <DisplayInputError message={errors.phone.message} />
            )}
          </Label>

          <Label>
            <InputForm
              register={register}
              inputName="address_1"
              placeholder="address"
              required={true}
            />

            {errors.address_1 && (
              <DisplayInputError message={errors.address_1.message} />
            )}
          </Label>

          <Label>
            <InputForm register={register} inputName="town" required={true} />

            {errors.town && <DisplayInputError message={errors.town.message} />}
          </Label>

          <Label>
            <InputForm
              register={register}
              inputName="province"
              required={true}
            />

            {errors.province && (
              <DisplayInputError message={errors.province.message} />
            )}
          </Label>

          <Label>
            <InputForm
              register={register}
              inputName="country"
              required={true}
            />

            {errors.country && (
              <DisplayInputError message={errors.country.message} />
            )}
          </Label> */}
        {/* 
          <InputForm
            register={register}
            inputName="postalcode"
            placeholder="postal_code"
            required={true}
            id="postalcode"
          /> */}

        <label htmlFor="postalcode">{t("postalcode")}</label>
        {/* <input
            className="rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 text-xl focus:border-beer-blonde focus:outline-none"
            {...register("postalcode", { required: true, valueAsNumber: true })}
          /> */}

        <input
          id="postalcode"
          type="text"
          placeholder="user@cervezanas.com"
          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
        />

        {errors.postalcode && (
          <DisplayInputError message={errors.postalcode.message} />
        )}
      </fieldset>
    </form>
  );
}
