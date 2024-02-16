'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LotList } from './LotList';
import { IRefProductLot } from '../../../../../../lib/types';
import { DeleteLot } from '../../../../components/modals/DeleteLot';
import { AddLot } from '../../../../components/modals/AddLot';
import { UpdateLot } from '../../../../components/modals/UpdateLot';

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
    <section className="px-4 py-6 " aria-label="Lots">
      <div className="flex flex-col space-y-4">
        <p className="flex justify-between py-4" id="header">
          <span
            id="title"
            className="text-5xl uppercase font-semibold text-white"
          >
            {t('lots')}
          </span>
        </p>

        <div className="w-40">
          <AddLot />
        </div>
      </div>

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
