import Modal from './Modal';
import React from 'react';
import { useMutation } from 'react-query';
import { useAuth } from '../../(auth)/Context/useAuth';
import { useMessage } from '../message/useMessage';
import { ROLE_ENUM } from '@/lib//enums';
import { formatDateTypeDefaultInput } from '@/utils/formatDate';

interface Props {
    handleShowDownDistributorModal: (show: boolean) => void;
    showModal: boolean;
}

export function DownDistributorModal({
    handleShowDownDistributorModal,
    showModal,
}: Props) {
    const { supabase, user } = useAuth();
    const { handleMessage } = useMessage();

    // Hemos convertido role de string -> string[]
    const handleSignDownAsDistributor = async () => {
        if (user.role.includes(ROLE_ENUM.Distributor)) {
            // Delete distributor role to the user table array
            const delRoles = user.role.filter(
                (role: string) => role !== ROLE_ENUM.Distributor,
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
                    message: 'Error updating user role',
                });

                return;
            }

            await supabase.rpc('set_claim', {
                uid: user.id,
                claim: 'access_level',
                value: delRoles,
            });

            // Para no perder toda la información previa de distribuidores -> Hacemos que se quede inactivo
            const { error: distributorUserError } = await supabase
                .from('distributor_user')
                .update({
                    is_active: false,
                })
                .eq('user_id', user.id);

            if (distributorUserError) {
                console.error(
                    'Error deleting distributor user:',
                    distributorUserError,
                );

                handleMessage({
                    type: 'error',
                    message: 'Error deleting distributor user',
                });

                return;
            }
        }
    };

    const downDistributorMutation = useMutation({
        mutationKey: ['removeDistributor'],
        mutationFn: handleSignDownAsDistributor,
    });

    const handleSubmitDownDistributor = () => {
        return downDistributorMutation.mutateAsync();
    };

    return (
        <Modal
            showBtn={false}
            showModal={showModal}
            setShowModal={handleShowDownDistributorModal}
            title={'modal_down_distributor_title'}
            btnTitle={'accept'}
            description={'modal_down_distributor_description'}
            handler={handleSubmitDownDistributor}
            handlerClose={() => handleShowDownDistributorModal(false)}
            classIcon={''}
            classContainer={''}
        >
            <></>
        </Modal>
    );
}
