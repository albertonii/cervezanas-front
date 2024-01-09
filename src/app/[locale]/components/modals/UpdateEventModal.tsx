"use client";

import React, { ComponentProps, useEffect } from "react";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useAuth } from "../../Auth/useAuth";
import { useMutation, useQueryClient } from "react-query";
import { ICPMobile, ICPM_events, IEvent } from "../../../../lib/types";
import { formatDateDefaultInput } from "../../../../utils/formatDate";
import useFetchCPSMobileByEventsId from "../../../../hooks/useFetchCPsMobileByEventId";
import { SearchCheckboxCPs } from "../../(roles)/producer/profile/events/SearchCheckboxCPs";
import dynamic from "next/dynamic";
import InputLabel from "../common/InputLabel";
import InputTextarea from "../common/InputTextarea";

const ModalWithForm = dynamic(() => import("./ModalWithForm"), { ssr: false });
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

export default function UpdateEventModal({
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
      start_date: formatDateDefaultInput(selectedEvent.start_date),
      end_date: formatDateDefaultInput(selectedEvent.end_date),
      logo_url: selectedEvent.logo_url ?? "",
      promotional_url: selectedEvent.promotional_url ?? "",
    },
  });

  const { handleSubmit } = form;

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

    // // Insertar los nuevos CPs asociados al evento
    cps_mobile?.forEach(async (item) => {
      const { error } = await supabase.from("cpm_events").insert({
        cp_id: item.cp_id,
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
    <ModalWithForm
      showBtn={false}
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
      form={form}
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
              <InputLabel
                form={form}
                label={"name"}
                registerOptions={{
                  required: true,
                }}
              />

              {/* Event description  */}
              <InputTextarea
                form={form}
                label={"description"}
                registerOptions={{
                  required: true,
                }}
                placeholder="The event every beer lover is waiting for!"
              />

              {/* Start date and end date  */}
              <div className="flex flex-row space-x-2">
                <InputLabel
                  form={form}
                  label={"start_date"}
                  registerOptions={{
                    required: true,
                  }}
                  inputType="date"
                />

                <InputLabel
                  form={form}
                  label={"end_date"}
                  registerOptions={{
                    required: true,
                  }}
                  inputType="date"
                />
              </div>
            </fieldset>

            {/* Logo and publicitary img */}
            <fieldset className="mt-4 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
              <legend className="text-2xl">{t("event_advertising")}</legend>

              {/* Logo */}

              {/* AD Img  */}
            </fieldset>

            {/* List of user Consumption Points  */}
            {
              <fieldset className="mt-4 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                <legend className="text-2xl">
                  {t("cp_mobile_associated")}
                </legend>

                {/* List of CPs  */}
                <SearchCheckboxCPs
                  cpsMobile={cpsMobile}
                  form={form}
                  checkedCPs={checkedCPs}
                  selectedEventId={selectedEvent.id}
                />
              </fieldset>
            }
          </form>
        )}
      </>
    </ModalWithForm>
  );
}
