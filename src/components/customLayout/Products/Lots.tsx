import React from "react";
import { useTranslation } from "react-i18next";
import { Product, ProductLot } from "../../../lib/types";
import { AddLot } from "../../modals";
import { LotList } from "./LotList";

interface Props {
  products: Product[];
  lots: ProductLot[];
}

export default function Lots({ products, lots }: Props) {
  const { t } = useTranslation();
  console.log(lots);
  return (
    <div className="py-6 px-4 " aria-label="Lots">
      <div className="flex items-center">
        <div className="text-4xl pr-12">{t("lots")}</div>

        <AddLot />
      </div>

      <LotList
        lots={lots}
        handleEditShowModal={() => {}}
        handleDeleteShowModal={() => {}}
        handleProductModal={() => {}}
      />
    </div>
  );
}
