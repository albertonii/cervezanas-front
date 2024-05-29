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
import { ROLE_ENUM } from '../../../../../../lib/enums';
import { UpDistributorModal } from '../../../../components/modals/UpDistributorModal';
import { DownDistributorModal } from '../../../../components/modals/DownDistributorModal';

interface Props {
    profile: IProducerUser;
}

export default function Profile({ profile }: Props) {
    const { roles } = useAuth();

    const [showUpDistributorRole, setShowUpDistributorRole] =
        useState<boolean>(false);

    const [showDownDistributorRole, setShowDownDistributorRole] =
        useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(true);
    const [menuOption, setMenuOption] = useState<string>('account');

    const handleMenuClick = (opt: string): void => {
        setMenuOption(opt);
    };

    useEffect(() => {
        setLoading(false);
    }, []);

    const handleShowUpDistributorModal = (show: boolean = false) => {
        setShowUpDistributorRole(show);
    };

    const handleShowDownDistributorModal = (show: boolean = false) => {
        setShowDownDistributorRole(show);
    };

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

    return (
        <>
            {showUpDistributorRole && (
                <UpDistributorModal
                    handleShowUpDistributorModal={handleShowUpDistributorModal}
                    showModal={showUpDistributorRole}
                />
            )}

            {showDownDistributorRole && (
                <DownDistributorModal
                    handleShowDownDistributorModal={
                        handleShowDownDistributorModal
                    }
                    showModal={showDownDistributorRole}
                />
            )}

            <section>
                {roles?.includes(ROLE_ENUM.Distributor) ? (
                    <Button
                        primary
                        small
                        onClick={() => handleShowDownDistributorModal(true)}
                    >
                        Solicitar baja como distribuidor
                    </Button>
                ) : (
                    <Button
                        onClick={() => handleShowUpDistributorModal(true)}
                        primary
                        small
                    >
                        Solicitar alta como distribuidor
                    </Button>
                )}
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
