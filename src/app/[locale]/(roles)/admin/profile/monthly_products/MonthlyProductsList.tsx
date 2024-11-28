import Link from 'next/link';

import TH from '@/app/[locale]/components/ui/table/TH';
import TR from '@/app/[locale]/components/ui/table/TR';
import TD from '@/app/[locale]/components/ui/table/TD';
import THead from '@/app/[locale]/components/ui/table/THead';
import Table from '@/app/[locale]/components/ui/table/Table';
import TBody from '@/app/[locale]/components/ui/table/TBody';
import InputSearch from '@/app/[locale]/components/form/InputSearch';
import TDActions from '@/app/[locale]/components/ui/table/TDActions';
import DisplayImageProduct from '@/app/[locale]/components/ui/DisplayImageProduct';
import AddMonthlyProduct from '@/app/[locale]/components/modals/AddMonthlyProduct';
import React, { useMemo, useState } from 'react';
import { SupabaseProps } from '@/constants';
import { useLocale, useTranslations } from 'next-intl';
import { IMonthlyProduct, IProduct } from '@/lib/types/types';
import { EditButton } from '@/app/[locale]/components/ui/buttons/EditButton';
import { DeleteButton } from '@/app/[locale]/components/ui/buttons/DeleteButton';

interface ColumnsProps {
    header: string;
}

interface Props {
    mProducts: IMonthlyProduct[];
    products: IProduct[];
}

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

export default function MonthlyProductsList({ mProducts, products }: Props) {
    const t = useTranslations();
    const locale = useLocale();

    const [query, setQuery] = useState('');

    const [month, setMonth] = useState(0);
    const [year, setYear] = useState(0);

    const [isDeleteShowModal, setIsDeleteShowModal] = useState(false);
    const [productModal, setProductModal] = useState<IMonthlyProduct>();

    const filteredItems = useMemo<IMonthlyProduct[]>(() => {
        if (!mProducts) return [];

        return mProducts.filter((product) => {
            return product.products?.name
                .toLowerCase()
                .includes(query.toLowerCase());
        });
    }, [mProducts, query]);

    const COLUMNS = [
        { header: t('product_type_header') },
        { header: t('name_header') },
        { header: t('category') },
        { header: t('month_year') },
        { header: t('action_header') },
    ];

    const handleDeleteShowModal = (value: boolean) => {
        setIsDeleteShowModal(value);
    };

    const handleProductModal = (product: IMonthlyProduct) => {
        setProductModal(product);
    };

    const handleAddProduct = (product: IMonthlyProduct) => {
        setProductModal(product);
    };

    return (
        <>
            <AddMonthlyProduct
                handleAddProduct={handleAddProduct}
                products={products}
            />

            <section className="relative mt-6 space-y-4 overflow-x-auto p-4 shadow-md sm:rounded-lg">
                {/* Select month and year to see the products and new monthly product btn */}
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center">
                        {/* Month */}
                        <div className="flex flex-row items-center">
                            <label htmlFor="month" className="mr-2">
                                {t('month')}
                            </label>
                            <select
                                id="month"
                                name="month"
                                className="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-8 text-sm text-gray-900 focus:border-beer-blonde focus:ring-beer-blonde  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                value={month}
                                onChange={(e) =>
                                    setMonth(parseInt(e.target.value))
                                }
                            >
                                <option value="0">{t('select_month')}</option>
                                <option value="1">{t('january')}</option>
                                <option value="2">{t('february')}</option>
                                <option value="3">{t('march')}</option>
                                <option value="4">{t('april')}</option>
                                <option value="5">{t('may')}</option>
                                <option value="6">{t('june')}</option>
                                <option value="7">{t('july')}</option>
                                <option value="8">{t('august')}</option>
                                <option value="9">{t('september')}</option>
                                <option value="10">{t('october')}</option>
                                <option value="11">{t('november')}</option>
                                <option value="12">{t('december')}</option>
                            </select>
                        </div>

                        {/* Year */}
                        <div className="ml-4 flex flex-row items-center">
                            <label htmlFor="year" className="mr-2">
                                {t('year')}
                            </label>
                            <select
                                id="year"
                                name="year"
                                value={year}
                                onChange={(e) =>
                                    setYear(parseInt(e.target.value))
                                }
                                className="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-8 text-sm text-gray-900 focus:border-beer-blonde focus:ring-beer-blonde  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            >
                                <option value="0">{t('select_year')}</option>
                                <option value="2023">{t('2023')}</option>
                                <option value="2024">{t('2024')}</option>
                                <option value="2025">{t('2025')}</option>
                            </select>
                        </div>
                    </div>

                    {/* Add new monthly product to the list  */}
                    <div className="flex flex-row justify-end"></div>
                </div>

                <InputSearch
                    query={query}
                    setQuery={setQuery}
                    searchPlaceholder={'search_products'}
                />

                {/* Monthly product table  */}
                <Table>
                    <THead>
                        <TR>
                            {COLUMNS.map(
                                (column: ColumnsProps, index: number) => {
                                    return (
                                        <TH key={index} scope="col">
                                            {column.header}
                                        </TH>
                                    );
                                },
                            )}
                        </TR>
                    </THead>

                    <TBody>
                        {filteredItems &&
                            filteredItems.map((product) => {
                                return (
                                    <TR key={product.product_id}>
                                        <TH
                                            scope="row"
                                            class_="whitespace-nowrap"
                                        >
                                            <DisplayImageProduct
                                                imgSrc={
                                                    BASE_PRODUCTS_URL +
                                                    decodeURIComponent(
                                                        product.products?.product_media?.find(
                                                            (media) =>
                                                                media.is_primary,
                                                        )?.url ?? '',
                                                    )
                                                }
                                                width={128}
                                                height={128}
                                                class="h-8 w-8 rounded-full"
                                                alt="Beer Type"
                                            />
                                        </TH>

                                        <TD class_="font-semibold text-beer-blonde hover:text-beer-draft dark:text-beer-softBlonde">
                                            <Link
                                                href={`/products/${product.product_id}`}
                                                locale={locale}
                                            >
                                                {product.products?.name}
                                            </Link>
                                        </TD>

                                        <TD>{t(product.category)}</TD>
                                        <TD>
                                            {product.month}/{product.year}
                                        </TD>

                                        <TDActions>
                                            <div className="flex space-x-1">
                                                <EditButton
                                                    onClick={() => {
                                                        ('edit');
                                                    }}
                                                />

                                                <DeleteButton
                                                    onClick={() => {
                                                        handleDeleteShowModal(
                                                            true,
                                                        );
                                                        handleProductModal(
                                                            product,
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </TDActions>
                                    </TR>
                                );
                            })}
                    </TBody>
                </Table>

                {/* {isDeleteShowModal && (
                    <DeleteMonthlyProduct
                        products={mProducts ?? []}
                        product={productModal}
                        showModal={isDeleteShowModal}
                        handleDeleteShowModal={handleDeleteShowModal}
                        handleSetProducts={handleDeleteProduct}
                    />
                    )} */}
            </section>
        </>
    );
}
