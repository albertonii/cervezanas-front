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
import LotForm from "../CustomLayout/Products/LotForm";
import { AwardsSection } from "./AwardSection";
import { MultimediaSection } from "./MultimediaSection";
import ProductInfoSection from "./InfoSection";
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

const LotModalAdd = (props: Props) => {
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
    handleSubmit,
    reset,
  } = form;

  const onSubmit = (formValues: FormValues) => {
    reset();
  };

  return (
    <>
      <button
        className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        {t("modal_lot_add")}
      </button>

      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none drop-shadow-md focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-5xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    {t("modal_lot_title")}
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
                <LotForm />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default LotModalAdd;
