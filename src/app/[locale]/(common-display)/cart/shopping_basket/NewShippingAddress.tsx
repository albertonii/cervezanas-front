import AddressForm from "../../../components/AddressForm";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useAuth } from "../../../Auth/useAuth";
import { IAddressForm } from "../../../../../lib/types";
import { Modal } from "../../../components/modals/Modal";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQueryClient } from "react-query";
import { useSupabase } from "../../../../../context/SupabaseProvider";

export function NewShippingAddress() {
  const t = useTranslations();
  const { supabase } = useSupabase();

  const { user } = useAuth();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const form = useForm<IAddressForm>();
  const { reset, handleSubmit } = form;

  const handleAddShippingAddress = async (formValues: IAddressForm) => {
    const {
      name,
      lastname,
      document_id,
      phone,
      address,
      address_extra,
      address_observations,
      country,
      state,
      city,
      zipcode,
      is_default,
    } = formValues;

    const { error } = await supabase.from("shipping_info").insert({
      owner_id: user?.id,
      name,
      lastname,
      document_id,
      phone,
      address,
      address_extra,
      address_observations,
      country,
      zipcode,
      city,
      state,
      is_default: is_default,
    });

    if (error) throw error;
  };

  const insertShippingMutation = useMutation({
    mutationKey: ["insertShipping"],
    mutationFn: handleAddShippingAddress,
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shippingAddresses"] });
      setShowModal(false);
      setIsSubmitting(false);
      reset();
    },
    onError: (error: any) => {
      console.error(error);
      setIsSubmitting(false);
    },
  });

  const onSubmit = (formValues: IAddressForm) => {
    try {
      insertShippingMutation.mutate(formValues);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      showBtn={true}
      showModal={showModal}
      setShowModal={setShowModal}
      title={t("add_shipping_address")}
      btnTitle={t("add_shipping_address")}
      description={""}
      icon={faAdd}
      handler={handleSubmit(onSubmit)}
      btnSize={"large"}
      classIcon={"w-6 h-6"}
      classContainer={`!w-1/2 ${isSubmitting && "opacity-50"}`}
    >
      <AddressForm form={form} addressNameId={"shipping"} />
    </Modal>
  );
}
