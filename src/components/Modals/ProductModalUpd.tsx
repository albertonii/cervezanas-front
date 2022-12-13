import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  aroma_options,
  color_options,
  era_options,
  family_options,
  fermentation_options,
  format_options,
  intensity_options,
  origin_options,
  product_type_options,
} from "../../lib/beerEnum";
import { supabase } from "../../utils/supabaseClient";

interface Props {
  isVisible: boolean;
  handleEditShowModal: React.Dispatch<React.SetStateAction<any>>;
  beer: {
    id: string;
    name: string;
    description: string;
    campaign: string;
    type: number;
    color: string;
    intensity: string;
    aroma: string;
    family: string;
    fermentation: string;
    origin: string;
    era: string;
    format: string;
    is_gluten: string;
    owner_id: string;
  };
}

const campaigns = [
  {
    label: "-",
    value: "-",
  },
  {
    label: "Campaign 1",
    value: "campaign_1",
  },
  {
    label: "Campaign 2",
    value: "campaign_2",
  },
];

type FormValues = {
  name: string;
  description: string;
  campaign: string;
  type: number;
  color: string;
  intensity: string;
  aroma: string;
  family: string;
  fermentation: string;
  origin: string;
  era: string;
  format: string;
  is_gluten: string;
  owner_id: string;
};

const ProductModalUpd = (props: Props) => {
  const { t } = useTranslation();
  const { isVisible, beer, handleEditShowModal } = props;

  const {
    id,
    name,
    description,
    campaign,
    type,
    color,
    intensity,
    aroma,
    family,
    fermentation,
    origin,
    era,
    format,
    is_gluten,
    owner_id,
  } = beer;

  const [showModal, setShowModal] = React.useState(isVisible);

  const {
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
    handleSubmit,
  } = useForm({
    defaultValues: {
      name,
      description,
      campaign,
      color,
      intensity,
      aroma,
      family,
      fermentation,
      origin,
      era,
      format,
      is_gluten,
      type,
      owner_id,
    },
  });

  const onSubmit = (formValues: FormValues) => {
    const handleUpdate = async () => {
      const {
        campaign,
        fermentation,
        color,
        intensity,
        aroma,
        family,
        origin,
        era,
        format,
        is_gluten,
        type,
      } = formValues;

      const { data, error } = await supabase
        .from("beers")
        .update({
          name: getValues("name"),
          description: getValues("description"),
          intensity: getValues("intensity"),
          fermentation: getValues("fermentation"),
          color: getValues("color"),
          aroma: getValues("aroma"),
          family: getValues("family"),
          origin: getValues("origin"),
          era: getValues("era"),
          format: getValues("format"),
          is_gluten: is_gluten === "true",
          type,
          campaign_id: campaign,
          awards_id: "",
          owner_id,
        })
        .eq("id", id);

      if (error) throw error;

      return data;
    };

    handleUpdate();
    setShowModal(false);
  };

  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none drop-shadow-md focus:outline-none">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      {t("modal_product_title")}
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>

                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <p className="my-4 text-slate-500 text-lg leading-relaxed">
                      {t("modal_product_description")}
                    </p>

                    <div className="w-full">
                      <label
                        htmlFor="product_type"
                        className="text-sm text-gray-600"
                      >
                        {t("product_type")}
                      </label>

                      <select
                        disabled
                        {...register("type")}
                        defaultValue={type}
                        className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      >
                        <option key={type} value={type}>
                          {t(product_type_options[type].value)}
                        </option>
                      </select>
                    </div>

                    <div className="flex w-full flex-row space-x-3 ">
                      <div className="w-full space-y">
                        <label
                          htmlFor="product_name"
                          className="text-sm text-gray-600"
                        >
                          {t("product_name")}
                        </label>
                        <input
                          type="text"
                          id="name"
                          placeholder="IPA Jaira"
                          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          {...register("name", {
                            required: true,
                          })}
                        />
                        {errors.name?.type === "required" && (
                          <p>{t("form_errors.product_modal_required")}</p>
                        )}
                        {errors.name?.type === "maxLength" && (
                          <p>{t("form_errors.product_modal_max_length")}</p>
                        )}
                      </div>

                      <div className="w-full ">
                        <label
                          htmlFor="campaign"
                          className="text-sm text-gray-600"
                        >
                          {t("select_campaign")}
                        </label>

                        <select
                          {...register("campaign")}
                          value={""}
                          className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          {campaigns.map((option) => (
                            <option key={option.value} value={option.label}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex w-full flex-row space-x-3 ">
                      <div className="w-full space-y">
                        <label
                          htmlFor="description"
                          className="text-sm text-gray-600"
                        >
                          {t("product_description")}
                        </label>
                        <textarea
                          id="description"
                          placeholder=""
                          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          {...register("description", {
                            required: true,
                          })}
                        />
                        {errors.description?.type === "required" && (
                          <p>{t("form_errors.product_modal_required")}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex w-full flex-row space-x-3 ">
                      <div className="w-full ">
                        <label
                          htmlFor="intensity"
                          className="text-sm text-gray-600"
                        >
                          {t("intensity")}
                        </label>

                        <select
                          {...register("intensity")}
                          defaultValue={intensity_options[0].label}
                          className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          {intensity_options.map((option) => (
                            <option
                              key={option.value}
                              value={option.label}
                              selected
                            >
                              {t(option.label)}
                            </option>
                          ))}
                        </select>

                        {errors.intensity?.type === "required" && (
                          <p>{t("form_errors.product_modal_required")}</p>
                        )}
                      </div>

                      <div className="w-full ">
                        <label
                          htmlFor="fermentation"
                          className="text-sm text-gray-600"
                        >
                          {t("fermentation")}
                        </label>

                        <select
                          {...register("fermentation")}
                          defaultValue={fermentation_options[0].label}
                          className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          {fermentation_options.map((option) => (
                            <option key={option.value} value={option.label}>
                              {t(option.label)}
                            </option>
                          ))}
                        </select>
                        {errors.fermentation?.type === "required" && (
                          <p>{t("form_errors.product_modal_required")}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex w-full flex-row space-x-3 ">
                      <div className="w-full ">
                        <label
                          htmlFor="color"
                          className="text-sm text-gray-600"
                        >
                          {t("color")}
                        </label>

                        <select
                          {...register("color")}
                          className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          {color_options.map((option) => (
                            <option
                              key={option.value}
                              value={option.label}
                              selected
                            >
                              {t(option.label)}
                            </option>
                          ))}
                        </select>

                        {errors.color?.type === "required" && (
                          <p>{t("form_errors.product_modal_required")}</p>
                        )}
                      </div>

                      <div className="w-full ">
                        <label
                          htmlFor="origin"
                          className="text-sm text-gray-600"
                        >
                          {t("origin")}
                        </label>

                        <select
                          {...register("origin")}
                          defaultValue={origin_options[0].label}
                          className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          {origin_options.map((option) => (
                            <option key={option.value} value={option.label}>
                              {t(option.label)}
                            </option>
                          ))}
                        </select>
                        {errors.origin?.type === "required" && (
                          <p>{t("form_errors.product_modal_required")}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex w-full flex-row space-x-3 ">
                      <div className="w-full ">
                        <label
                          htmlFor="family"
                          className="text-sm text-gray-600"
                        >
                          {t("family")}
                        </label>

                        <select
                          {...register("family")}
                          defaultValue={family_options[0].label}
                          className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          {family_options.map((option) => (
                            <option
                              key={option.value}
                              value={option.label}
                              selected
                            >
                              {t(option.label)}
                            </option>
                          ))}
                        </select>

                        {errors.family?.type === "required" && (
                          <p>{t("form_errors.product_modal_required")}</p>
                        )}
                      </div>

                      <div className="w-full ">
                        <label htmlFor="era" className="text-sm text-gray-600">
                          {t("era")}
                        </label>

                        <select
                          {...register("era")}
                          defaultValue={era_options[0].label}
                          className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          {era_options.map((option) => (
                            <option key={option.value} value={option.label}>
                              {t(option.label)}
                            </option>
                          ))}
                        </select>
                        {errors.intensity?.type === "required" && (
                          <p>{t("form_errors.product_modal_required")}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex w-full flex-row space-x-3 ">
                      <div className="w-full ">
                        <label
                          htmlFor="aroma"
                          className="text-sm text-gray-600"
                        >
                          {t("aroma")}
                        </label>

                        <select
                          {...register("aroma")}
                          defaultValue={aroma_options[0].label}
                          className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          {aroma_options.map((option) => (
                            <option
                              key={option.value}
                              value={option.label}
                              selected
                            >
                              {t(option.label)}
                            </option>
                          ))}
                        </select>

                        {errors.aroma?.type === "required" && (
                          <p>{t("form_errors.product_modal_required")}</p>
                        )}
                      </div>

                      <div className="w-full ">
                        <label
                          htmlFor="format"
                          className="text-sm text-gray-600"
                        >
                          {t("format")}
                        </label>

                        <select
                          {...register("format")}
                          defaultValue={format_options[0].label}
                          className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          {format_options.map((option) => (
                            <option key={option.value} value={option.label}>
                              {t(option.label)}
                            </option>
                          ))}
                        </select>
                        {errors.format?.type === "required" && (
                          <p>{t("form_errors.product_modal_required")}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex w-full flex-row space-x-3 ">
                      <div className="w-full ">
                        <label
                          htmlFor="isGluten"
                          className="text-sm text-gray-600"
                        >
                          {t("isGluten")}
                        </label>

                        <select
                          {...register("is_gluten")}
                          className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option key={0} value={"false"}>
                            NO
                          </option>
                          <option key={1} value={"true"}>
                            SI
                          </option>
                        </select>
                        {errors.format?.type === "required" && (
                          <p>{t("form_errors.product_modal_required")}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                    >
                      {t("save")}
                    </button>
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      {t("close")}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ProductModalUpd;
