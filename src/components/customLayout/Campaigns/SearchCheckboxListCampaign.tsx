import React, { ComponentProps, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Campaign, CampaignItem, Product } from "../../../lib/types";
import { Modal } from "../../modals";

interface Props {
  index: number;
  products: Product[];
  campaign: Campaign;
  form: UseFormReturn<any, any>;
  handleResponseLinkProductsModal: ComponentProps<any>;
  handleShowProductsInCampaignModal: ComponentProps<any>;
  handleProductsInCampaign: ComponentProps<any>;
}

export function SearchCheckboxListCampaign({
  index,
  products,
  campaign,
  form,
  handleShowProductsInCampaignModal,
  handleProductsInCampaign,
}: Props) {
  const { t } = useTranslation();

  const { register, getValues } = form;

  // Insert in supabase the CampaignItems related to the campaign
  const api_handleProductsInCampaign = () => {
    const campaignItems: CampaignItem[] = getValues("products");
    const updateItemsLinkedToCampaign = async (
      campaignItems: CampaignItem[]
    ) => {
      handleProductsInCampaign(campaignItems);
    };

    updateItemsLinkedToCampaign(campaignItems);
  };

  const handleAcceptClick = () => {
    api_handleProductsInCampaign();
    handleShowProductsInCampaignModal(false, index);
  };

  return (
    <Modal
      isVisible={true}
      title={"products_in_campaign"}
      btnTitle={"save"}
      description={"select_products_in_campaign_description"}
      handler={() => handleAcceptClick()}
      handlerClose={() => handleShowProductsInCampaignModal(false)}
      classIcon={""}
      classContainer={""}
    >
      <>
        <div className="w-full space-y my-6">
          <div className=" z-10 w-full bg-white rounded shadow dark:bg-gray-700">
            <div className="p-3">
              <label className="sr-only">{t("search")}</label>
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>

                <input
                  type="text"
                  id="input-group-search"
                  className="mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-beer-blonde focus:border-beer-blonde block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search user"
                />
              </div>
            </div>

            <ul
              className="overflow-y-auto px-3 pb-3 h-48 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownSearchButton"
            >
              <form>
                {products.map((product, index) => {
                  return (
                    <li key={product.id}>
                      <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                        {/* Checkbox Name  */}
                        <div>
                          <input
                            id="checkbox-item-11"
                            type="checkbox"
                            {...register(`products.${index}.product_id`)}
                            value={product.id}
                            className="w-4 h-4 text-beer-blonde bg-gray-100 rounded border-gray-300 focus:ring-beer-blonde dark:focus:ring-beer-draft dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label
                            htmlFor={`products.${index}.value`}
                            className="ml-2 w-full text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                          >
                            {product.name}
                          </label>
                        </div>

                        {/* Product Price input inside checkbox  */}
                        <div className="flex space-x-2 items-center justify-center">
                          <label
                            htmlFor={`item.${index}.value`}
                            className="ml-2 w-full text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                          >
                            {t("product_price")}
                          </label>

                          <input
                            type="number"
                            {...register(`products.${index}.product_price`)}
                            defaultValue={0}
                            className="w-16 h-8 text-sm text-gray-900 rounded dark:text-gray-300"
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </form>
            </ul>
          </div>
        </div>
      </>
    </Modal>
  );
}
