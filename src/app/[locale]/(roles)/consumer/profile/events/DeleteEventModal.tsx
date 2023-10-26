import { useTranslations } from "next-intl";
import React, { ComponentProps } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../../../Auth/useAuth";
import DeleteModal from "../../../../components/modals/DeleteModal";

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

  const { supabase } = useAuth();

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      handleDeleteModal(false);
    },
    onError: (error) => {
      console.error(error);
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
