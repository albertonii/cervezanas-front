"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { COMMON } from "../../../../../../constants";
import { ICPMobile, IProduct } from "../../../../../../lib/types";
import { formatCurrency, formatDate } from "../../../../../../utils";

interface Props {
  cpMobile: ICPMobile;
}

export default function DisplayCPMobile({ cpMobile }: Props) {
  const { t } = useTranslation();

  const cpm_products = cpMobile.cpm_products;

  return (
    <div className="relative h-full w-full rounded-lg bg-white p-8 shadow-md">
      <div className="absolute right-0 top-0 m-4 rounded-md bg-beer-gold px-4 py-2">
        <span
          className={`text-lg font-medium text-white ${
            cpMobile.status === "active" ? "text-green-500" : "text-red-500"
          }`}
        >
          {cpMobile.status === "active" ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Display all the information inside the Mobile Consumption Point */}
      <h1 className="mb-2 text-2xl font-bold">{cpMobile.cp_name}</h1>
      <h2 className="mb-4 text-lg text-gray-500">{cpMobile.cp_description}</h2>

      <div className="mb-4">
        {/* Start and End date */}
        <span className="text-gray-500">
          Start date: {formatDate(cpMobile.start_date)}
        </span>
        <span className="ml-4 text-gray-500">
          End date: {formatDate(cpMobile.end_date)}
        </span>
      </div>

      {/* Organizer information */}
      <div className="mb-4">
        <span className="text-gray-500">
          Organizer: {cpMobile.organizer_name} {cpMobile.organizer_lastname}
        </span>
        <span className="ml-4 text-gray-500">
          Email: {cpMobile.organizer_email}
        </span>
        <span className="ml-4 text-gray-500">
          Phone: {cpMobile.organizer_phone}
        </span>
      </div>

      {/* Products linked to this Mobile Consumption Point */}
      {cpm_products.length > 0 && (
        <div>
          <h3 className="mb-2 text-xl font-bold">Products</h3>

          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 ">
                  {t("img")}
                </th>

                <th scope="col" className="px-6 py-3 ">
                  {t("name_header")}
                </th>

                <th scope="col" className="px-6 py-3 ">
                  {t("description_header")}
                </th>

                <th scope="col" className="px-6 py-3 ">
                  {t("price_header")}
                </th>

                <th scope="col" className="px-6 py-3 ">
                  {t("type_header")}
                </th>
              </tr>
            </thead>
            <tbody>
              {cpm_products.map((cpm) => (
                <Product key={cpm.id} product={cpm.product_id} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface ProductProps {
  product: IProduct;
}

const Product = ({ product }: ProductProps) => {
  return (
    <tr
      key={product.id}
      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <td className=" space-x-2 px-6 py-4">
        <Image
          src={
            product.product_multimedia[0]?.p_principal ??
            COMMON.MARKETPLACE_PRODUCT
          }
          alt={product.name}
          width={64}
          height={64}
        />
      </td>

      <td className="space-x-2 px-6 py-4 font-semibold hover:cursor-pointer hover:text-beer-draft">
        <Link target={"_blank"} href={`/products/${product.id}`}>
          {product.name}
        </Link>
      </td>
      <td className="space-x-2 px-6 py-4">{product.description}</td>
      <td className="space-x-2 px-6 py-4 font-medium  text-green-500">
        {formatCurrency(product.price)}
      </td>
      <td className="space-x-2 px-6 py-4">{product.category}</td>
    </tr>
  );
};
