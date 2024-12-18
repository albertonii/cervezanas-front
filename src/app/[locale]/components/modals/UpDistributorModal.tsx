import Modal from './Modal';
import React from 'react';
import { useMutation } from 'react-query';
import { useAuth } from '../../(auth)/Context/useAuth';
import { useMessage } from '../message/useMessage';
import { ROLE_ENUM } from '@/lib//enums';
import { IDistributionCost } from '@/lib/types/types';
import { formatDateTypeDefaultInput } from '@/utils/formatDate';

interface Props {
    handleShowUpDistributorModal: (show: boolean) => void;
    showModal: boolean;
}

export function UpDistributorModal({
    handleShowUpDistributorModal,
    showModal,
}: Props) {
    const { supabase, user } = useAuth();
    const { handleMessage } = useMessage();

    // Hemos convertido role de string -> string[]
    const handleSignUpAsDistributor = async () => {
        if (!user.role.includes(ROLE_ENUM.Distributor)) {
            // Add new role to the user table array
            const { error: roleError } = await supabase
                .from('users')
                .update({
                    role: [...user.role, ROLE_ENUM.Distributor],
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

            // Add user role distributor
            if (!user.role.includes(ROLE_ENUM.Distributor)) {
                await supabase.rpc('set_claim', {
                    uid: user.id,
                    claim: 'access_level',
                    value: [...user.role, ROLE_ENUM.Distributor],
                });
            }

            // Si ya existe una entrada en distributor_user -> Solo hay que cambiar  el estado a activo
            const { data: distributorUser, error: distributorUserSelectError } =
                await supabase
                    .from('distributor_user')
                    .select('*')
                    .eq('user_id', user.id);

            if (distributorUserSelectError) {
                console.error(
                    'Error selecting distributor user:',
                    distributorUserSelectError,
                );

                handleMessage({
                    type: 'error',
                    message: 'errors.in_select_distributor_user',
                });

                return;
            }

            if (distributorUser.length === 0) {
                const { error: distributorUserError } = await supabase
                    .from('distributor_user')
                    .insert({
                        user_id: user.id,
                    });

                if (distributorUserError) {
                    console.error(
                        'Error creating distributor user:',
                        distributorUserError,
                    );

                    handleMessage({
                        type: 'error',
                        message: 'errors.insert_distributor_user',
                    });

                    return;
                }

                const {
                    data: distributionCosts,
                    error: distributionCostsError,
                } = await supabase
                    .from('distribution_costs')
                    .insert({
                        distributor_id: user.id,
                    })
                    .select('*');

                if (distributionCostsError) {
                    console.error(
                        'Error creating distribution costs:',
                        distributionCostsError,
                    );

                    handleMessage({
                        type: 'error',
                        message: 'errors.insert_distribution_costs',
                    });

                    return;
                }

                if (distributionCosts) {
                    const dCosts = distributionCosts[0] as IDistributionCost;

                    const { error: areaAndWeigtCostsError } = await supabase
                        .from('area_and_weight_cost')
                        .insert({
                            distribution_costs_id: dCosts.id,
                        });

                    if (areaAndWeigtCostsError) {
                        console.error(
                            'Error creating area and weight costs:',
                            areaAndWeigtCostsError,
                        );

                        handleMessage({
                            type: 'error',
                            message: 'errors.insert_area_and_weight_costs',
                        });

                        return;
                    }
                }
            } else {
                // Actualizar el estado a activo
                const { error: distributorUserError } = await supabase
                    .from('distributor_user')
                    .update({
                        is_active: true,
                    })
                    .eq('user_id', user.id);

                if (distributorUserError) {
                    console.error(
                        'Error updating distributor user:',
                        distributorUserError,
                    );

                    handleMessage({
                        type: 'error',
                        message: 'errors.update_distributor_user',
                    });

                    return;
                }
            }

            handleMessage({
                type: 'success',
                message: 'success.sign_up_distributor',
            });
        }
    };

    const newDistributorMutation = useMutation({
        mutationKey: ['newDistributor'],
        mutationFn: handleSignUpAsDistributor,
    });

    const handleSubmitUpNewDistributor = () => {
        return newDistributorMutation.mutateAsync();
    };

    return (
        <Modal
            showBtn={false}
            showModal={showModal}
            setShowModal={handleShowUpDistributorModal}
            title={'modal_up_distributor_title'}
            btnTitle={'accept'}
            description={'modal_up_distributor_description'}
            handler={handleSubmitUpNewDistributor}
            handlerClose={() => handleShowUpDistributorModal(false)}
            classContainer={''}
        >
            <></>
        </Modal>
    );
}
