"use client";

import React, { ComponentProps, useState } from "react";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useSupabase } from "../../../../components/Context/SupabaseProvider";
import { ICPMobile, IEvent } from "../../../../lib/types.d";
import { DisplayInputError } from "../../../../components/common";
import { Modal } from "../../../../components/modals";
import { useAuth } from "../../../../components/Auth";
import { SearchCheckboxCPs } from "./SearchCheckboxCPs";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  logo: string;
  promotional_image: string;
  cps_mobile: ICPMobile[];
}

interface Props {
  eList: IEvent[];
  handleEList: ComponentProps<any>;
  cpsMobile: ICPMobile[];
}

export default function AddNewEvent({ eList, handleEList, cpsMobile }: Props) {
  const { t } = useTranslation();
  const { supabase } = useSupabase();
  const { user } = useAuth();

  const [showModal, setShowModal] = useState<boolean>(false);

  const form = useForm<FormData>();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = form;

  const onSubmit = async (formValues: FormData) => {
    const {
      name,
      description,
      start_date,
      end_date,
      logo = "",
      promotional_image = "",
      cps_mobile,
    } = formValues;

    // Create event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .insert({
        name,
        description,
        start_date,
        end_date,
        owner_id: user?.id,
      })
      .select();

    if (eventError) {
      throw eventError;
    }
    if (!cps_mobile) {
      return;
    }
    if (!event) {
      return;
    }

    const { id: eventId } = event[0];

    // Get cp checked from the list
    const cpsMFiltered = cps_mobile.filter((cp) => cp.id);

    // Loop trough all the selected CPs and insert them into the event
    for (let i = 0; i < cpsMFiltered.length; i++) {
      const { error: cpError } = await supabase
        .from("cp_mobile")
        .update({
          event: eventId,
        })
        .eq("id", cpsMFiltered[i].id);

      if (cpError) {
        throw cpError;
      }
    }

    if (event) {
      const newCPList = [...eList, event[0]];
      handleEList(newCPList);

      setShowModal(false);
      reset();
    }
  };

  return (
    <>
      <form>
        <Modal
          showBtn={true}
          showModal={showModal}
          setShowModal={setShowModal}
          title={t("add_new_event") ?? "Add new event"}
          btnTitle={t("new_event")}
          description={""}
          icon={faAdd}
          handler={handleSubmit(onSubmit)}
          btnSize={"large"}
          classIcon={"w-6 h-6"}
          classContainer={""}
        >
          <>
            {/* Event Information  */}
            <fieldset className="space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
              <legend className="m-2 text-2xl">{t("events_info")}</legend>

              {/* Event name  */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="name">{t("name")}</label>
                <input
                  className="rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 text-xl focus:border-beer-blonde focus:outline-none"
                  type="text"
                  {...register("name", { required: true })}
                />
              </div>
              {errors.name && (
                <DisplayInputError message="errors.input_required" />
              )}

              {/* Event description  */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="description">{t("description")}</label>
                <textarea
                  className="max-h-[180px] rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 text-xl focus:border-beer-blonde focus:outline-none"
                  {...register("description", { required: true })}
                />
              </div>
              {errors.description && (
                <DisplayInputError message="errors.input_required" />
              )}

              {/* Start date and end date  */}
              <div className="flex flex-row space-x-2">
                <div className="flex w-full  flex-col">
                  <label htmlFor="start_date">{t("start_date")}</label>
                  <input
                    type="date"
                    className="text-md rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 focus:border-beer-blonde focus:outline-none "
                    {...register("start_date", { required: true })}
                  />

                  {errors.start_date && (
                    <DisplayInputError message="errors.input_required" />
                  )}
                </div>

                <div className="flex w-full flex-col">
                  <label htmlFor="end_date">{t("end_date")}</label>
                  <input
                    className="text-md rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 focus:border-beer-blonde focus:outline-none "
                    type="date"
                    {...register("end_date", { required: true })}
                  />

                  {errors.end_date && (
                    <DisplayInputError message="errors.input_required" />
                  )}
                </div>
              </div>
            </fieldset>

            {/* Logo and publicitary img */}
            <fieldset className="mt-12 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
              <legend className="text-2xl">{t("event_advertising")}</legend>

              {/* Logo */}

              {/* AD Img  */}
            </fieldset>

            {/* List of user Consumption Points  */}
            <fieldset className="mt-12 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
              <legend className="text-2xl">{t("cp_mobile_associated")}</legend>

              {/* List of CPs  */}
              <SearchCheckboxCPs cpsMobile={cpsMobile} form={form} />
            </fieldset>
          </>
        </Modal>
      </form>
    </>
  );
}
