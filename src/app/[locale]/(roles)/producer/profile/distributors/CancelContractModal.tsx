import React, { ComponentProps, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "react-query";
import { useSupabase } from "../../../../../../context/SupabaseProvider";
import { Modal } from "../../../../components/modals/Modal";

interface Props {
  distributor_id: string;
  producer_id: string;
  handleCancelModal: ComponentProps<any>;
}

export default function CancelContractModal({
  distributor_id,
  producer_id,
  handleCancelModal,
}: Props) {
  const t = useTranslations();
  const { supabase } = useSupabase();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleRemoveContract = async () => {
    if (!distributor_id || !producer_id) return;

    const { error } = await supabase
      .from("distribution_contracts")
      .update({ status: "cancelled" })
      .eq("distributor_id", distributor_id)
      .eq("producer_id", producer_id);

    if (error) throw error;
  };

  const cancelContractMutation = useMutation({
    mutationKey: ["cancelContract"],
    mutationFn: handleRemoveContract,
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["distributionContract"] });
      setIsSubmitting(false);
      handleCancelModal(false);
    },
    onError: (error) => {
      console.error(error);
      setIsSubmitting(false);
    },
  });

  const onSubmitCancel = async () => {
    try {
      cancelContractMutation.mutate();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      title={t("cancel")}
      handler={() => {
        onSubmitCancel();
      }}
      description={t("cancel_contract_description_modal")}
      btnTitle={t("accept")}
      showModal={true}
      setShowModal={() => void 0}
      handlerClose={handleCancelModal}
      classIcon={""}
      classContainer={""}
    >
      <></>
    </Modal>
  );
}
