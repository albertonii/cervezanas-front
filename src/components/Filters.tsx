import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../utils";

interface Props {
  changeFilters: (filters: any) => void;
}

export function Filters({ changeFilters }: Props) {
  const { t } = useTranslation();
  const [minPrice, setMinPrice] = useState(0);

  const handleChangeMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(parseInt(e.target.value));
    changeFilters((prevState: any) => ({
      ...prevState,
      minPrice: parseInt(e.target.value),
    }));
  };

  const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeFilters((prevState: any) => ({
      ...prevState,
      category: e.target.value,
    }));
  };

  return (
    <section className="flex w-full items-center justify-between font-medium">
      <div className="flex items-center gap-4">
        <label htmlFor="price">{t("price_starts_at")}</label>
        <input
          type="range"
          id="price"
          name="price"
          min="0"
          max="1000"
          onChange={handleChangeMinPrice}
        />
        <span>{formatCurrency(minPrice)}</span>
      </div>

      <div className="flex items-center gap-4">
        <label htmlFor="category">{t("category")}</label>
        <select id="category" onChange={handleChangeCategory}>
          <option value="all">{t("all")}</option>
          <option value="beer">{t("beer")}</option>
          <option value="merchandising">{t("merchandising")}</option>
        </select>
      </div>
    </section>
  );
}
