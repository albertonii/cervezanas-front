import React, { useState } from "react";
import CPGoogleMap from "./CPGoogleMap";
import ListCPFixed from "./ListCPFixed";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { supabase } from "../../../utils/supabaseClient";
import { Modal } from "../../modals";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { ICPFixed } from "../../../lib/types";

interface FormData {
  cp_name: string;
  cp_description: string;
  organizer_name: string;
  organizer_lastname: string;
  organizer_email: string;
  organizer_phone: string;
  start_date: string;
  end_date: string;
  address: string;
  status: string;
}

interface Props {
  cpsId: string;
  cpFixed: ICPFixed[];
}

export default function CPFixed({ cpsId, cpFixed }: Props) {
  const { t } = useTranslation();

  const [address, setAddress] = useState<string>("");
  const [cpList, setCpList] = useState<ICPFixed[]>(cpFixed);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormData>();

  const handleAddress = (address: string) => {
    setAddress(address);
  };

  const handleCPList = (cps: ICPFixed[]) => {
    setCpList(cps);
  };

  const onSubmit = async (formValues: FormData) => {
    const {
      cp_name,
      cp_description,
      organizer_name,
      organizer_lastname,
      organizer_email,
      organizer_phone,
      start_date,
      end_date,
    } = formValues;

    const { data, error } = await supabase.from("cp_fixed").insert({
      cp_name,
      cp_description,
      organizer_name,
      organizer_lastname,
      organizer_email,
      organizer_phone,
      start_date,
      end_date,
      address,
      status: "active",
      cp_id: cpsId,
    });

    if (error) {
      throw error;
    }

    const newCPList = [...cpList, data[0]];
    handleCPList(newCPList);

    reset();
  };

  return (
    <>
      <Modal
        showBtn={true}
        isVisible={false}
        title={t("add_new_cp_fixed")}
        btnTitle={t("new_cp_fixed_config")}
        description={""}
        icon={faAdd}
        handler={handleSubmit(onSubmit)}
        btnSize={"large"}
        classIcon={"w-6 h-6"}
        classContainer={""}
      >
        <form>
          <fieldset className="space-y-4 p-4 mt-12 border-2 rounded-md border-beer-softBlondeBubble">
            <legend className="text-2xl m-2">{t("cp_fixed_info")}</legend>

            {/* Event name  */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="cp_name">{t("cp_name")}</label>
              <input
                className="bg-beer-softFoam border-beer-softBlondeBubble border-2 focus:border-beer-blonde focus:outline-none rounded-md px-2 py-1 text-xl"
                type="text"
                id="name"
                {...register("cp_name", { required: true })}
              />

              {errors.cp_name && (
                <span className="text-red-500">
                  {t("cp_fixed_name_required")}
                </span>
              )}
            </div>

            {/* Event description  */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="cp_description">{t("description")}</label>
              <textarea
                className="max-h-[180px] bg-beer-softFoam border-beer-softBlondeBubble border-2 focus:border-beer-blonde focus:outline-none rounded-md px-2 py-1 text-xl"
                {...register("cp_description", { required: true })}
              />

              {errors.cp_name && (
                <span className="text-red-500">
                  {t("cp_fixed_description_required")}
                </span>
              )}
            </div>

            {/* Start date and end date  */}
            <div className="flex flex-row space-x-2">
              <div className="flex flex-col  w-full">
                <label htmlFor="start_date">{t("start_date")}</label>
                <input
                  type="date"
                  id="start_date"
                  className="bg-beer-softFoam border-beer-softBlondeBubble border-2 focus:border-beer-blonde focus:outline-none rounded-md px-2 py-1 text-md "
                  {...register("start_date", { required: true })}
                />

                {errors.start_date && (
                  <span className="text-red-500">
                    {t("cp_fixed_start_date_required")}
                  </span>
                )}
              </div>

              <div className="flex flex-col w-full">
                <label htmlFor="end_date">{t("end_date")}</label>
                <input
                  className="bg-beer-softFoam border-beer-softBlondeBubble border-2 focus:border-beer-blonde focus:outline-none rounded-md px-2 py-1 text-md "
                  type="date"
                  id="end_date"
                  {...register("end_date", { required: true })}
                />

                {errors.end_date && (
                  <span className="text-red-500">
                    {t("cp_fixed_end_date_required")}
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4 p-4 mt-12 border-2 rounded-md border-beer-softBlondeBubble">
            <legend className="text-2xl">{t("organizer_info")}</legend>

            {/* Organizer name and lastname  */}
            <div className="flex flex-row space-x-2 ">
              <div className="w-full flex flex-col">
                <label htmlFor="organizer_name">{t("name")}</label>
                <input
                  className="bg-beer-softFoam border-beer-softBlondeBubble border-2 focus:border-beer-blonde focus:outline-none rounded-md px-2 py-1 text-md "
                  type="text"
                  id="organizer_name"
                  {...register("organizer_name", { required: true })}
                />

                {errors.organizer_name && (
                  <span className="text-red-500">
                    {t("cp_fixed_organizer_name_required")}
                  </span>
                )}
              </div>

              <div className="w-full flex flex-col">
                <label htmlFor="organizer_lastname">{t("lastname")}</label>
                <input
                  className="bg-beer-softFoam border-beer-softBlondeBubble border-2 focus:border-beer-blonde focus:outline-none rounded-md px-2 py-1 text-md "
                  type="text"
                  id="organizer_lastname"
                  {...register("organizer_lastname", { required: true })}
                />

                {errors.organizer_name && (
                  <span className="text-red-500">
                    {t("cp_fixed_organizer_lastname_required")}
                  </span>
                )}
              </div>
            </div>

            {/* Email and phone  */}
            <div className="flex flex-row space-x-2">
              <div className="flex flex-col">
                <label htmlFor="organizer_email">{t("email")}</label>
                <input
                  className="bg-beer-softFoam border-beer-softBlondeBubble border-2 focus:border-beer-blonde focus:outline-none rounded-md px-2 py-1 text-md "
                  type="email"
                  id="organizer_email"
                  {...register("organizer_email", { required: true })}
                />

                {errors.organizer_email && (
                  <span className="text-red-500">
                    {t("cp_fixed_organizer_email_required")}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="organizer_phone">{t("phone")}</label>
                <input
                  className="bg-beer-softFoam border-beer-softBlondeBubble border-2 focus:border-beer-blonde focus:outline-none rounded-md px-2 py-1 text-md "
                  type="text"
                  id="organizer_phone"
                  {...register("organizer_phone", { required: true })}
                />

                {errors.organizer_phone && (
                  <span className="text-red-500">
                    {t("cp_fixed_organizer_phone_required")}
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4 p-4 mt-12 border-2 rounded-md border-beer-softBlondeBubble">
            <legend className="text-2xl">{t("cp_fixed_location")}</legend>

            {/* Address  */}
            <CPGoogleMap handleAddress={handleAddress} />
          </fieldset>
        </form>
      </Modal>

      {/* Section displaying all the fixed consumption points created by the organizer  */}
      <section className="flex flex-col space-y-4 mt-4 ">
        <h2 className="text-2xl">{t("cp_fixed_list")}</h2>

        <ListCPFixed cpFixed={cpList} handleCPList={handleCPList} />
      </section>
    </>
  );
}
