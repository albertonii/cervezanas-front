import { Modal } from "@supabase/ui";
import React, { useState } from "react";
import { useEffect } from "react";
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
  is_public: boolean;
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
  p_principal: any;
  p_back: any;
  p_extra_1: any;
  p_extra_2: any;
  p_extra_3: any;
};

interface FormProps {
  is_public: boolean;
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
  p_principal: any;
  p_back: any;
  p_extra_1: any;
  p_extra_2: any;
  p_extra_3: any;
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
      is_public: false,
    },
  });

  const {
    formState: { errors },
    getValues,
    handleSubmit,
    reset,
  } = form;

  const onSubmit = (formValues: FormValues) => {
    reset();

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
        p_principal,
        p_back,
        p_extra_1,
        p_extra_2,
        p_extra_3,
        is_public,
      } = formValues;
      if (product_type_options[type].value == BeerEnum.Product_type.beer) {
        let beerId = "";
        const { data: beerData, error: beerError } = await supabase
          .from("beers")
          .insert({
            is_public: getValues("is_public"),
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

        beerId = beerData[0].id;

        if (awards.length > 0 && awards[0].img_url != "") {
          awards.map(async (award) => {
            if (award.img_url.length > 0) {
              const file = award.img_url[0];
              const productFileUrl = encodeURIComponent(file.name);

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

              const { error: storageAwardsError } = await supabase.storage
                .from("products")
                .upload(`awards/${productFileUrl}`, file, {
                  cacheControl: "3600",
                  upsert: false,
                });

              if (storageAwardsError) throw storageAwardsError;
            }
          });
        }

        const p_principal_url =
          p_principal?.name != undefined
            ? encodeURIComponent(p_principal.name)
            : null;
        const p_back_url =
          p_back != undefined ? encodeURIComponent(p_back.name) : null;
        const p_extra_1_url =
          p_extra_1 != undefined ? encodeURIComponent(p_extra_1.name) : null;
        const p_extra_2_url =
          p_extra_2 != undefined ? encodeURIComponent(p_extra_2.name) : null;
        const p_extra_3_url =
          p_extra_3 != undefined ? encodeURIComponent(p_extra_3.name) : null;

        const { error: multError } = await supabase
          .from("product_multimedia")
          .insert({
            beer_id: beerId,
            p_principal: p_principal_url,
            p_back: p_back_url,
            p_extra_1: p_extra_1_url,
            p_extra_2: p_extra_2_url,
            p_extra_3: p_extra_3_url,
          });

        if (multError) throw multError;

        if (p_principal_url) {
          const { error: pPrincipalError } = await supabase.storage
            .from("products")
            .upload(`p_principal/${p_principal_url}`, p_principal, {
              cacheControl: "3600",
              upsert: false,
            });

          if (pPrincipalError) throw pPrincipalError;
        }

        if (p_back_url) {
          const { error: pBackError } = await supabase.storage
            .from("products")
            .upload(`p_back/${p_back_url}`, p_back, {
              cacheControl: "3600",
              upsert: false,
            });

          if (pBackError) throw pBackError;
        }

        if (p_extra_1_url) {
          const { error: pExtra1Error } = await supabase.storage
            .from("products")
            .upload(`p_extra_1/${p_extra_1_url}`, p_extra_1, {
              cacheControl: "3600",
              upsert: false,
            });

          if (pExtra1Error) throw pExtra1Error;
        }

        if (p_extra_2_url) {
          const { error: pExtra2Error } = await supabase.storage
            .from("products")
            .upload(`p_extra_2/${p_extra_2_url}`, p_extra_2, {
              cacheControl: "3600",
              upsert: false,
            });

          if (pExtra2Error) throw pExtra2Error;
        }

        if (p_extra_3_url) {
          const { error: pExtra3Error } = await supabase.storage
            .from("products")
            .upload(`p_extra_3/${p_extra_3_url}`, p_extra_3, {
              cacheControl: "3600",
              upsert: false,
            });

          if (pExtra3Error) throw pExtra3Error;
        }

        setActiveStep(0);

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
              <div className="relative w-auto my-6 mx-auto max-w-5xl">
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
                    <>
                      <p className="my-4 text-slate-500 text-lg leading-relaxed">
                        {t("modal_product_description")}
                      </p>

                      {activeStep === 0 ? (
                        <>
                          <ProductInfoSection form={form} />
                        </>
                      ) : activeStep === 1 ? (
                        <>
                          <AwardsSection form={form} />
                        </>
                      ) : activeStep === 2 ? (
                        <>
                          <MultimediaSection form={form} />
                        </>
                      ) : (
                        <></>
                      )}
                    </>
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
