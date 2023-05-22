"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IRefProductLot } from "../../../lib/types.d";
import { AddLot, DeleteLot, EditLot } from "../../modals";
import { LotList } from "./LotList";
import { useAppContext } from "../../Context";

export function Lots() {
  const { t } = useTranslation();

  const { products, lots, setLots } = useAppContext();

  const [isEditShowModal, setIsEditShowModal] = useState(false);
  const [isDeleteShowModal, setIsDeleteShowModal] = useState(false);

  const [lotModal, setProductLotModal] = useState<any>(null);

  const handleSetProductLots = (value: IRefProductLot[]) => {
    setLots(value);
  };

  useEffect(() => {
    setLots(lots);
  }, [lots]);

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
    <div className="px-4 py-6 " aria-label="Lots">
      <div className="flex items-center">
        <div className="pr-12 text-4xl">{t("lots")}</div>

        <AddLot
          products={products}
          handleSetProductLots={handleSetProductLots}
        />
      </div>

      <LotList
        lots={lots}
        handleEditShowModal={handleEditShowModal}
        handleDeleteShowModal={handleDeleteShowModal}
        handleProductLotModal={handleProductLotModal}
      />

      {isDeleteShowModal && (
        <DeleteLot
          lots={lots}
          productLotId={lotModal.id}
          showModal={isDeleteShowModal}
          handleDeleteShowModal={handleDeleteShowModal}
          handleSetProductLots={handleSetProductLots}
        />
      )}

      {isEditShowModal && (
        <EditLot
          lots={lots}
          productLot={lotModal}
          handleEditShowModal={handleEditShowModal}
          handleSetProductLots={handleSetProductLots}
          showModal={isEditShowModal}
        />
      )}
    </div>
  );
}
