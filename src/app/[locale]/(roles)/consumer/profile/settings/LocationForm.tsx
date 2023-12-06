"use client";

import _ from "lodash";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useAuth } from "../../../../Auth/useAuth";
import { Button } from "../../../../components/common/Button";
import { Spinner } from "../../../../components/common/Spinner";
import { IProfileLocation } from "../../../../../../lib/types";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { DisplayInputError } from "../../../../components/common/DisplayInputError";

interface FormProps {
  addressName: string;
  addressLastname: string;
  addressDoc: string;
  addressCompany: string;
  addressPhone: string;
  address1: string;
  address2: string;
  addressPC: number;
  addressTown: string;
  addressCountry: string;
  addressProvince: string;
}

interface Props {
  profile_location: IProfileLocation;
}

export function LocationForm({ profile_location }: Props) {
  const t = useTranslations();
  const { user, supabase } = useAuth();

  const [loading, setLoading] = useState(false);

  const {
    id: profile_location_id,
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
  } = profile_location ?? {};

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormProps>({
    mode: "onSubmit",
    defaultValues: {
      addressName: name,
      addressLastname: lastname,
      addressDoc: document_id,
      addressCompany: company,
      addressPhone: phone,
      address1: address_1,
      address2: address_2,
      addressPC: postalcode,
      addressTown: town,
    },
  });

  const [addressCountry, setAddressCountry] = useState(country);
  const [addressProvince, setAddressProvince] = useState(province);

  const selectCountry = (val: string) => {
    setAddressCountry(val);
  };

  const selectRegion = (val: string) => {
    setAddressProvince(val);
  };

  const onSubmit = async (formValues: FormProps) => {
    setLoading(true);

    const {
      addressName,
      addressLastname,
      addressDoc,
      addressCompany,
      addressPhone,
      address1,
      address2,
      addressPC,
      addressTown,
    } = formValues;

    setTimeout(async () => {
      if (
        _.isNull(profile_location_id) ||
        _.isUndefined(profile_location_id) ||
        profile_location_id === ""
      ) {
        const { error } = await supabase.from("profile_location").insert([
          {
            name: addressName,
            lastname: addressLastname,
            document_id: addressDoc,
            company: addressCompany,
            phone: addressPhone,
            address_1: address1,
            address_2: address2,
            postalcode: addressPC,
            town: addressTown,
            country: addressCountry,
            province: addressProvince,
            owner_id: user?.id,
          },
        ]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("profile_location")
          .update({
            name: addressName,
            lastname: addressLastname,
            document_id: addressDoc,
            company: addressCompany,
            phone: addressPhone,
            address_1: address1,
            address_2: address2,
            postalcode: addressPC,
            town: addressTown,
            country: addressCountry,
            province: addressProvince,
          })
          .eq("id", profile_location_id);

        if (error) throw error;
      }

      setLoading(false);
    }, 700);
  };

  return (
    <section id="location_data" className="mb-4 space-y-3 bg-white px-6 py-4">
      <h2 id="location-data-title" className="text-2xl">
        {t("location")}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-2">
        <div className="flex w-full flex-row space-x-3 ">
          <div className="w-full ">
            <label htmlFor="address_name" className="text-sm text-gray-600">
              {t("loc_name")}
            </label>

            <input
              type="text"
              id="address_name"
              placeholder="Alberto"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              {...register("addressName", { required: true })}
            />

            {errors.addressName && (
              <DisplayInputError message={errors.addressName.message} />
            )}
          </div>

          <div className="w-full ">
            <label htmlFor="address_lastname" className="text-sm text-gray-600">
              {t("lastname")}
            </label>

            <input
              type="text"
              id="address_lastname"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              {...register("addressLastname", { required: true })}
            />

            {errors.addressLastname && (
              <DisplayInputError message={errors.addressLastname.message} />
            )}
          </div>
        </div>

        <div className="flex w-full flex-row space-x-3">
          <div className="space-y w-full">
            <label htmlFor="address_doc" className="text-sm text-gray-600">
              {t("document_id")}
            </label>

            <input
              type="text"
              id="address_doc"
              placeholder="00112233-R"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              {...register("addressDoc", { required: true })}
            />

            {errors.addressDoc && (
              <DisplayInputError message={errors.addressDoc.message} />
            )}
          </div>

          <div className="w-full">
            <label htmlFor="lastname" className="text-sm text-gray-600">
              {t("loc_company")}
            </label>

            <input
              type="text"
              id="addressCompany"
              placeholder="Empresa 2000 SL"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              {...register("addressCompany")}
            />
          </div>

          <div className="w-full">
            <label htmlFor="address_phone" className="text-sm text-gray-600">
              {t("loc_phone")}
            </label>

            <input
              type="text"
              id="addressPhone"
              placeholder="+34 685 222 222"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              {...register("addressPhone", { required: true })}
            />

            {errors.addressPhone && (
              <DisplayInputError message={errors.addressPhone.message} />
            )}
          </div>
        </div>

        <div className="flex">
          <div className="w-full">
            <label htmlFor="address1" className="text-sm text-gray-600">
              {t("loc_location")}
            </label>

            <input
              type="text"
              id="address1"
              placeholder="Calle España 123"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              {...register("address1", { required: true })}
            />

            {errors.address1 && (
              <DisplayInputError message={errors.address1.message} />
            )}
          </div>
        </div>

        <div className="flex">
          <div className="w-full">
            <label htmlFor="address2" className="text-sm text-gray-600">
              {t("loc_location")}
            </label>

            <input
              type="text"
              id="address2"
              placeholder=" - "
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              {...register("address2")}
            />

            {errors.address2 && (
              <DisplayInputError message={errors.address2.message} />
            )}
          </div>
        </div>

        <div className="flex flex-row space-x-3">
          <div className="w-full">
            <label htmlFor="addressPC" className="text-sm text-gray-600">
              {t("loc_pc")}
            </label>

            <input
              type="number"
              id="addressPC"
              placeholder="27018"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              {...register("addressPC", { required: true })}
            />

            {errors.addressPC && (
              <DisplayInputError message={errors.addressPC.message} />
            )}
          </div>

          <div className="w-full">
            <label htmlFor="addressTown" className="text-sm text-gray-600">
              {t("loc_town")}
            </label>

            <input
              type="text"
              id="addressTown"
              placeholder="Madrid"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              {...register("addressTown", {
                required: true,
              })}
            />

            {errors.addressTown && (
              <DisplayInputError message={errors.addressTown.message} />
            )}
          </div>
        </div>

        <div className="flex flex-row items-end space-x-3">
          <div className="w-full">
            <label htmlFor="addressCountry" className="text-sm text-gray-600">
              {t("loc_country")}
            </label>

            <CountryDropdown
              classes="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              value={addressCountry}
              onChange={(val) => selectCountry(val)}
            />

            {errors.addressCountry && (
              <DisplayInputError message={errors.addressCountry.message} />
            )}
          </div>

          <div className="w-full">
            <label htmlFor="addressProvince" className="text-sm text-gray-600">
              {t("loc_province")}
            </label>

            <RegionDropdown
              classes="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              country={addressCountry}
              value={addressProvince}
              onChange={(val) => selectRegion(val)}
            />

            {errors.addressProvince && (
              <DisplayInputError message={errors.addressProvince.message} />
            )}
          </div>
        </div>

        {loading && (
          <Spinner color="beer-blonde" size={"xLarge"} absolute center />
        )}

        <Button primary medium btnType={"submit"} disabled={loading}>
          {t("save")}
        </Button>
      </form>
    </section>
  );
}
