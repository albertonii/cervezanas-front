"use client";

import React, { useState } from "react";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import { ICPFixed, ICPMobile } from "../../../../../../lib/types";
import { useAuth } from "../../../../Auth/useAuth";
import { useMutation, useQueryClient } from "react-query";
import ModalWithForm from "../../../../components/modals/ModalWithForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import InputLabel from "../../../../components/common/InputLabel";
import InputTextarea from "../../../../components/common/InputTextarea";
import { SearchCheckboxCPMobiles } from "../../../../components/common/SearchCheckboxCPMobiles";
import { SearchCheckboxCPFixeds } from "../../../../components/common/SearchCheckboxCPFixed";

export type ModalAddEventFormData = {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  logo_url?: string;
  promotional_url?: string;
  cps_mobile?: any[];
};

const schema: ZodType<ModalAddEventFormData> = z.object({
  name: z.string().nonempty({ message: "errors.input_required" }),
  description: z.string().nonempty({ message: "errors.input_required" }),
  start_date: z.string().nonempty({ message: "errors.input_required" }),
  end_date: z.string().nonempty({ message: "errors.input_required" }),
  logo_url: z.string().optional(),
  promotional_url: z.string().optional(),
  cps_mobile: z.any(),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
  cpsMobile: ICPMobile[];
  cpsFixed: ICPFixed[];
}

export default function AddEvent({ cpsMobile, cpsFixed }: Props) {
  const t = useTranslations();
  const { user, supabase } = useAuth();

  const [showModal, setShowModal] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const form = useForm<ValidationSchema>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
  });

  const { handleSubmit, reset } = form;

  const handleInsertEvent = async (form: ValidationSchema) => {
    const { name, description, start_date, end_date, cps_mobile } = form;

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

    reset();
  };

  const insertEventMutation = useMutation({
    mutationKey: "insertEvent",
    mutationFn: handleInsertEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setShowModal(false);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (
    formValues: ModalAddEventFormData
  ) => {
    try {
      insertEventMutation.mutate(formValues);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ModalWithForm
      showBtn={true}
      showModal={showModal}
      setShowModal={setShowModal}
      title={"add_new_event"}
      btnTitle={"new_event"}
      description={""}
      icon={faAdd}
      btnSize={"large"}
      classIcon={"w-6 h-6"}
      classContainer={""}
      handler={handleSubmit(onSubmit)}
      form={form}
    >
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
            placeholder="IPA Jaira is a beer with a strong and intense aroma, with a fruity and floral touch."
          />

          {/* Start date and end date  */}
          <div className="flex flex-row space-x-2">
            <InputLabel
              form={form}
              label={"start_date"}
              registerOptions={{
                required: true,
                valueAsDate: true,
              }}
              inputType="date"
            />

            <InputLabel
              form={form}
              label={"end_date"}
              registerOptions={{
                required: true,
                valueAsDate: true,
              }}
              inputType="date"
            />
          </div>
        </fieldset>

        {/* Logo and publicitary img */}
        <fieldset className="mt-12 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
          <legend className="text-2xl">{t("event_advertising")}</legend>

          {/* Logo */}

          {/* AD Img  */}
        </fieldset>

        {/* List of Mobil Consumption Points  */}
        <fieldset className="mt-12 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
          <legend className="text-2xl">{t("cp_mobile_associated")}</legend>

          <SearchCheckboxCPMobiles cpsMobile={cpsMobile} form={form} />
        </fieldset>

        {/* List of Fixed Consumption Points  */}
        <fieldset className="mt-12 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
          <legend className="text-2xl">{t("cp_fixed_associated")}</legend>

          <SearchCheckboxCPFixeds cpsFixed={cpsFixed} form={form} />
        </fieldset>
      </form>
    </ModalWithForm>
  );
}
