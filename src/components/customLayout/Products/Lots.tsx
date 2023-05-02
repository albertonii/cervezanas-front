import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IProductLot, IProduct } from "../../../lib/types.d";
import { AddLot, DeleteLot, EditLot } from "../../modals";
import { LotList } from "./LotList";

interface Props {
  products: IProduct[];
  lots: IProductLot[];
}

export default function Lots({ products, lots: l }: Props) {
  const { t } = useTranslation();

  const [isEditShowModal, setIsEditShowModal] = useState(false);
  const [isDeleteShowModal, setIsDeleteShowModal] = useState(false);

  const [lotModal, setProductLotModal] = useState<any>(null);

  const [lots, setLots] = useState<IProductLot[]>(l);

  const handleSetProductLots = (value: IProductLot[]) => {
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

  const handleProductLotModal = (productLot: IProductLot) => {
    setProductLotModal(productLot);
  };

  return (
    <div className="py-6 px-4 " aria-label="Lots">
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
