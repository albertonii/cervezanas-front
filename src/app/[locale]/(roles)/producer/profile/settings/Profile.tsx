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
import { useTranslations } from 'next-intl';

interface Props {
    profile: IProducerUser;
}

export default function Profile({ profile }: Props) {
    const t = useTranslations();
    const { roles } = useAuth();

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

    return (
        <>
            <HorizontalSections
                handleMenuClick={handleMenuClick}
                // tabs={['account', 'details', 'values']}
                tabs={['account']}
            />

            {loading ? (
                <Spinner color="beer-blonde" size={'medium'} />
            ) : (
                <>{renderSwitch()}</>
            )}
        </>
    );
}
