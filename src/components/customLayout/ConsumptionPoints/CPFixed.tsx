import { faAdd } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Modal } from "../../modals";

interface FormData {
  name: string;
  organizer_name: string;
  organizer_email: string;
  organizer_phone: string;
  start_date: string;
  end_date: string;
  address: string;
}

export default function CPFixed() {
  const { t } = useTranslation();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormData>();

  const onSubmit = async (formValues: FormData) => {
    const {
      name,
      organizer_name,
      organizer_email,
      organizer_phone,
      start_date,
      end_date,
      address,
    } = formValues;

    console.log(formValues);
  };

  return (
    <>
      <Modal
        showBtn={true}
        isVisible={false}
        title={t("add_shipping_address")}
        btnTitle={t("add_shipping_address")}
        description={""}
        icon={faAdd}
        handler={handleSubmit(onSubmit)}
        btnSize={"large"}
        classIcon={"w-6 h-6"}
        classContainer={"!w-1/2"}
      >
        <form className="w-full"></form>
      </Modal>
    </>
  );
}
