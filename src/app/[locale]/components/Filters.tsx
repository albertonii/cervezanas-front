"use client";

import React, { useId } from "react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../../utils";
import { useAppContext } from "../../../components/Context";

export function Filters() {
  const { t } = useTranslation();

  const { filters, setFilters } = useAppContext();

  const minPriceFilterId = useId();
  const categoryFilterId = useId();

  const handleChangeMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prevState: any) => ({
      ...prevState,
      minPrice: parseInt(e.target.value),
    }));
  };

  const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prevState: any) => ({
      ...prevState,
      category: e.target.value,
    }));
  };

  return (
    <section className="flex w-full items-center justify-between font-medium">
      <div className="flex items-center gap-4">
        <label htmlFor={minPriceFilterId}>{t("price_starts_at")}</label>
        <input
          type="range"
          id={minPriceFilterId}
          name="price"
          min="0"
          max="1000"
          value={filters.minPrice}
          onChange={handleChangeMinPrice}
        />
        <span>{formatCurrency(filters.minPrice)}</span>
      </div>

      <div className="flex items-center gap-4">
        <label htmlFor={categoryFilterId}>{t("category")}</label>
        <select id={categoryFilterId} onChange={handleChangeCategory}>
          <option value="all">{t("all")}</option>
          <option value="beer">{t("beer")}</option>
          <option value="merchandising">{t("merchandising")}</option>
        </select>
      </div>
    </section>
  );
}
