import React, { ComponentProps, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "react-query";
import { useSupabase } from "../../../../../../components/Context/SupabaseProvider";
import DeleteModal from "../../../../../../components/modals/DeleteModal";

interface Props {
  selectedCPId: string;
  isDeleteModal: boolean;
  handleDeleteModal: ComponentProps<any>;
}

export default function DeleteCPMobileModal({
  selectedCPId,
  isDeleteModal,
  handleDeleteModal,
}: Props) {
  const t = useTranslations();

  const { supabase } = useSupabase();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Delete CP Mobile from database
  const handleRemoveCP = async () => {
    if (!selectedCPId) return;

    const { error } = await supabase
      .from("cp_mobile")
      .delete()
      .eq("id", selectedCPId);

    if (error) throw error;
  };

  const deleteCPMobileMutation = useMutation({
    mutationKey: ["deleteCPMobile"],
    mutationFn: handleRemoveCP,
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

  const onSubmitDelete = () => {
    try {
      deleteCPMobileMutation.mutate();
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
      showModal={isDeleteModal}
      setShowModal={handleDeleteModal}
    />
  );
}
