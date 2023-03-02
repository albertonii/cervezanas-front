import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Product, ProductLot } from "../../../lib/types";
import { AddLot, DeleteProductLot } from "../../modals";
import { LotList } from "./LotList";

interface Props {
  products: Product[];
  lots: ProductLot[];
}

export default function Lots({ products, lots: l }: Props) {
  const { t } = useTranslation();

  const [isEditShowModal, setIsEditShowModal] = useState(false);
  const [isDeleteShowModal, setIsDeleteShowModal] = useState(false);

  const [lotModal, setProductLotModal] = useState<any>(null);

  const [lots, setLots] = useState<ProductLot[]>(l);

  const handleSetProductLots = (value: ProductLot[]) => {
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

  const handleProductLotModal = (productLot: ProductLot) => {
    setProductLotModal(productLot);
  };

  return (
    <div className="py-6 px-4 " aria-label="Lots">
      <div className="flex items-center">
        <div className="text-4xl pr-12">{t("lots")}</div>

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
        <DeleteProductLot
          lots={lots!}
          productLotId={lotModal.id}
          isDeleteShowModal={isDeleteShowModal}
          handleDeleteShowModal={handleDeleteShowModal}
          handleSetProductLots={handleSetProductLots}
        />
      )}
    </div>
  );
}
