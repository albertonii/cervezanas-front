'use client';

import Label from '../../../../components/Label';
import InputForm from '../../../../components/InputForm';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import Button from '../../../../components/common/Button';
import { DisplayInputError } from '../../../../components/common/DisplayInputError';

interface FormData {
  id: string;
  created_at: string;
  name: string;
  lastname: string;
  document_id: string;
  company: string;
  phone: string;
  postalcode: string;
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
          {t('origin_location')}
        </legend>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
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
            inputName="name"
            placeholder="name"
            required={true}
            register={register}
          /> */}
          {/* 
          <InputForm
            inputName="lastname"
            placeholder="lastname"
            required={true}
            register={register}
          />
*/}

          {/* TODO: Volver aquí para saber pq hay hydratation error  */}
          <InputForm
            inputName="postalcode"
            placeholder="postalcode"
            required={true}
            register={register}
          />
        </div>

        <Button btnType="submit" class="" primary medium>
          {t('save')}
        </Button>
      </fieldset>
    </form>
  );
}
