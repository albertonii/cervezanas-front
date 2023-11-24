"use client";

import AddressForm from "../../../components/AddressForm";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useAuth } from "../../../Auth/useAuth";
import { Modal } from "../../../components/modals/Modal";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQueryClient } from "react-query";
import { IModalBillingAddress } from "../../../../../lib/types";

export function NewBillingAddress() {
  const t = useTranslations();

  const { user, supabase } = useAuth();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const form = useForm<IModalBillingAddress>();
  const { reset, handleSubmit } = form;

  const handleAddBillingAddress = async (formValues: IModalBillingAddress) => {
    const {
      name,
      lastname,
      document_id,
      phone,
      address,
      country,
      state,
      city,
      zipcode,
      is_default,
    } = formValues;

    const { error } = await supabase.from("billing_info").insert({
      owner_id: user?.id,
      name,
      lastname,
      document_id,
      phone,
      address,
      country,
      zipcode,
      city,
      state,
      is_default,
    });

    if (error) throw error;
    setShowModal(false);
  };

  const insertBillingMutation = useMutation({
    mutationKey: ["insertBilling"],
    mutationFn: handleAddBillingAddress,
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billingAddresses"] });
      setShowModal(false);
      setIsSubmitting(false);
      reset();
    },
    onError: (error) => {
      console.error(error);
      setIsSubmitting(false);
    },
  });

  const onSubmit = (formValues: IModalBillingAddress) => {
    try {
      insertBillingMutation.mutate(formValues);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      showBtn={true}
      showModal={showModal}
      setShowModal={setShowModal}
      title={t("add_billing_address")}
      btnTitle={t("add_billing_address")}
      description={""}
      icon={faAdd}
      handler={handleSubmit(onSubmit)}
      btnSize={"large"}
      classIcon={"w-6 h-6"}
      classContainer={`!w-1/2 ${isSubmitting && "opacity-50"}`}
    >
      <AddressForm form={form} addressNameId={"billing"} />
    </Modal>
  );
}
