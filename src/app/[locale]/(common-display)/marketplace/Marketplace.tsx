'use client';

import useFilters from '../../../../hooks/useFilters';
import React from 'react';
import Image from 'next/image';
import { ProductPackStoreItem } from '../../components/Cart/ProductPackStoreItem';
import { IProduct } from '../../../../lib/types/types';
import { Filters } from '../../components/Filters';
import { MarketplaceHeader } from '../../components/MarketplaceHeader';
import { Type } from '../../../../lib/productEnum';
import { BoxPackStoreItem } from '../../components/Cart/BoxPackStoreItem';

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
