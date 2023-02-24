import React, { useEffect, useState } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Campaign, CampaignItem, Product } from "../../lib/types";
import { supabase } from "../../utils/supabaseClient";
import { Modal } from "../modals";

interface Props {
  products: Product[];
  campaign: Campaign;
  form: UseFormReturn<any, any>;
  handleProductsInCampaign: React.Dispatch<React.SetStateAction<any>>;
}

export function SearchCheckboxListCampaign({
  products,
  campaign,
  form,
}: Props) {
  const { t } = useTranslation();

  const { control, register, getValues } = form;

  const { fields, append, remove } = useFieldArray({
    name: "products",
    control,
  });

  const [productsInCampaign, setProductsInCampaign] = useState<CampaignItem[]>(
    []
  );
  const [acceptProductsCampaign, setAcceptProductsCampaign] =
    useState<boolean>(false);
  const [isShowProductsInCampaignModal, setShowProductsInCampaignModal] =
    useState<boolean>(false);

  // Insert in supabase the CampaignItems related to the campaign
  const handleProductsInCampaign = async () => {
    // Get products selected in checkbox

    // Create object Campaign Item
    getValues("products").map((item: CampaignItem) => {
      const campaignItem: CampaignItem = {
        campaign_id: campaign.id,
        product_id: item.product_id,
        discount: item.discount,
      };

      setProductsInCampaign([...productsInCampaign, campaignItem]);
    });

    if (productsInCampaign.length === 0) return;

    // Insert all the objects selected to supabase API
    const { error: itemsCampaignError } = await supabase
      .from("campaign_items")
      .insert(productsInCampaign);

    if (itemsCampaignError) throw itemsCampaignError;

    // Update list of products related to the campaign
    const { error: campaignError } = await supabase
      .from("campaigns")
      .update({ products: productsInCampaign })
      .eq("id", campaign.id);

    if (campaignError) throw campaignError;

    setAcceptProductsCampaign(true);
  };

  const handleProductsInCampaignShowModal = (value: boolean) => {
    setShowProductsInCampaignModal(value);
  };

  return (
    <Modal
      isVisible={true}
      title={"products_in_campaign"}
      btnTitle={"save"}
      description={"select_products_in_campaign_description"}
      handler={() => handleProductsInCampaign()}
      handlerClose={() => handleProductsInCampaignShowModal(false)}
      classIcon={""}
      classContainer={""}
    >
      <>
        <div className="section container"></div>
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                        <div>
                          <input
                            id="checkbox-item-11"
                            type="checkbox"
                            {...register(`products.${index}.value`)}
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

                        {/* discount input inside checkbox  */}
                        <div className="flex space-x-2 items-center justify-center">
                          <label
                            htmlFor={`item.${index}.value`}
                            className="ml-2 w-full text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                          >
                            {t("discount")} (%)
                          </label>
                          <input
                            type="number"
                            {...register(`products.${index}.discount`)}
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
