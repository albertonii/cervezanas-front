import React from "react";
import CPFProduct from "./CPFProduct";
import { useTranslations } from "next-intl";
import { ICPFixed, ICPMProducts } from "../../../../../../../../../lib/types";

interface Props {
  cpFixed: ICPFixed;
  eventId: string;
}

export default function ProductList({ cpFixed, eventId }: Props) {
  const t = useTranslations();
  const { cpf_products } = cpFixed;

  return (
    <>
      {cpf_products && cpf_products.length > 0 ? (
        <section className="overflow-x-auto">
          <h3 className="mb-2 text-xl font-bold"> {t("products")}</h3>

          <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 ">
                  {t("img")}
                </th>

                <th scope="col" className="px-6 py-3 ">
                  {t("name_header")}
                </th>

                <th scope="col" className="px-6 py-3 ">
                  {t("pack_name_header")}
                </th>

                <th scope="col" className="px-6 py-3 ">
                  {t("quantity_in_pack_header")}
                </th>

                <th scope="col" className="hidden px-6 py-3 md:block">
                  {t("description_header")}
                </th>

                <th scope="col" className="px-6 py-3 ">
                  {t("price_header")}
                </th>

                <th scope="col" className="hidden px-6 py-3 md:block">
                  {t("type_header")}
                </th>

                <th scope="col" className="px-6 py-3 ">
                  {t("action_header")}
                </th>
              </tr>
            </thead>

            <tbody>
              {cpf_products.map((cpf: ICPMProducts) => (
                <>
                  {cpf.product_packs && (
                    <CPFProduct
                      key={cpf.id}
                      pack={cpf.product_packs}
                      cpfId={cpf.id}
                      eventId={eventId}
                      cpFixed={cpFixed}
                    />
                  )}
                </>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <>
          <h3 className="mb-2 text-xl font-bold">{t("products")}</h3>
          <p className="text-gray-500">{t("no_products")}</p>
        </>
      )}
    </>
  );
}
