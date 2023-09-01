import DeleteModal from "../../../../../../components/modals/DeleteModal";
import React, { ComponentProps, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "react-query";
import { useSupabase } from "../../../../../../components/Context/SupabaseProvider";

interface Props {
  distributor_id: string;
  producer_id: string;
  isDeleteModal: boolean;
  handleDeleteModal: ComponentProps<any>;
}

export default function DeleteContractModal({
  distributor_id,
  producer_id,
  isDeleteModal,
  handleDeleteModal,
}: Props) {
  const t = useTranslations();
  const { supabase } = useSupabase();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleRemoveDistributor = async () => {
    if (!distributor_id || !producer_id) return;

    const { error } = await supabase
      .from(" ")
      .delete()
      .eq("distributor_id", distributor_id)
      .eq("producer_id", producer_id);

    if (error) throw error;
  };

  const deleteDistributorMutation = useMutation({
    mutationKey: ["deleteDistributor"],
    mutationFn: handleRemoveDistributor,
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cpMobile"] });
      setIsSubmitting(false);
      handleDeleteModal(false);
    },
    onError: (error) => {
      console.error(error);
      setIsSubmitting(false);
    },
  });

  console.log(isDeleteModal);

  const onSubmitDelete = () => {
    try {
      deleteDistributorMutation.mutate();
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
      handlerClose={() => handleDeleteModal(false)}
      description={t("delete_cp_description_modal")}
      btnTitle={t("accept")}
      showModal={true}
      setShowModal={handleDeleteModal}
    />
  );
}
