"use client";

import useFetchCPSMobileByEventsId from "../../../../../../hooks/useFetchCPsMobileByEventId";
import React, { ComponentProps, useEffect } from "react";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { ICPMobile, ICPM_events, IEvent } from "../../../../../../lib/types.d";
import { Modal } from "../../../../components/modals/Modal";
import { DisplayInputError } from "../../../../components/common/DisplayInputError";
import { useMutation, useQueryClient } from "react-query";
import { SearchCheckboxCPs } from "./SearchCheckboxCPs";
import { formatDateDefaultInput } from "../../../../../../utils/formatDate";
import { useAuth } from "../../../../Auth/useAuth";

interface FormData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  logo_url: string;
  promotional_url: string;
  cps_mobile: ICPM_events[];
}

interface Props {
  selectedEvent: IEvent;
  isEditModal: boolean;
  handleEditModal: ComponentProps<any>;
  cpsMobile: ICPMobile[];
}

export default function EditEventModal({
  selectedEvent,
  isEditModal,
  handleEditModal,
  cpsMobile,
}: Props) {
  const t = useTranslations();
  const { supabase } = useAuth();

  const queryClient = useQueryClient();

  const {
    data: checkedCPs,
    isLoading,
    isFetching,
    refetch,
  } = useFetchCPSMobileByEventsId(selectedEvent.id);

  useEffect(() => {
    refetch();
  }, []);

  const form = useForm<FormData>({
    defaultValues: {
      name: selectedEvent.name,
      description: selectedEvent.description,
      start_date: formatDateDefaultInput(selectedEvent.start_date.toString()),
      end_date: formatDateDefaultInput(selectedEvent.end_date.toString()),
      logo_url: selectedEvent.logo_url ?? "",
      promotional_url: selectedEvent.promotional_url ?? "",
    },
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = form;

  // Update Event in database
  const handleUpdate = async (formValues: FormData) => {
    const {
      name,
      description,
      start_date,
      end_date,
      logo_url,
      promotional_url,
      cps_mobile,
    } = formValues;

    if (!selectedEvent) return;

    const { error } = await supabase
      .from("events")
      .update({
        name,
        description,
        start_date,
        end_date,
        logo_url,
        promotional_url,
      })
      .eq("id", selectedEvent.id);

    if (error) throw error;

    // // Obtener los CPs asociados al evento
    const cpsToUpdate = cpsMobile.filter((item) =>
      cps_mobile.map((cp) => cp.cp_id).includes(item.id)
    );

    // Eliminar todos los CPs asociados al evento
    checkedCPs?.forEach(async (cp) => {
      const { error: cpError } = await supabase
        .from("cpm_events")
        .delete()
        .eq("cp_id", cp.cp_id)
        .eq("event_id", selectedEvent.id);

      if (cpError) {
        throw cpError;
      }
    });

    // Insertar los nuevos CPs asociados al evento
    cpsToUpdate.forEach(async (item) => {
      const { error } = await supabase.from("cpm_events").insert({
        cp_id: item.id,
        event_id: selectedEvent.id,
        is_active: false,
      });
      if (error) {
        throw error;
      }
    });
  };

  const updateEventMutation = useMutation({
    mutationKey: ["updateEvent"],
    mutationFn: handleUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      handleEditModal(false);
    },
    onError: (e: any) => {
      console.error(e);
    },
  });

  const onSubmit = (formValues: FormData) => {
    try {
      updateEventMutation.mutate(formValues);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      showBtn={true}
      showModal={isEditModal}
      setShowModal={handleEditModal}
      title={t("edit_event") ?? "Edit event"}
      btnTitle={t("edit_event")}
      description={""}
      icon={faAdd}
      handler={handleSubmit(onSubmit)}
      btnSize={"large"}
      classIcon={"w-6 h-6"}
      classContainer={""}
    >
      <>
        {isLoading || (isFetching && <p>Loading...</p>)}
        {isLoading && <p>Loading...</p>}
        {!isLoading && !isFetching && (
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
              <SearchCheckboxCPs
                cpsMobile={cpsMobile}
                form={form}
                checkedCPs={checkedCPs}
                selectedEventId={selectedEvent.id}
              />
            </fieldset>
          </form>
        )}
      </>
    </Modal>
  );
}
