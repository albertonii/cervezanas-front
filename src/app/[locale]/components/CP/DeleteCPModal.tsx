import DeleteModal from '@/app/[locale]/components/modals/DeleteModal';
import React, { ComponentProps } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../(auth)/Context/useAuth';
import { useMutation, useQueryClient } from 'react-query';

interface Props {
    selectedCPId: string;
    isDeleteModal: boolean;
    handleDeleteModal: ComponentProps<any>;
}

export default function DeleteCPModal({
    selectedCPId,
    isDeleteModal,
    handleDeleteModal,
}: Props) {
    const t = useTranslations();

    const { supabase } = useAuth();

    const queryClient = useQueryClient();

    // Delete CP from database
    const handleRemoveCP = async () => {
        if (!selectedCPId) return;

        const { data: event, error } = await supabase
            .from('cp_events')
            .delete()
            .eq('id', selectedCPId)
            .select('event_id')
            .single();

        if (error) throw error;

        queryClient.invalidateQueries(['cp_events', event.event_id]);
        handleDeleteModal(false);
    };

    const deleteCPMutation = useMutation({
        mutationKey: ['delete_cp_events'],
        mutationFn: handleRemoveCP,
        onError: (error) => {
            console.error(error);
        },
    });

    const onSubmitDelete = () => {
        try {
            deleteCPMutation.mutate();
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
            description={t('delete_cp_event_description_modal')}
            btnTitle={t('accept')}
            showModal={isDeleteModal}
            setShowModal={handleDeleteModal}
        />
    );
}
