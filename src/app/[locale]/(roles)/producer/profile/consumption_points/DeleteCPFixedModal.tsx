import DeleteModal from '../../../../components/modals/DeleteModal';
import React, { ComponentProps } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../../../(auth)/Context/useAuth';

interface Props {
    selectedCPId: string;
    isDeleteModal: boolean;
    handleDeleteModal: ComponentProps<any>;
}

export default function DeleteCPFixedModal({
    selectedCPId,
    isDeleteModal,
    handleDeleteModal,
}: Props) {
    const t = useTranslations();

    const { supabase } = useAuth();

    const queryClient = useQueryClient();

    // Delete CP Fixed from database
    const handleRemoveCP = async () => {
        if (!selectedCPId) return;

        const { error } = await supabase
            .from('cp_fixed')
            .delete()
            .eq('id', selectedCPId);

        if (error) throw error;
    };

    const deleteCPFixedMutation = useMutation({
        mutationKey: ['deleteCPFixed'],
        mutationFn: handleRemoveCP,
        onSuccess: () => {
            queryClient.invalidateQueries('cpFixed');
            handleDeleteModal(false);
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const onSubmitDelete = () => {
        try {
            deleteCPFixedMutation.mutate();
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
            description={t('delete_cp_description_modal')}
            btnTitle={t('accept')}
            showModal={isDeleteModal}
            setShowModal={handleDeleteModal}
        />
    );
}
