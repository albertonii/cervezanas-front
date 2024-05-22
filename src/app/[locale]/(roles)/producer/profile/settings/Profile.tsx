'use client';

import Button from '../../../../components/common/Button';
import Spinner from '../../../../components/common/Spinner';
import HorizontalSections from '../../../../components/common/HorizontalSections';
import React, { useEffect, useState } from 'react';
import { IProducerUser } from '../../../../../../lib/types/types';
import { Account } from './Account';
import { Details } from './Details';
import { Values } from './Values';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { useMessage } from '../../../../components/message/useMessage';
import { ROLE_ENUM } from '../../../../../../lib/enums';

interface Props {
    profile: IProducerUser;
}

export default function Profile({ profile }: Props) {
    const { handleMessage } = useMessage();

    const { supabase, user } = useAuth();

    const [loading, setLoading] = useState<boolean>(true);
    const [menuOption, setMenuOption] = useState<string>('account');

    const handleMenuClick = (opt: string): void => {
        setMenuOption(opt);
    };

    useEffect(() => {
        setLoading(false);
    }, []);

    const renderSwitch = () => {
        switch (menuOption) {
            case 'account':
                return <Account profile={profile} />;
            case 'details':
                return <Details />;
            case 'values':
                return <Values />;
        }
    };

    // COMPROBAR QUE FUNCIONA
    // Hemos convertido role de string -> string[]
    const handleSignUpAsDistributor = async () => {
        if (!user.role.includes(ROLE_ENUM.Distributor)) {
            // Add new role to the user table array
            const { error: roleError } = await supabase
                .from('users')
                .update({
                    role: [...user.role, 'distributor'],
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

            // Add user role distributor
            if (!user.role.includes(ROLE_ENUM.Distributor)) {
                await supabase.rpc('set_claim', {
                    uid: user.id,
                    claim: 'access_level',
                    value: [...user.role, ROLE_ENUM.Distributor],
                });
            }

            // insert into public.distributor_user (user_id) values (new.id);
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
                    message: 'Error creating distributor user',
                });

                return;
            }

            // insert into public.coverage_areas (distributor_id) values (new.id);
            const { error: coverageAreasError } = await supabase
                .from('coverage_areas')
                .insert({
                    distributor_id: user.id,
                });

            if (coverageAreasError) {
                console.error(
                    'Error creating coverage areas:',
                    coverageAreasError,
                );

                handleMessage({
                    type: 'error',
                    message: 'Error creating coverage areas',
                });

                return;
            }

            // insert into public.distribution_costs (distributor_id) values (new.id);
            const { error: distributionCostsError } = await supabase
                .from('distribution_costs')
                .insert({
                    distributor_id: user.id,
                });

            if (distributionCostsError) {
                console.error(
                    'Error creating distribution costs:',
                    distributionCostsError,
                );

                handleMessage({
                    type: 'error',
                    message: 'Error creating distribution costs',
                });

                return;
            }

            // insert into public.gamification (user_id, score) values (new.id, 0);
            // Because gamification have unique user_id constraint
            const { data: gamificationData } = await supabase
                .from('gamification')
                .select('user_id')
                .eq('user_id', user.id);

            if (!gamificationData) {
                const { error: gamificationError } = await supabase
                    .from('gamification')
                    .insert({
                        user_id: user.id,
                        score: 0,
                    });

                if (gamificationError) {
                    console.error(
                        'Error creating gamification:',
                        gamificationError,
                    );

                    handleMessage({
                        type: 'error',
                        message: 'Error creating gamification',
                    });

                    return;
                }
            }
        }
    };

    return (
        <>
            <section>
                <div>
                    <Button
                        onClick={() => handleSignUpAsDistributor()}
                        primary
                        small
                    >
                        Darme de alta como distribuidor
                    </Button>
                </div>
            </section>

            <HorizontalSections
                handleMenuClick={handleMenuClick}
                tabs={['account', 'details', 'values']}
            />

            {loading ? (
                <Spinner color="beer-blonde" size={'medium'} />
            ) : (
                <>{renderSwitch()}</>
            )}
        </>
    );
}
