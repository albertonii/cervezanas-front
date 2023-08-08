import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { Button, DisplayInputError } from "../../../../../../components/common";
import InputForm from "../../../../components/InputForm";
import Label from "../../../../components/Label";

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
        <legend className="text-2xl">{t("origin_location")}</legend>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
          <Label>
            <InputForm register={register} inputName="name" required={true} />

            {errors.name?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </Label>

          <Label>
            <InputForm
              register={register}
              inputName="lastname"
              required={true}
            />

            {errors.lastname?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </Label>

          <Label>
            <InputForm
              register={register}
              inputName="document_id"
              required={true}
            />

            {errors.document_id?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </Label>

          <Label>
            <InputForm
              register={register}
              inputName="phone"
              required={true}
              type={"tel"}
            />

            {errors.phone?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </Label>

          <Label>
            <InputForm
              register={register}
              inputName="address_1"
              required={true}
            />

            {errors.address_1?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </Label>

          <Label>
            <InputForm register={register} inputName="town" required={true} />

            {errors.town?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </Label>

          <Label>
            <InputForm
              register={register}
              inputName="province"
              required={true}
            />

            {errors.province?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </Label>

          <Label>
            <InputForm
              register={register}
              inputName="country"
              required={true}
            />

            {errors.country?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </Label>

          <Label>
            <InputForm
              register={register}
              inputName="postalcode"
              required={true}
            />

            {errors.postalcode?.type === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </Label>
        </div>

        <Button btnType="submit" class="" primary medium>
          {t("save")}
        </Button>
      </fieldset>
    </form>
  );
}
