import React, { ComponentProps } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../(auth)/Context/useAuth';
import DeleteModal from './DeleteModal';

interface Props {
    selectedEventId: string;
    isDeleteModal: boolean;
    handleDeleteModal: ComponentProps<any>;
}

export default function DeleteEventModal({
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
            .from('events')
            .delete()
            .eq('id', selectedEventId);
        if (error) throw error;

        queryClient.invalidateQueries(['events']);
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
            description={t('delete_event_description_modal')}
            btnTitle={t('accept')}
            showModal={isDeleteModal}
            setShowModal={handleDeleteModal}
        />
    );
}
