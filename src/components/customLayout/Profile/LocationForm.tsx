import React, { useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "../../common";

interface FormProps {
  addressName: string;
  addressLastname: string;
  addressDoc: string;
  addressCompany: string;
  addressPhone: string;
  addressLocation: string;
  addressPC: string;
  addressTown: string;
  addressCountry: string;
  addressProvince: string;
}

export function LocationForm() {
  const { t } = useTranslation();

  const {
    formState: { errors },
    watch,
    handleSubmit,
    register,
    reset,
  } = useForm<FormProps>({
    mode: "onSubmit",
    defaultValues: {
      addressName: "",
      addressLastname: "",
      addressDoc: "",
      addressCompany: "",
      addressPhone: "",
      addressLocation: "",
      addressPC: "",
      addressTown: "",
    },
  });

  const [addressCountry, setAddressCountry] = useState("");
  const [addressProvince, setAddressProvince] = useState("");

  const selectCountry = (val: string) => {
    setAddressCountry(val);
  };

  const selectRegion = (val: string) => {
    setAddressProvince(val);
  };

  const onSubmit = async (formValues: FormProps) => {
    try {
      const {
        addressName,
        addressLastname,
        addressDoc,
        addressCompany,
        addressPhone,
        addressLocation,
        addressPC,
        addressTown,
      } = formValues;

      reset();
    } catch (error) {
    } finally {
    }
  };

  return (
    <div
      id="location_data"
      className="container px-6 py-4 bg-white space-y-3 mb-4"
    >
      <div id="location-data-title" className="text-2xl">
        {t("location")}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}></form>
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
            {...register("addressName")}
          />
        </div>

        <div className="w-full ">
          <label htmlFor="address_lastname" className="text-sm text-gray-600">
            {t("lastname")}
          </label>
          <input
            type="text"
            id="address_lastname"
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
            {...register("addressLastname")}
          />
        </div>
      </div>

      <div className="flex w-full flex-row space-x-3">
        <div className="w-full space-y">
          <label htmlFor="address_doc" className="text-sm text-gray-600">
            {t("document_id")}
          </label>
          <input
            type="text"
            id="address_doc"
            placeholder="00112233-R"
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
            {...register("addressDoc")}
          />
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
            {...register("addressPhone")}
          />
        </div>
      </div>

      <div className="flex">
        <div className="w-full">
          <label htmlFor="addressLocation" className="text-sm text-gray-600">
            {t("loc_location")}
          </label>
          <input
            type="text"
            id="addressLocation"
            placeholder="Calle España 123"
            required
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
            {...register("addressLocation")}
          />
        </div>
      </div>

      <div className="flex flex-row space-x-3">
        <div className="w-full">
          <label htmlFor="addressPC" className="text-sm text-gray-600">
            {t("loc_pc")}
          </label>
          <input
            type="text"
            id="addressPC"
            placeholder="27018"
            required
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
            {...register("addressPC")}
          />
        </div>

        <div className="w-full">
          <label htmlFor="addressTown" className="text-sm text-gray-600">
            {t("loc_town")}
          </label>
          <input
            type="text"
            id="addressTown"
            placeholder="Madrid"
            required
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
            {...register("addressTown")}
          />
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
        </div>

        <div className="pl-12 ">
          <Button medium class={""}>
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
}
