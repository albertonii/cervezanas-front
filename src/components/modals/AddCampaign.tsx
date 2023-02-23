import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Campaign } from "../../lib/types";
import { useAuth } from "../Auth";
import _ from "lodash";
import { Modal } from ".";

interface Props {
  campaigns: Campaign[];
  handleSetCampaigns: React.Dispatch<React.SetStateAction<any>>;
}

export function AddCampaign(props: Props) {
  const { t } = useTranslation();
  const { campaigns, handleSetCampaigns } = props;

  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState(0);

  const handleSetActiveStep = (value: number) => {
    setActiveStep(value);
  };

  const form = useForm({
    mode: "onSubmit",
    defaultValues: {
      campaign: "-",
      name: "Jaira IPA",
      description: "-",
      color: 0,
      intensity: 0,
      aroma: 0,
      family: 0,
      fermentation: 0,
      origin: 0,
      era: 0,
      is_gluten: false,
      awards: [{ name: "", description: "", year: 0, img_url: "" }],
      is_public: false,
      volume: "",
      price: 0,
      pack: "",
      format: "",
      stock_quantity: 0,
      stock_limit_notification: 0,
    },
  });

  const {
    formState: { errors },
    handleSubmit,
    reset,
  } = form;

  const onSubmit = (formValues: any) => {
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
        is_gluten,
        type,
        awards,
        p_principal,
        p_back,
        p_extra_1,
        p_extra_2,
        p_extra_3,
        is_public,
        name,
        description,
        price,
        volume,
        pack,
        format,
        stock_quantity,
        stock_limit_notification,
      } = formValues;

      const userId = user?.id;
    };
    handleInsert();
  };

  return (
    <form className="w-full">
      <Modal
        showBtn={true}
        isVisible={false}
        title={"add_campaign"}
        btnTitle={"add_campaign"}
        description={""}
        handler={handleSubmit(onSubmit)}
        classIcon={""}
        classContainer={""}
      >
        <>Prueba</>
      </Modal>
    </form>
  );
}
