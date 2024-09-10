'use client';

import React from 'react';
import DisplayImageProduct from './common/DisplayImageProduct';

export function SimilarProducts() {
    return (
        <article className="mb-10">
            <figure className="aspect-w-1 aspect-h-1 lg:aspect-none w-full overflow-hidden bg-white group-hover:opacity-75">
                <DisplayImageProduct
                    width={240}
                    height={240}
                    alt="Principal Product Image store item"
                    imgSrc={
                        'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg'
                    }
                    class={'m-auto rounded-sm hover:cursor-pointer'}
                    objectFit={'cover'}
                    // onClick={() => router.push(`/${locale}/products/${product.id}`)}
                />
            </figure>

            <div className="mt-4 block justify-between xl:flex">
                <h3 className="text-sm text-beer-draft">
                    <a className="text-xl font-semibold" href="#">
                        <span aria-hidden="true" className=""></span>
                        Basic Tee
                    </a>
                </h3>
                <p className="text-gray mt-1 text-lg font-semibold">Black</p>

                <p className="w-[60px] rounded-full bg-beer-softBlondeBubble p-4 text-xl font-semibold text-gray-900">
                    35€
                </p>
            </div>
        </article>
    );
}
