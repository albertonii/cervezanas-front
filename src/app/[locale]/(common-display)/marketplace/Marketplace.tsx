'use client';

import Image from 'next/image';
import useFilters from '../../../../hooks/useFilters';
import VerticalFilterMenu from './VerticalFilterMenu';
import React from 'react';
import { Type } from '@/lib//productEnum';
import { IProduct } from '@/lib//types/types';
import { Filters } from '@/app/[locale]/components/Filters';
import { MarketplaceHeader } from '@/app/[locale]/components/MarketplaceHeader';
import { BoxPackStoreItem } from '@/app/[locale]/components/Cart/BoxPackStoreItem';
import { ProductPackStoreItem } from '@/app/[locale]/components/Cart/ProductPackStoreItem';

interface Props {
    products: IProduct[];
}

export default function Marketplace({ products }: Props) {
    const { filterProducts } = useFilters();
    const filteredProducts = filterProducts(products);

    return (
        <section>
            <div className="">
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

            <MarketplaceHeader>
                <Filters />
            </MarketplaceHeader>

            <div className="flex">
                {/* Barra lateral de filtros  */}
                <VerticalFilterMenu />

                <section className="w-full grid grid-cols-1 bg-white pt-10 sm:grid-cols-2 grid-cols-3 xl:grid-cols-4">
                    {filteredProducts &&
                        filteredProducts.map((product) => (
                            <article key={product.id} className=" mb-2 px-2">
                                {product.type === Type.BEER && (
                                    <ProductPackStoreItem
                                        products={filteredProducts}
                                        product={product}
                                    />
                                )}

                                {product.type === Type.BOX_PACK && (
                                    <BoxPackStoreItem
                                        products={filteredProducts}
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
