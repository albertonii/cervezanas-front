import DeleteModal from '@/app/[locale]/components/modals/DeleteModal';
import React, { ComponentProps } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { useMessage } from '@/app/[locale]/components/message/useMessage';

interface Props {
    distributor_id: string;
    producer_id: string;
    handleDeleteModal: ComponentProps<any>;
}

export default function DeleteContractModal({
    distributor_id,
    producer_id,
    handleDeleteModal,
}: Props) {
    const { supabase } = useAuth();
    const { handleMessage } = useMessage();

    const t = useTranslations();
    const submitSuccessMessage = t('messages.submit_success');
    const submitErrorMessage = t('messages.submit_error');

    const queryClient = useQueryClient();

    const handleRemoveContract = async () => {
        if (!distributor_id || !producer_id) return;

        const { error } = await supabase
            .from('distribution_contracts')
            .delete()
            .eq('distributor_id', distributor_id)
            .eq('producer_id', producer_id);

        if (error) {
            console.error(error);
            handleMessage({
                type: 'error',
                message: submitErrorMessage,
            });
        }

        handleMessage({
            type: 'success',
            message: submitSuccessMessage,
        });

        handleDeleteModal(false);

        queryClient.invalidateQueries('distributionContract');
    };

    const deleteContractMutation = useMutation({
        mutationKey: ['deleteContract'],
        mutationFn: handleRemoveContract,
        onError: (error) => {
            console.error(error);
        },
    });

    const onSubmitDelete = () => {
        try {
            deleteContractMutation.mutate();
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
            description={t('delete_contract_description_modal')}
            btnTitle={t('accept')}
            showModal={true}
            setShowModal={() => void 0}
            handlerClose={handleDeleteModal}
        />
    );
}
