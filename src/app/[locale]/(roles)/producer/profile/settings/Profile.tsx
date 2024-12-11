'use client';

import Spinner from '@/app/[locale]/components/ui/Spinner';
import HorizontalSections from '@/app/[locale]/components/ui/HorizontalSections';
import React, { useEffect, useState } from 'react';
import { Values } from './Values';
import { Account } from './Account';
import { Details } from './Details';
import { useTranslations } from 'next-intl';
import { IProducerUser } from '@/lib/types/types';
import { useAuth } from '../../../../(auth)/Context/useAuth';

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
