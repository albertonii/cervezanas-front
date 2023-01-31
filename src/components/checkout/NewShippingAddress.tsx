import React from "react";
import { useTranslation } from "react-i18next";

export default function NewShippingAddress() {
  const { t } = useTranslation();

  return (
    <form id="shipping-info-form" method="POST" action="">
      {/* Shipping information */}
      <section>
        <fieldset className="mb-3 bg-beer-foam rounded">
          {/* Shipping Data */}
          <div className="w-full">
            <h2 className="tracking-wide text-lg font-semibold text-gray-700 my-2">
              {t("shipping_data")}
            </h2>

            <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
              <input
                name="name"
                className="focus:outline-none px-3 w-full mr-6"
                placeholder={`${t("name")}*`}
                required
              />
            </label>

            <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
              <input
                name="lastname"
                className="focus:outline-none px-3 w-full mr-6"
                placeholder={`${t("lastname")}*`}
                required
              />
            </label>

            <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
              <input
                name="documentId"
                className="focus:outline-none px-3 w-full mr-6"
                placeholder={`${t("document_id")}*`}
              />
            </label>

            <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
              <input
                name="phones_number"
                className="focus:outline-none px-3 w-full mr-6"
                placeholder={`${t("loc_phone")}*`}
              />
            </label>
          </div>

          {/* Shipping Address */}
          <div className="w-full mt-6">
            <h2 className="tracking-wide text-lg font-semibold text-gray-700 my-2">
              {t("shipping_address")}
            </h2>

            <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
              <input
                name="address_1"
                className="focus:outline-none px-3 w-full mr-6"
                placeholder={`${t("address")}*`}
              />
            </label>

            <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
              <input
                name="country"
                className="focus:outline-none px-3 w-full mx-6"
                placeholder={`${t("country")}*`}
              />
            </label>

            <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
              <input
                name="postal_code"
                className="focus:outline-none px-3 w-full mx-6"
                placeholder={`${t("loc_pc")}*`}
              />
            </label>

            <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
              <input
                name="town"
                className="focus:outline-none px-3 w-full mx-6"
                placeholder={`${t("loc_town")}*`}
              />
            </label>

            <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
              <input
                name="province"
                className="focus:outline-none px-3 w-full mx-6"
                placeholder={`${t("loc_province")}*`}
              />
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="shipping-checked-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-beer-blonde bg-beer-softBlonde border-bear-light rounded focus:ring-bear-alvine dark:focus:ring-beer-softBlonde dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="shipping-checked-checkbox"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {t("shipping_checkbox")}
            </label>
          </div>
        </fieldset>
      </section>
    </form>
  );
}
