'use client';

import Image from 'next/image';
import useFilters from '../../../../hooks/useFilters';
import VerticalFilterMenu from './VerticalFilterMenu';
import React from 'react';
import { Type } from '@/lib/productEnum';
import { IProduct } from '@/lib/types/types';
import { ProductPackStoreItem } from '../../components/cart/ProductPackStoreItem';
import { BoxPackStoreItem } from '../../components/cart/BoxPackStoreItem';

interface Props {
    products: IProduct[];
}

export default function Marketplace({ products }: Props) {
    const { filterProducts } = useFilters();
    const filteredProducts = filterProducts(products);

    return (
        <section>
            <div className="hidden sm:block">
                <figure className="m-auto text-center">
                    <Image
                        className="m-auto"
                        src="/assets/banners/banner-mercado.webp"
                        width={1600}
                        height={263}
                        alt="Marketplace"
                    />
                </figure>
            </div>
            <div className="block sm:hidden">
                <figure className="m-auto text-center">
                    <Image
                        className="m-auto"
                        src="/assets/banners/banner-mercado-mobile.webp"
                        width={1600}
                        height={263}
                        alt="Marketplace"
                    />
                </figure>
            </div>

            <div className="flex">
                {/* Barra lateral de filtros  */}
                <VerticalFilterMenu />

                <section className="w-full grid grid-cols-1 bg-white dark:bg-gray-800 pt-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts &&
                        filteredProducts.map((product) => (
                            <article
                                key={product.id}
                                className=" mb-2 px-2 max-h-[500px]"
                            >
                                {!product.is_for_event &&
                                    product.type === Type.BEER && (
                                        <ProductPackStoreItem
                                            products={products}
                                            product={product}
                                        />
                                    )}

                                {!product.is_for_event &&
                                    product.type === Type.BOX_PACK && (
                                        <BoxPackStoreItem
                                            products={products}
                                            product={product}
                                        />
                                    )}
                            </article>
                        ))}
                </section>
            </div>
        </section>
    );
}
