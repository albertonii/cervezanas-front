import React from "react";
import SimilarProduct from "./SimilarProduct";

export default function DisplaySimilarProducts() {
  return (
    <div className="bg-beer-softFoam rounded-lg ">
      <div className="mx-auto max-w-2xl py-6 px-4 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Customers also purchased
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
          <SimilarProduct />
          <SimilarProduct />
          <SimilarProduct />
          <SimilarProduct />
        </div>
      </div>
    </div>
  );
}
