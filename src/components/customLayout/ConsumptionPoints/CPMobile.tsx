import CPGoogleMap from "./CPGoogleMap";
import ListCPMobile from "./ListCPMobile";
import React, { useState } from "react";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getGeocode } from "use-places-autocomplete";
import { ICPMobile } from "../../../lib/types.d";
import { supabase } from "../../../utils/supabaseClient";
import { isValidObject } from "../../../utils/utils";
import { Modal } from "../../modals";
import DisplayInputError from "../../common/DisplayInputError";

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
  cpMobile: ICPMobile[];
}

export default function CPMobile({ cpsId, cpMobile }: Props) {
  const { t } = useTranslation();

  const [address, setAddress] = useState<string>("");
  const [cpList, setCpList] = useState<ICPMobile[]>(cpMobile);

  const [addressInputRequired, setAddressInputRequired] =
    useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormData>();

  const handleAddress = (address: string) => {
    setAddress(address);
  };

  const handleCPList = (cps: ICPMobile[]) => {
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

    if (!isValidObject(address)) {
      setAddressInputRequired(true);
      return;
    }

    const results = await getGeocode({ address });

    const { data, error } = await supabase.from("cp_mobile").insert({
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
      geoArgs: results,
    });

    if (error) {
      throw error;
    }

    const newCPList = [...cpList, data[0]];
    handleCPList(newCPList);

    setShowModal(false);

    reset();
  };

  return (
    <>
      <Modal
        showBtn={true}
        showModal={showModal}
        setShowModal={setShowModal}
        title={t("add_new_cp_mobile")}
        btnTitle={t("new_cp_mobile_config")}
        description={""}
        icon={faAdd}
        handler={handleSubmit(onSubmit)}
        btnSize={"large"}
        classIcon={"w-6 h-6"}
        classContainer={""}
      >
        <form>
          <fieldset className="space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
            <legend className="m-2 text-2xl">{t("cp_mobile_info")}</legend>

            {/* Event name  */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="cp_name">{t("cp_name")}</label>
              <input
                className="rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 text-xl focus:border-beer-blonde focus:outline-none"
                type="text"
                id="name"
                {...register("cp_name", { required: true })}
              />
            </div>
            {errors.cp_name && (
              <DisplayInputError message="errors.input_required" />
            )}

            {/* Event description  */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="cp_description">{t("description")}</label>
              <textarea
                className="max-h-[180px] rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 text-xl focus:border-beer-blonde focus:outline-none"
                {...register("cp_description", { required: true })}
              />
            </div>
            {errors.cp_description && (
              <DisplayInputError message="errors.input_required" />
            )}

            {/* Start date and end date  */}
            <div className="flex flex-row space-x-2">
              <div className="flex w-full  flex-col">
                <label htmlFor="start_date">{t("start_date")}</label>
                <input
                  type="date"
                  id="start_date"
                  className="text-md rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 focus:border-beer-blonde focus:outline-none "
                  {...register("start_date", { required: true })}
                />

                {errors.start_date && (
                  <span className="text-red-500">
                    <DisplayInputError message="errors.input_required" />
                  </span>
                )}
              </div>

              <div className="flex w-full flex-col">
                <label htmlFor="end_date">{t("end_date")}</label>
                <input
                  className="text-md rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 focus:border-beer-blonde focus:outline-none "
                  type="date"
                  id="end_date"
                  {...register("end_date", { required: true })}
                />

                {errors.end_date && (
                  <span className="text-red-500">
                    <DisplayInputError message="errors.input_required" />
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="mt-12 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
            <legend className="text-2xl">{t("organizer_info")}</legend>

            {/* Organizer name and lastname  */}
            <div className="flex flex-row space-x-2 ">
              <div className="flex w-full flex-col">
                <label htmlFor="organizer_name">{t("name")}</label>
                <input
                  className="text-md rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 focus:border-beer-blonde focus:outline-none "
                  type="text"
                  id="organizer_name"
                  {...register("organizer_name", { required: true })}
                />

                {errors.organizer_name && (
                  <span className="text-red-500">
                    <DisplayInputError message="errors.input_required" />
                  </span>
                )}
              </div>

              <div className="flex w-full flex-col">
                <label htmlFor="organizer_lastname">{t("lastname")}</label>
                <input
                  className="text-md rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 focus:border-beer-blonde focus:outline-none "
                  type="text"
                  id="organizer_lastname"
                  {...register("organizer_lastname", { required: true })}
                />

                {errors.organizer_lastname && (
                  <span className="text-red-500">
                    <DisplayInputError message="errors.input_required" />
                  </span>
                )}
              </div>
            </div>

            {/* Email and phone  */}
            <div className="flex flex-row space-x-2">
              <div className="flex flex-col">
                <label htmlFor="organizer_email">{t("email")}</label>
                <input
                  className="text-md rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 focus:border-beer-blonde focus:outline-none "
                  type="email"
                  id="organizer_email"
                  {...register("organizer_email", { required: true })}
                />

                {errors.organizer_email && (
                  <span className="text-red-500">
                    <DisplayInputError message="errors.input_required" />
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="organizer_phone">{t("phone")}</label>
                <input
                  className="text-md rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 focus:border-beer-blonde focus:outline-none "
                  type="text"
                  id="organizer_phone"
                  {...register("organizer_phone", { required: true })}
                />

                {errors.organizer_phone && (
                  <span className="text-red-500">
                    <DisplayInputError message="errors.input_required" />
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="mt-12 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
            <legend className="text-2xl">{t("cp_mobile_location")}</legend>

            {addressInputRequired && (
              <span className="text-red-500">{t("errors.input_required")}</span>
            )}

            {/* Address  */}
            <CPGoogleMap handleAddress={handleAddress} />
          </fieldset>
        </form>
      </Modal>

      {/* Section displaying all the Mobile consumption points created by the organizer  */}
      <section className="mt-4 flex flex-col space-y-4 ">
        <h2 className="text-2xl">{t("cp_mobile_list")}</h2>

        <ListCPMobile
          cpMobile={cpList}
          cpsId={cpsId}
          handleCPList={handleCPList}
        />
      </section>
    </>
  );
}
