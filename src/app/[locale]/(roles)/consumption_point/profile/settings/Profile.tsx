'use client';

import Button from '@/app/[locale]/components/common/Button';
import Spinner from '@/app/[locale]/components/common/Spinner';
import HorizontalSections from '@/app/[locale]/components/common/HorizontalSections';
import React, { useEffect, useState } from 'react';
import { IConsumptionPointUser } from '@/lib//types/types';
import { Account } from './Account';

interface Props {
    profile: IConsumptionPointUser;
}

export default function Profile({ profile }: Props) {
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
