import Modal from './Modal';
import React, { ComponentProps } from 'react';
import { useMutation } from 'react-query';
import { useAuth } from '../../(auth)/Context/useAuth';
import { useMessage } from '../message/useMessage';
import { ROLE_ENUM } from '@/lib//enums';
import { formatDateTypeDefaultInput } from '@/utils/formatDate';

interface Props {
    handleShowDownProducerModal: (show: boolean) => void;
    showModal: boolean;
}

export function DownProducerModal({
    handleShowDownProducerModal,
    showModal,
}: Props) {
    const { supabase, user } = useAuth();
    const { handleMessage } = useMessage();

    const handleSignDownAsProducer = async () => {
        if (user.role.includes(ROLE_ENUM.Productor)) {
            const delRoles = user.role.filter(
                (role: string) => role !== ROLE_ENUM.Productor,
            );

            const { error: roleError } = await supabase
                .from('users')
                .update({
                    role: delRoles,
                    updated_at: formatDateTypeDefaultInput(new Date()),
                })
                .eq('id', user.id);

            if (roleError) {
                console.error('Error updating user role:', roleError);

                handleMessage({
                    type: 'error',
                    message: 'errors.update_user_role',
                });

                return;
            }

            // Remove user role producer
            await supabase.rpc('set_claim', {
                uid: user.id,
                claim: 'access_level',
                value: delRoles,
            });

            // Para no perder toda la información previa de distribuidores -> Hacemos que se quede inactivo
            const { error: producerUserError } = await supabase
                .from('producer_user')
                .update({
                    is_active: false,
                })
                .eq('user_id', user.id);

            if (producerUserError) {
                console.error(
                    'Error deleting producer user:',
                    producerUserError,
                );

                handleMessage({
                    type: 'error',
                    message: 'errors.update_producer_user',
                });

                return;
            }

            handleMessage({
                type: 'success',
                message: 'success.sign_down_producer',
            });
        }
    };

    const delProducerMutation = useMutation({
        mutationKey: ['downProducer'],
        mutationFn: handleSignDownAsProducer,
    });

    const handleSubmitDownProducer = () => {
        return delProducerMutation.mutateAsync();
    };

    return (
        <Modal
            showBtn={false}
            showModal={showModal}
            setShowModal={handleShowDownProducerModal}
            title={'modal_down_producer_title'}
            btnTitle={'accept'}
            description={'modal_down_producer_description'}
            handler={handleSubmitDownProducer}
            handlerClose={() => handleShowDownProducerModal(false)}
            classIcon={''}
            classContainer={''}
        >
            <></>
        </Modal>
    );
}
