import React, { ComponentProps } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../(auth)/Context/useAuth';
import DeleteModal from './DeleteModal';

interface Props {
    cpId: string;
    eventId: string;
    isDeleteModal: boolean;
    handleDeleteModal: ComponentProps<any>;
}

export default function DeleteAdminCervezanasCPEventModal({
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
            .from('cp_events')
            .delete()
            .eq('cp_id', cpId)
            .eq('event_id', eventId);
        if (error) throw error;

        queryClient.invalidateQueries(['cp_events', eventId]);
        handleDeleteModal(false);
    };

    const deleteEventsMutation = useMutation({
        mutationKey: ['deleteEvents'],
        mutationFn: handleRemoveCP,
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
            description={t('delete_cp_event_description_modal')}
            btnTitle={t('accept')}
            showModal={isDeleteModal}
            setShowModal={handleDeleteModal}
        />
    );
}
