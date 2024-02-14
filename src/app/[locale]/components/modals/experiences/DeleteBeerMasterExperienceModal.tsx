import React, { ComponentProps } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../../Auth/useAuth';
import DeleteModal from '../DeleteModal';

interface Props {
  selectedExperienceId: string;
  isDeleteModal: boolean;
  handleDeleteModal: ComponentProps<any>;
}

export default function DeleteExperienceModal({
  selectedExperienceId,
  isDeleteModal,
  handleDeleteModal,
}: Props) {
  const t = useTranslations();

  const { supabase } = useAuth();

  const queryClient = useQueryClient();

  const handleRemoveCP = async () => {
    if (!selectedExperienceId) return;

    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', selectedExperienceId);
    if (error) throw error;
  };

  const deleteExperiencesMutation = useMutation({
    mutationKey: ['deleteExperiences'],
    mutationFn: handleRemoveCP,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      handleDeleteModal(false);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmitDelete = () => {
    try {
      deleteExperiencesMutation.mutate();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DeleteModal
      title={t('delete')}
      handler={() => {
        onSubmitDelete();
      }}
      handlerClose={() => handleDeleteModal(false)}
      description={t('delete_experience_description_modal')}
      btnTitle={t('accept')}
      showModal={isDeleteModal}
      setShowModal={handleDeleteModal}
    />
  );
}
