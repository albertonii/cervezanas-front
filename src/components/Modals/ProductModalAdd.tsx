import React, { useState } from "react";
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
  BeerEnum,
} from "../../lib/beerEnum";
import { Award } from "../../types";
import { supabase } from "../../utils/supabaseClient";
import { AwardsSection } from "./AwardSection";
import { MultimediaSection } from "./MultimediaSection";
import ProductInfoSection from "./ProductInfoSection";
import ProductStepper from "./ProductStepper";

interface Props {
  isVisible: boolean;
}

type FormValues = {
  name: string;
  description: string;
  campaign: string;
  type: number;
  color: number;
  intensity: number;
  aroma: number;
  family: number;
  fermentation: number;
  origin: number;
  era: number;
  format: number;
  isGluten: string;
  awards: Award[];
};

interface FormProps {
  name: string;
  description: string;
  campaign: string;
  type: number;
  color: number;
  intensity: number;
  aroma: number;
  family: number;
  fermentation: number;
  origin: number;
  era: number;
  format: number;
  isGluten: string;
  awards: Award[];
}

const ProductModalAdd = (props: Props) => {
  const { t } = useTranslation();
  const { isVisible } = props;

  const [showModal, setShowModal] = useState(isVisible);
  const [activeStep, setActiveStep] = useState(0);

  const handleSetActiveStep = (value: number) => {
    setActiveStep(value);
  };

  const form = useForm<FormProps>({
    mode: "onSubmit",
    defaultValues: {
      campaign: "-",
      name: "Jaira IPA",
      description: "",
      color: 0,
      intensity: 0,
      aroma: 0,
      family: 0,
      fermentation: 0,
      origin: 0,
      era: 0,
      format: 0,
      isGluten: "",
      type: 0,
      awards: [{ name: "", description: "", year: 0, img_url: "" }],
    },
  });

  const {
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
    handleSubmit,
  } = form;

  const onSubmit = (formValues: FormValues) => {
    const handleInsert = async () => {
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
        isGluten,
        type,
        awards,
      } = formValues;

      if (product_type_options[type].value == BeerEnum.Product_type.beer) {
        let beerId = "";
        const { data: beerData, error: beerError } = await supabase
          .from("beers")
          .insert({
            name: getValues("name"),
            description: getValues("description"),
            intensity: intensity_options[intensity].label,
            fermentation: fermentation_options[fermentation].label,
            color: color_options[color].label,
            aroma: aroma_options[aroma].label,
            family: family_options[family].label,
            origin: origin_options[origin].label,
            era: era_options[era].label,
            format: format_options[format].label,
            is_gluten: isGluten === "true",
            type,
            campaign_id: campaign,
          })
          .select();

        if (beerError) throw beerError;

        if (awards.length > 0) {
          beerId = beerData[0].id;

          awards.map(async (award) => {
            const file = award.img_url[0];
            const productFileUrl = file.name;

            const { error: awardsError } = await supabase
              .from("awards")
              .insert({
                beer_id: beerId,
                name: award.name,
                description: award.description,
                year: award.year,
                img_url: productFileUrl,
              });

            if (awardsError) throw awardsError;
            console.log(award.img_url[0]);
            console.log(award);
            const { data, error } = await supabase.storage
              .from("products")
              .upload(`awards/${productFileUrl}`, file, {
                cacheControl: "3600",
                upsert: false,
              });
          });
        }

        return beerData;
      }
    };

    handleInsert();
    setShowModal(false);
  };

  return (
    <>
      <button
        className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        {t("modal_product_add")}
      </button>
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
                  <ProductStepper
                    activeStep={activeStep}
                    handleSetActiveStep={handleSetActiveStep}
                  >
                    {activeStep === 0 ? (
                      <>
                        <p className="my-4 text-slate-500 text-lg leading-relaxed">
                          {t("modal_product_description")}
                        </p>
                        <ProductInfoSection form={form} />
                      </>
                    ) : activeStep === 1 ? (
                      <>
                        <p className="my-4 text-slate-500 text-lg leading-relaxed">
                          {t("modal_product_description")}
                        </p>

                        <AwardsSection form={form} />
                      </>
                    ) : (
                      <>
                        <p className="my-4 text-slate-500 text-lg leading-relaxed">
                          {t("modal_product_description")}
                        </p>

                        <MultimediaSection form={form} />
                      </>
                    )}
                  </ProductStepper>

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

export default ProductModalAdd;
