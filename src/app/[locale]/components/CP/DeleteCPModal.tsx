import DeleteModal from '@/app/[locale]/components/modals/DeleteModal';
import React, { ComponentProps } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../(auth)/Context/useAuth';

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

        const { error } = await supabase
            .from('cp')
            .delete()
            .eq('id', selectedCPId);

        if (error) throw error;

        queryClient.invalidateQueries('cps');
        handleDeleteModal(false);
    };

    const deleteCPMutation = useMutation({
        mutationKey: ['deleteCP'],
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
            description={t('delete_cp_description_modal')}
            btnTitle={t('accept')}
            showModal={isDeleteModal}
            setShowModal={handleDeleteModal}
        />
    );
}
