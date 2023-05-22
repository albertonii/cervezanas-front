import React, { ComponentProps, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ICampaign, ICampaignItem, IProduct } from "../../../lib/types.d";
import { Modal } from "../../modals";

interface Props {
  index: number;
  products: IProduct[];
  campaign: ICampaign;
  form: UseFormReturn<any, any>;
  handleResponseLinkProductsModal: ComponentProps<any>;
  handleShowProductsInCampaignModal: ComponentProps<any>;
  handleProductsInCampaign: ComponentProps<any>;
}

export function SearchCheckboxListCampaign({
  index,
  products,
  // campaign,
  form,
  handleShowProductsInCampaignModal,
  handleProductsInCampaign,
}: Props) {
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState<boolean>(false);

  const { register, getValues } = form;

  // Insert in supabase the CampaignItems related to the campaign
  const api_handleProductsInCampaign = () => {
    const campaignItems: ICampaignItem[] = getValues("products");

    const updateItemsLinkedToCampaign = async (
      campaignItems: ICampaignItem[]
    ) => {
      handleProductsInCampaign(campaignItems);
    };

    updateItemsLinkedToCampaign(campaignItems);
  };

  const handleAcceptClick = () => {
    api_handleProductsInCampaign();
    handleShowProductsInCampaignModal(false, index);
    setShowModal(false);
  };

  return (
    <Modal
      showModal={showModal}
      setShowModal={setShowModal}
      title={"products_in_campaign"}
      btnTitle={"save"}
      description={"select_products_in_campaign_description"}
      handler={() => handleAcceptClick()}
      handlerClose={() => handleShowProductsInCampaignModal(false)}
      classIcon={""}
      classContainer={""}
    >
      <>
        <div className="space-y my-6 w-full">
          <div className=" z-10 w-full rounded bg-white shadow dark:bg-gray-700">
            <div className="p-3">
              <label className="sr-only">{t("search")}</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-gray-500 dark:text-gray-400"
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
                  className="mb-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-beer-blonde focus:ring-beer-blonde  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Search campaign"
                />
              </div>
            </div>

            <ul
              className="h-48 overflow-y-auto px-3 pb-3 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownSearchButton"
            >
              <form>
                {products.map((product, index) => {
                  return (
                    <li key={product.id}>
                      <div className="flex items-center justify-between rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                        {/* Checkbox Name  */}
                        <div>
                          <input
                            id="checkbox-item-11"
                            type="checkbox"
                            {...register(`products.${index}.product_id`)}
                            value={product.id}
                            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                          />
                          <label
                            htmlFor={`products.${index}.value`}
                            className="ml-2 w-full rounded text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            {product.name}
                          </label>
                        </div>

                        {/* Product Price input inside checkbox  */}
                        <div className="flex items-center justify-center space-x-2">
                          <label
                            htmlFor={`item.${index}.value`}
                            className="ml-2 w-full rounded text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            {t("product_price")}
                          </label>

                          <input
                            type="number"
                            {...register(`products.${index}.product_price`)}
                            defaultValue={0}
                            className="h-8 w-16 rounded text-sm text-gray-900 dark:text-gray-300"
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
