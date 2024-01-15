"use client";

import React from "react";
import DisplayImageProduct from "./common/DisplayImageProduct";

export function SimilarProducts() {
  return (
    <article className="group relative h-[14vh] w-[20vw] md:h-[18vh] lg:h-[30vh]">
      <figure className="aspect-w-1 aspect-h-1 lg:aspect-none w-full overflow-hidden bg-gray-200 group-hover:opacity-75 lg:h-60">
        <DisplayImageProduct
          width={240}
          height={240}
          alt="Principal Product Image store item"
          imgSrc={
            "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"
          }
          class={"rounded-sm hover:cursor-pointer"}
          objectFit={"cover"}
          // onClick={() => router.push(`/${locale}/products/${product.id}`)}
        />
      </figure>

      <div className="mt-4 flex justify-between">
        <h3 className="text-sm text-beer-draft">
          <a href="#">
            <span aria-hidden="true" className="absolute inset-0"></span>
            Basic Tee
          </a>
        </h3>
        <p className="mt-1 text-sm text-gray-500">Black</p>

        <p className="text-sm font-medium text-gray-900">$35</p>
      </div>
    </article>
  );
}
