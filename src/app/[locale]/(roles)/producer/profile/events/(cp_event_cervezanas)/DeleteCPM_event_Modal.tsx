import DeleteModal from '../../../../../components/modals/DeleteModal';
import React, { ComponentProps } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../../../../(auth)/Context/useAuth';

interface Props {
    cpId: string;
    eventId: string;
    isDeleteModal: boolean;
    handleDeleteModal: ComponentProps<any>;
}

export default function DeleteCPM_event_Modal({
    cpId,
    eventId,
    isDeleteModal,
    handleDeleteModal,
}: Props) {
    const t = useTranslations();

    const { supabase } = useAuth();

    const queryClient = useQueryClient();

    // Delete CP Fixed from database
    const handleRemoveCP = async () => {
        if (!eventId || !cpId) return;

        const { error } = await supabase
            .from('cpm_events')
            .delete()
            .eq('cp_id', cpId)
            .eq('event_id', eventId);
        if (error) throw error;
    };

    const deleteEventsMutation = useMutation({
        mutationKey: ['deleteCPMEvents'],
        mutationFn: handleRemoveCP,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cpm_events'] });
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
            title={t('delete')}
            handler={() => {
                onSubmitDelete();
            }}
            handlerClose={() => handleDeleteModal(false)}
            description={t('delete_cpm_event_description_modal')}
            btnTitle={t('accept')}
            showModal={isDeleteModal}
            setShowModal={handleDeleteModal}
        />
    );
}
