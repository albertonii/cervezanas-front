"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { IRefProductLot } from "../../../lib/types.d";
import { AddLot, DeleteLot, EditLot } from "../../modals";
import { LotList } from "./LotList";

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
    <div className="px-4 py-6 " aria-label="Lots">
      <div className="flex items-center">
        <div className="pr-12 text-4xl">{t("lots")}</div>

        <AddLot />
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
        <EditLot
          productLot={lotModal}
          handleEditShowModal={handleEditShowModal}
          showModal={isEditShowModal}
        />
      )}
    </div>
  );
}
