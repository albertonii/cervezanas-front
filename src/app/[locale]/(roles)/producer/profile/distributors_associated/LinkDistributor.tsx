import Modal from '@/app/[locale]/components/modals/Modal';
import useFetchProducerById from '@/hooks/useFetchProducerById';
import AvailableDistributorsList from './AvailableDistributorsList';
import React, { useEffect, useState } from 'react';
import { z, ZodType } from 'zod';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { DistributionStatus } from '@/lib//enums';
import { SubmitContract } from './SubmitContract';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { IDistributorUser, IProducerUser } from '@/lib//types/types';
import { useMessage } from '@/app/[locale]/components/message/useMessage';

type FormData = {
    message: string;
    is_signed: boolean;
};

const schema: ZodType<FormData> = z
    .object({
        message: z
            .string()
            .max(300, { message: 'Must be less than 300 characters' }),
        is_signed: z.boolean(),
    })
    .refine((data) => data.is_signed, {
        message: 'You must agree to the terms and conditions',
        path: ['is_signed'],
    });

export default function LinkDistributor() {
    const t = useTranslations();
    const submitSuccessMessage = t('messages.submit_success');
    const submitErrorMessage = t('messages.submit_error');

    const { supabase, user } = useAuth();

    const [showModal, setShowModal] = useState<boolean>(false);
    const [showFooter, setShowFooter] = useState<boolean>(false);

    const [selectedDistributor, setSelectedDistributor] =
        useState<IDistributorUser | null>(null);

    const [selectedProducer, setSelectedProducer] =
        useState<IProducerUser | null>(null);

    const handleDistributor = (distributor: IDistributorUser) => {
        setSelectedDistributor(distributor);
    };

    const { data: producerFetch, error } = useFetchProducerById(user?.id);

    if (error) {
        console.error(error);
    }

    useEffect(() => {
        if (producerFetch) {
            setSelectedProducer(producerFetch);
        }
    }, [producerFetch]);

    useEffect(() => {
        if (selectedDistributor) {
            setShowFooter(true);
        }
    }, [selectedDistributor]);

    const handleCustomClose = () => {
        setSelectedDistributor(null);
        setShowFooter(false);
    };

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const queryClient = useQueryClient();

    const { handleSubmit, reset } = form;
    const { handleMessage } = useMessage();

    const handleAddContract = async (formValues: FormData) => {
        if (!selectedDistributor || !user.id) return null;

        const { message, is_signed } = formValues;

        const { error } = await supabase.from('distribution_contracts').insert({
            distributor_id: selectedDistributor.user_id,
            producer_id: user.id,
            message: message,
            producer_accepted: is_signed,
            status: DistributionStatus.PENDING,
        });

        if (error) {
            console.error(error);

            handleMessage({
                type: 'error',
                message: submitErrorMessage,
            });
            return;
        }

        handleMessage({
            type: 'success',
            message: submitSuccessMessage,
        });

        reset();

        queryClient.invalidateQueries('distributionContract');
    };

    const handleAddContractMutation = useMutation({
        mutationKey: ['addContract'],
        mutationFn: handleAddContract,
        onError: (error: Error) => {
            console.error(error);
        },
    });

    const onSubmit = (formValues: FormData) => {
        try {
            handleAddContractMutation.mutate(formValues);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <form className="w-full">
            <Modal
                showBtn={true}
                showModal={showModal}
                setShowModal={setShowModal}
                title={'form_submit_contract_title'}
                btnTitle={'apply_contract'}
                description={''}
                classIcon={''}
                classContainer={''}
                showFooter={showFooter}
                btnCancelTitle={'come_back'}
                handleCustomClose={() => handleCustomClose()}
                handler={handleSubmit(onSubmit)}
            >
                {selectedDistributor && selectedProducer ? (
                    <SubmitContract
                        producer={selectedProducer}
                        distributor={selectedDistributor}
                        form={form}
                    />
                ) : (
                    <AvailableDistributorsList
                        producerId={selectedProducer?.user_id ?? ''}
                        handleDistributor={handleDistributor}
                    />
                )}
            </Modal>
        </form>
    );
}
