import React from "react";
import CPMProduct from "./CPMProduct";
import { useTranslations } from "next-intl";
import { ICPMobile, ICPMProducts } from "../../../../../../../../../lib/types";

interface Props {
  cpMobile: ICPMobile;
  eventId: string
}

export default function ProductList({ cpMobile, eventId }: Props) {
  const t = useTranslations();
  const { cpm_products } = cpMobile;

  return (
    <>
      {cpm_products && cpm_products.length > 0 ? (
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
              {cpm_products.map((cpm: ICPMProducts) => (
                <>
                  {cpm.product_packs && (
                    <CPMProduct
                      key={cpm.id}
                      pack={cpm.product_packs}
                      cpmId={cpm.id}
                      eventId={eventId}
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
