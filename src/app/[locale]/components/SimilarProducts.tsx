"use client";

import React from "react";
import DisplayImageProduct from "./common/DisplayImageProduct";

export function SimilarProducts() {
  return (
    <article className="mb-10">
      <figure className="aspect-w-1 aspect-h-1 lg:aspect-none w-full overflow-hidden group-hover:opacity-75 bg-white">
        <DisplayImageProduct
          width={240}
          height={240}
          alt="Principal Product Image store item"
          imgSrc={
            "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"
          }
          class={"rounded-sm hover:cursor-pointer m-auto"}
          objectFit={"cover"}
          // onClick={() => router.push(`/${locale}/products/${product.id}`)}
        />
      </figure>

      <div className="mt-4 xl:flex block justify-between">
        <h3 className="text-sm text-beer-draft">
          <a className="font-semibold text-xl" href="#">
            <span aria-hidden="true" className="absolute inset-0"></span>
            Basic Tee
          </a>
        </h3>
        <p className="mt-1 text-lg text-gray font-semibold">Black</p>

        <p className="text-xl text-gray-900 font-semibold bg-beer-softBlondeBubble rounded-full p-4 w-[60px]">$35</p>
      </div>
    </article>
  );
}
