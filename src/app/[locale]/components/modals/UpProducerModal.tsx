import Modal from './Modal';
import React from 'react';
import { useMutation } from 'react-query';
import { useAuth } from '../../(auth)/Context/useAuth';
import { useMessage } from '../message/useMessage';
import { ROLE_ENUM } from '@/lib//enums';

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
                })
                .eq('id', user.id);

            if (roleError) {
                console.error('Error updating user role:', roleError);

                handleMessage({
                    type: 'error',
                    message: 'Error updating user role',
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
                    message: 'Error selecting producer user',
                });

                return;
            }

            if (!producerUser) {
                // insert into public.producer_user (user_id) values (new.id);
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
                        message: 'Error creating producer user',
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
                        message: 'Error creating consumption points',
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
                        message: 'Error creating customize settings',
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
                        message: 'Error updating producer user',
                    });

                    return;
                }
            }
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
            classIcon={''}
            classContainer={''}
        >
            <></>
        </Modal>
    );
}
