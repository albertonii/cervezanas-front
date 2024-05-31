'use client';

import Button from '../../../../components/common/Button';
import Spinner from '../../../../components/common/Spinner';
import HorizontalSections from '../../../../components/common/HorizontalSections';
import React, { useEffect, useState } from 'react';
import { IConsumptionPointUser } from '../../../../../../lib/types/types';
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
