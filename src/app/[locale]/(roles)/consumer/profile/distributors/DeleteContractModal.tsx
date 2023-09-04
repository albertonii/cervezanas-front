import DeleteModal from "../../../../../../components/modals/DeleteModal";
import React, { ComponentProps, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "react-query";
import { useSupabase } from "../../../../../../components/Context/SupabaseProvider";

interface Props {
  distributor_id: string;
  producer_id: string;
  handleDeleteModal: ComponentProps<any>;
}

export default function DeleteContractModal({
  distributor_id,
  producer_id,
  handleDeleteModal,
}: Props) {
  const t = useTranslations();
  const { supabase } = useSupabase();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleRemoveContract = async () => {
    if (!distributor_id || !producer_id) return;

    const { error } = await supabase
      .from("distribution_contracts")
      .delete()
      .eq("distributor_id", distributor_id)
      .eq("producer_id", producer_id);

    if (error) throw error;
  };

  const deleteContractMutation = useMutation({
    mutationKey: ["deleteContract"],
    mutationFn: handleRemoveContract,
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["distributionContract"] });
      setIsSubmitting(false);
      handleDeleteModal(false);
    },
    onError: (error) => {
      console.error(error);
      setIsSubmitting(false);
    },
  });

  const onSubmitDelete = () => {
    try {
      deleteContractMutation.mutate();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DeleteModal
      title={t("delete")}
      handler={() => {
        onSubmitDelete();
      }}
      description={t("delete_contract_description_modal")}
      btnTitle={t("accept")}
      showModal={true}
      setShowModal={() => {}}
      handlerClose={handleDeleteModal}
    />
  );
}
