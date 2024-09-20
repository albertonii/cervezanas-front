import React, { ComponentProps, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { ICampaign, ICampaignItem, IProduct } from '@/lib//types/types';
import Modal from '@/app/[locale]/components/modals/Modal';
import InputSearch from '@/app/[locale]/components/form/InputSearch';

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
    const t = useTranslations();
    const [query, setQuery] = useState('');

    const [showModal, setShowModal] = useState<boolean>(false);

    const { register, getValues } = form;

    // Insert in supabase the CampaignItems related to the campaign
    const api_handleProductsInCampaign = () => {
        const campaignItems: ICampaignItem[] = getValues('products');

        const updateItemsLinkedToCampaign = async (
            campaignItems: ICampaignItem[],
        ) => {
            handleProductsInCampaign(campaignItems);
        };

        updateItemsLinkedToCampaign(campaignItems);
    };

    const handleAcceptClick = async () => {
        api_handleProductsInCampaign();
        handleShowProductsInCampaignModal(false, index);
        setShowModal(false);
    };

    const filteredItemsByProductName = useMemo(() => {
        if (!products) return [];
        return products.filter((product) => {
            return product.name.toLowerCase().includes(query.toLowerCase());
        });
    }, [products, query]);

    return (
        <Modal
            showModal={showModal}
            setShowModal={setShowModal}
            title={'products_in_campaign'}
            btnTitle={'save'}
            description={'select_products_in_campaign_description'}
            handler={handleAcceptClick}
            handlerClose={() => handleShowProductsInCampaignModal(false)}
            classIcon={''}
            classContainer={''}
        >
            <div className="my-6 w-full">
                <div className=" z-10 w-full rounded bg-white shadow dark:bg-gray-700">
                    <InputSearch
                        query={query}
                        setQuery={setQuery}
                        searchPlaceholder={'search_campaigns'}
                    />

                    <ul
                        className="h-48 overflow-y-auto px-3 pb-3 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownSearchButton"
                    >
                        <form>
                            {filteredItemsByProductName.map(
                                (product, index) => {
                                    return (
                                        <li key={product.id}>
                                            <div className="flex items-center justify-between rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                                                {/* Checkbox Name  */}
                                                <div>
                                                    <input
                                                        id="checkbox-item-11"
                                                        type="checkbox"
                                                        {...register(
                                                            `products.${index}.product_id`,
                                                        )}
                                                        value={product.id}
                                                        className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
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
                                                        {t('product_price')}
                                                    </label>

                                                    <input
                                                        type="number"
                                                        {...register(
                                                            `products.${index}.product_price`,
                                                        )}
                                                        defaultValue={0}
                                                        className="h-8 w-16 rounded text-sm text-gray-900 dark:text-gray-300"
                                                    />
                                                </div>
                                            </div>
                                        </li>
                                    );
                                },
                            )}
                        </form>
                    </ul>
                </div>
            </div>
        </Modal>
    );
}
