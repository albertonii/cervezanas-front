'use client';

import BreweryList from './BreweryList';
import useBreweryStore from '@/app/store/breweryStore';
import ProfileSectionHeader from '@/app/[locale]/components/basic/ProfileSectionHeader';
import React from 'react';
import { useTranslations } from 'next-intl';
import { AddBreweryModal } from './AddBreweryModal';
import { UpdateBreweryModal } from './UpdateBreweryModal';

interface Props {
    counter: number;
}

const BreweryConfiguration = ({ counter }: Props) => {
    const t = useTranslations();
    const { isEditShowModal, isDeleteShowModal } = useBreweryStore();

    return (
        <section
            className="px-4 py-6 flex flex-col space-y-4"
            aria-label="Breweries"
        >
            <ProfileSectionHeader
                headerTitle="brewery.title"
                headerDescription={t('brewery.profile_configure_description')}
                btnActions={<AddBreweryModal />}
            />

            <BreweryList counter={counter} />

            {isEditShowModal && <UpdateBreweryModal />}

            {isDeleteShowModal && <div>dentro edelete</div>}
        </section>
    );
};

export default BreweryConfiguration;
