'use client';

import useFilters from '../../../../hooks/useFilters';
import React from 'react';
import Image from 'next/image';
import { ProductPackStoreItem } from '@/app/[locale]/components/Cart/ProductPackStoreItem';
import { IProduct } from '@/lib//types/types';
import { MarketplaceHeader } from '@/app/[locale]/components/MarketplaceHeader';
import { BoxPackStoreItem } from '@/app/[locale]/components/Cart/BoxPackStoreItem';
import { Filters } from '@/app/[locale]/components/Filters';
import { Type } from '@/lib//productEnum';

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
                        width={630}
                        height={400}
                        alt="Marketplace"
                    />
                </figure>
            </div>
            <MarketplaceHeader>
                <Filters />
            </MarketplaceHeader>

            <article className="m-auto grid grid-cols-1 bg-white pt-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {filteredProducts &&
                    filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="container mb-6 h-full px-3"
                        >
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
                        </div>
                    ))}
            </article>
        </section>
    );
}
