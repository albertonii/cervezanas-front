import Modal from './Modal';
import React from 'react';
import { useMutation } from 'react-query';
import { useAuth } from '../../(auth)/Context/useAuth';
import { useMessage } from '../message/useMessage';
import { ROLE_ENUM } from '@/lib//enums';
import { formatDateTypeDefaultInput } from '@/utils/formatDate';

interface Props {
    handleShowUpProducerModal: (show: boolean) => void;
    showModal: boolean;
}

export function UpProducerModal({
    handleShowUpProducerModal,
    showModal,
}: Props) {
    const { supabase, user } = useAuth();
    const { handleMessage } = useMessage();

    // Hemos convertido role de string -> string[]
    const handleSignUpAsProducer = async () => {
        if (!user.role.includes(ROLE_ENUM.Productor)) {
            // Add new role to the user table array
            const { error: roleError } = await supabase
                .from('users')
                .update({
                    role: [...user.role, ROLE_ENUM.Productor],
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

            // Add user role producer
            if (!user.role.includes(ROLE_ENUM.Productor)) {
                await supabase.rpc('set_claim', {
                    uid: user.id,
                    claim: 'access_level',
                    value: [...user.role, ROLE_ENUM.Productor],
                });
            }

            // Si ya existe una entrada en producer_user -> Solo hay que cambiar  el estado a activo
            const { data: producerUser, error: producerUserSelectError } =
                await supabase
                    .from('producer_user')
                    .select('*')
                    .eq('user_id', user.id);

            if (producerUserSelectError) {
                console.error(
                    'Error selecting producer user:',
                    producerUserSelectError,
                );

                handleMessage({
                    type: 'error',
                    message: 'errors.in_select_producer_user',
                });

                return;
            }

            if (producerUser.length === 0) {
                const { error: producerUserError } = await supabase
                    .from('producer_user')
                    .insert({
                        user_id: user.id,
                        company_email: '',
                        company_phone: '',
                    });

                if (producerUserError) {
                    console.error(
                        'Error creating producer user:',
                        producerUserError,
                    );

                    handleMessage({
                        type: 'error',
                        message: 'errors.insert_producer_user',
                    });

                    return;
                }

                const { error: consumptionPointsError } = await supabase
                    .from('consumption_points')
                    .insert({
                        owner_id: user.id,
                    });

                if (consumptionPointsError) {
                    console.error(
                        'Error creating consumption points:',
                        consumptionPointsError,
                    );

                    handleMessage({
                        type: 'error',
                        message: 'insert_consumption_point',
                    });

                    return;
                }

                const { error: customizeSettingsError } = await supabase
                    .from('customize_settings')
                    .insert({
                        owner_id: user.id,
                    });

                if (customizeSettingsError) {
                    console.error(
                        'Error creating customize settings:',
                        customizeSettingsError,
                    );

                    handleMessage({
                        type: 'error',
                        message: 'errors.insert_customize_settings',
                    });

                    return;
                }
            } else {
                // Actualizamos el estado a activo
                const { error: producerUserError } = await supabase
                    .from('producer_user')
                    .update({
                        is_active: true,
                    })
                    .eq('user_id', user.id);

                if (producerUserError) {
                    console.error(
                        'Error updating producer user:',
                        producerUserError,
                    );

                    handleMessage({
                        type: 'error',
                        message: 'errors.update_producer_user',
                    });

                    return;
                }
            }

            handleMessage({
                type: 'success',
                message: 'success.sign_up_producer',
            });
        }
    };

    const newProducerMutation = useMutation({
        mutationKey: ['newProducer'],
        mutationFn: handleSignUpAsProducer,
    });

    const handleSubmitUpNewProducer = () => {
        return newProducerMutation.mutateAsync();
    };

    return (
        <Modal
            showBtn={false}
            showModal={showModal}
            setShowModal={handleShowUpProducerModal}
            title={'modal_up_producer_title'}
            btnTitle={'accept'}
            description={'modal_up_producer_description'}
            handler={handleSubmitUpNewProducer}
            handlerClose={() => handleShowUpProducerModal(false)}
            classContainer={''}
        >
            <></>
        </Modal>
    );
}
