'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LotList } from './LotList';
import { IRefProductLot } from '@/lib/types/types';
import { DeleteLot } from '@/app/[locale]/components/modals/DeleteLot';
import { AddLot } from '@/app/[locale]/components/modals/AddLot';
import { UpdateLot } from '@/app/[locale]/components/modals/UpdateLot';
import ProfileSectionHeader from '@/app/[locale]/components/ui/ProfileSectionHeader';

export function Lots() {
    const t = useTranslations();

    const [isEditShowModal, setIsEditShowModal] = useState(false);
    const [isDeleteShowModal, setIsDeleteShowModal] = useState(false);

    const [lotModal, setProductLotModal] = useState<any>(null);

    const handleEditShowModal = (value: boolean) => {
        setIsEditShowModal(value);
    };

    const handleDeleteShowModal = (value: boolean) => {
        setIsDeleteShowModal(value);
    };

    const handleProductLotModal = (productLot: IRefProductLot) => {
        setProductLotModal(productLot);
    };

    return (
        <section
            className="px-4 py-6 flex flex-col space-y-4"
            aria-label="Lots"
        >
            <ProfileSectionHeader
                headerTitle="lots"
                btnActions={<AddLot />}
                headerDescription={t('profile_configure_lots_description')}
            />

            <LotList
                handleEditShowModal={handleEditShowModal}
                handleDeleteShowModal={handleDeleteShowModal}
                handleProductLotModal={handleProductLotModal}
            />

            {isDeleteShowModal && (
                <DeleteLot
                    productLotId={lotModal.id}
                    showModal={isDeleteShowModal}
                    handleDeleteShowModal={handleDeleteShowModal}
                />
            )}

            {isEditShowModal && (
                <UpdateLot
                    productLot={lotModal}
                    handleEditShowModal={handleEditShowModal}
                    showModal={isEditShowModal}
                />
            )}
        </section>
    );
}
