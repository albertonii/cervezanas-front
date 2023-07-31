"use client";

import React from "react";
import { IShippingAddress } from "../../../../lib/types";

interface Props {
  address: IShippingAddress;
}

export default function ShippingAddressItem({ address }: Props) {
  return (
    <>
      <label
        className=" text-product-dark w-full 
                                           dark:bg-gray-800 dark:text-gray-400"
      >
        <div className="block">
          <div className="w-full text-lg font-semibold">
            {address.name} {address.lastname}
          </div>
          <div className="text-md w-full">
            {address.address}, {address.city}, {address.state},{" "}
            {address.zipcode}, {address.country}
          </div>
        </div>
      </label>
    </>
  );
}
