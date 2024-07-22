import React, { ComponentProps } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from 'react-query';
import Modal from '@/app/[locale]/components/modals/Modal';
import { useAuth } from '../../../../(auth)/Context/useAuth';

interface Props {
    distributor_id: string;
    producer_id: string;
    handleCancelModal: ComponentProps<any>;
}

export default function CancelContractModal({
    distributor_id,
    producer_id,
    handleCancelModal,
}: Props) {
    const t = useTranslations();
    const { supabase } = useAuth();

    const queryClient = useQueryClient();

    const handleRemoveContract = async () => {
        if (!distributor_id || !producer_id) return;

        const { error } = await supabase
            .from('distribution_contracts')
            .update({ status: 'cancelled' })
            .eq('distributor_id', distributor_id)
            .eq('producer_id', producer_id);

        if (error) throw error;

        queryClient.invalidateQueries('distributionContract');
        handleCancelModal(false);
    };

    const cancelContractMutation = useMutation({
        mutationKey: ['cancelContract'],
        mutationFn: handleRemoveContract,
        onError: (error) => {
            console.error(error);
        },
    });

    const onSubmitCancel = async () => {
        try {
            return cancelContractMutation.mutate();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Modal
            title={t('cancel')}
            handler={onSubmitCancel}
            description={t('cancel_contract_description_modal')}
            btnTitle={t('accept')}
            showModal={true}
            setShowModal={() => void 0}
            handlerClose={handleCancelModal}
            classIcon={''}
            classContainer={''}
        >
            <></>
        </Modal>
    );
}
