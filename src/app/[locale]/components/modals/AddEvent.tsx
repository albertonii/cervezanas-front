"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ICPFixed, ICPMobile } from "../../../../lib/types";
import { useAuth } from "../../Auth/useAuth";
import { useMutation, useQueryClient } from "react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import InputLabel from "../common/InputLabel";
import InputTextarea from "../common/InputTextarea";
import { SearchCheckboxCPMobiles } from "../common/SearchCheckboxCPMobiles";
import { SearchCheckboxCPFixeds } from "../common/SearchCheckboxCPFixed";

const ModalWithForm = dynamic(() => import("./ModalWithForm"), { ssr: false });

export type ModalAddEventFormData = {
  name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  logo_url?: string;
  promotional_url?: string;
  cps_mobile?: any[];
  cps_fixed?: any[];
};

const schema: ZodType<ModalAddEventFormData> = z.object({
  name: z.string().nonempty({ message: "errors.input_required" }),
  description: z.string().nonempty({ message: "errors.input_required" }),
  start_date: z.date(),
  end_date: z.date(),
  logo_url: z.string().optional(),
  promotional_url: z.string().optional(),
  cps_mobile: z.any(),
  cps_fixed: z.any(),
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
    const { name, description, start_date, end_date, cps_mobile, cps_fixed } =
      form;

    const formatStartDate = new Date(start_date).toISOString();
    const formatEndDate = new Date(end_date).toISOString();

    // Create event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .insert({
        name,
        description,
        start_date: formatStartDate,
        end_date: formatEndDate,
        owner_id: user?.id,
        address: "",
        logo_url: "",
        promotional_url: "",
        status: "",
        geoArgs: {
          type: "Point",
          coordinates: [0, 0],
        },
      })
      .select()
      .single();

    if (!event) {
      return;
    }

    if (eventError) {
      throw eventError;
    }

    const { id: eventId } = event;

    if (cps_mobile) {
      // Get CP checked from the list
      const cpsMObileFiltered = cps_mobile.filter((cp) => cp.cp_id);

      // Loop trough all the selected CPs and insert them into the event
      cpsMObileFiltered.map(async (cp) => {
        const { error: cpError } = await supabase.from("cpm_events").insert({
          cp_id: cp.cp_id,
          event_id: eventId,
          is_active: false,
        });

        if (cpError) {
          throw cpError;
        }
      });
    }

    if (cps_fixed) {
      // Get CP checked from the list
      const cpsFixedFiltered = cps_fixed.filter((cp) => cp.cp_id);

      // Loop trough all the selected CPs and insert them into the event
      cpsFixedFiltered.map(async (cp) => {
        const { error: cpError } = await supabase.from("cpf_events").insert({
          cp_id: cp.cp_id,
          event_id: eventId,
          is_active: false,
        });

        if (cpError) {
          throw cpError;
        }
      });
    }
  };

  const insertEventMutation = useMutation({
    mutationKey: "insertEvent",
    mutationFn: handleInsertEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setShowModal(false);
      reset();
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
      classIcon={""}
      classContainer={""}
      handler={handleSubmit(onSubmit)}
      form={form}
    >
      <form>
        {/* Event Information  */}
        <fieldset className="space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
          <legend className="text-2xl">{t("events_info")}</legend>

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
        <fieldset className="mt-4 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
          <legend className="text-2xl">{t("event_advertising")}</legend>

          {/* Logo */}

          {/* AD Img  */}
        </fieldset>

        {/* List of Mobile Consumption Points  */}
        <fieldset className="mt-4 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
          <legend className="text-2xl">{t("cp_mobile_associated")}</legend>

          {/* List of CPs  */}
          <SearchCheckboxCPMobiles cpsMobile={cpsMobile} form={form} />
        </fieldset>

        {/* List of Fixed Consumption Points  */}
        <fieldset className="mt-4 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
          <legend className="text-2xl">{t("cp_fixed_associated")}</legend>

          {/* List of CPs  */}
          <SearchCheckboxCPFixeds cpsFixed={cpsFixed} form={form} />
        </fieldset>
      </form>
    </ModalWithForm>
  );
}
