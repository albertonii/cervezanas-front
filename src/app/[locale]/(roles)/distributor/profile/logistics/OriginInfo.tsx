import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { Button, DisplayInputError } from "../../../../../../components/common";

interface FormData {
  id: string;
  created_at: Date;
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

  const handleOriginAddress = async (formValues: FormData) => {
    const {
      id,
      created_at,
      name,
      lastname,
      document_id,
      company,
      phone,
      postalcode,
      country,
      province,
      town,
      address_1,
      address_2,
    } = formValues;
  };

  const updOriginAddress = useMutation({
    mutationKey: ["updOriginAddress"],
    mutationFn: handleOriginAddress,
    onMutate: () => {
      console.info("mutating");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["originAddress"] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });

  const onSubmit = (data: FormData) => {
    try {
      updOriginAddress.mutate(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="w-full space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
        <legend className="m-2 text-2xl">{t("origin_location")}</legend>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
          <label className="my-3 flex h-12 flex-col items-start space-y-2 rounded border border-bear-alvine ">
            <input
              {...register("name", { required: true })}
              className="mr-6 w-full px-3 focus:outline-none"
              placeholder={`${t("name")}*`}
              required
            />

            {errors.name?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </label>

          <label className="space-y-2rounded my-3 flex h-12 flex-col items-start  border border-bear-alvine ">
            <input
              {...register("lastname", { required: true })}
              className="mr-6 w-full px-3 focus:outline-none"
              placeholder={`${t("lastname")}*`}
              required
            />
            {errors.lastname?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </label>

          <label className="space-y-2rounded my-3 flex h-12 flex-col items-start  border border-bear-alvine ">
            <input
              {...register("document_id", { required: true })}
              className="mr-6 w-full px-3 focus:outline-none"
              placeholder={`${t("document_id")}*`}
            />
            {errors.document_id?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </label>

          <label className="my-3 flex h-12 flex-col items-start space-y-2 rounded border border-bear-alvine ">
            <input
              {...register("phone", { required: true })}
              type="tel"
              className="mr-6 w-full border-none px-3 focus:outline-none"
              placeholder={`${t("loc_phone")}*`}
            />
            {errors.phone?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </label>

          <label className="my-3 flex h-12 flex-col items-start space-y-2 rounded border border-bear-alvine ">
            <input
              {...register("address_1", { required: true })}
              className="mr-6 w-full px-3 focus:outline-none"
              placeholder={`${t("address_1")}*`}
              required
            />

            {errors.address_1?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </label>

          <label className="space-y-2rounded my-3 flex h-12 flex-col items-start  border border-bear-alvine ">
            <input
              {...register("town", { required: true })}
              className="mr-6 w-full px-3 focus:outline-none"
              placeholder={`${t("town")}*`}
              required
            />
            {errors.town?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </label>

          <label className="space-y-2rounded my-3 flex h-12 flex-col items-start  border border-bear-alvine ">
            <input
              {...register("province", { required: true })}
              className="mr-6 w-full px-3 focus:outline-none"
              placeholder={`${t("province")}*`}
            />
            {errors.province?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </label>

          <label className="my-3 flex h-12 flex-col items-start space-y-2 rounded border border-bear-alvine ">
            <input
              {...register("country", { required: true })}
              type="tel"
              className="mr-6 w-full border-none px-3 focus:outline-none"
              placeholder={`${t("country")}*`}
            />
            {errors.country?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </label>

          <label className="flex h-12 flex-col items-start space-y-2 rounded  border border-bear-alvine">
            <input
              {...register("postalcode", { required: true })}
              className="mr-6 w-full px-3 focus:outline-none"
              placeholder={`${t("postalcode")}*`}
              required
            />

            {errors.postalcode?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </label>
        </div>

        <Button btnType="submit" class="" primary medium>
          {t("save")}
        </Button>
      </fieldset>
    </form>
  );
}
