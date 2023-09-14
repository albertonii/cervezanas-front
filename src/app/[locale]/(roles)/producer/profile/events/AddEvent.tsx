"use client";

import React, { useState } from "react";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import { useSupabase } from "../../../../../../context/SupabaseProvider";
import { ICPMobile } from "../../../../../../lib/types.d";
import { DisplayInputError } from "../../../../components/common";
import { Modal } from "../../../../components/modals/Modal";
import { useAuth } from "../../../../Auth/useAuth";
import { SearchCheckboxCPs } from "./SearchCheckboxCPs";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";

interface FormData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  logo_url: string;
  promotional_url: string;
  cps_mobile: ICPMobile[];
}

interface Props {
  cpsMobile: ICPMobile[];
}

export default function AddEvent({ cpsMobile }: Props) {
  const t = useTranslations();
  const { supabase } = useSupabase();
  const { user } = useAuth();

  const [showModal, setShowModal] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const form = useForm<FormData>();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = form;

  const handleInsertEvent = async (formValues: FormData) => {
    const {
      name,
      description,
      start_date,
      end_date,
      logo_url = "",
      promotional_url = "",
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

    // Get CP checked from the list
    const cpsMFiltered = cps_mobile.filter((cp) => cp.cp_id);

    // Loop trough all the selected CPs and insert them into the event
    cpsMFiltered.map(async (cp) => {
      const { error: cpError } = await supabase.from("cpm_events").insert({
        cp_id: cp.cp_id,
        event_id: eventId,
        is_active: false,
      });

      if (cpError) {
        throw cpError;
      }
    });
  };

  const insertEventMutation = useMutation({
    mutationKey: "insertEvent",
    mutationFn: handleInsertEvent,
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setShowModal(false);
      setIsSubmitting(false);
      reset();
    },
    onError: (error) => {
      setIsSubmitting(false);
      console.error(error);
    },
  });

  const onSubmit = (formValues: FormData) => {
    try {
      insertEventMutation.mutate(formValues);
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
      <form>
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
          {errors.name && <DisplayInputError message="errors.input_required" />}

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
      </form>
    </Modal>
  );
}
