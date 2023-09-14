import React, { ComponentProps, useState } from "react";
import DeleteModal from "../../../../components/modals/DeleteModal";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "react-query";
import { useSupabase } from "../../../../../../context/SupabaseProvider";

interface Props {
  selectedEventId: string;
  isDeleteModal: boolean;
  handleDeleteModal: ComponentProps<any>;
}

export default function DeleteCEventModal({
  selectedEventId,
  isDeleteModal,
  handleDeleteModal,
}: Props) {
  const t = useTranslations();

  const { supabase } = useSupabase();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Delete CP Fixed from database
  const handleRemoveCP = async () => {
    if (!selectedEventId) return;

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", selectedEventId);
    if (error) throw error;
  };

  const deleteEventsMutation = useMutation({
    mutationKey: ["deleteEvents"],
    mutationFn: handleRemoveCP,
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
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
      deleteEventsMutation.mutate();
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
      description={t("delete_event_description_modal")}
      btnTitle={t("accept")}
      showModal={isDeleteModal}
      setShowModal={handleDeleteModal}
    />
  );
}
