import React from "react";
import Image from "next/image";

export default function SimilarProduct() {
  return (
    <div className="group relative w-[20vw] h-[14vh] md:h-[18vh] lg:h-[30vh]">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-60">
        <Image
          fill
          src="https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"
          alt="Front of men&#039;s Basic Tee in black."
          className=" object-cover object-center rounded-sm "
        />
      </div>

      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-beer-draft">
            <a href="#">
              <span aria-hidden="true" className="absolute inset-0"></span>
              Basic Tee
            </a>
          </h3>
          <p className="mt-1 text-sm text-gray-500">Black</p>
        </div>
        <p className="text-sm font-medium text-gray-900">$35</p>
      </div>
    </div>
  );
}
