import React from "react";
import { useTranslation } from "react-i18next";
import { Product } from "../../../lib/types";
import { AddLot } from "../../modals";

interface Props {
  products: Product[];
}

export default function Lots({ products }: Props) {
  const { t } = useTranslation();
  return (
    <div className="py-6 px-4 " aria-label="Lots">
      <div className="flex items-center">
        <div className="text-4xl pr-12">{t("lots")}</div>

        <AddLot />
      </div>
    </div>
  );
}
