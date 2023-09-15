import DeliveryError from "../../(common-display)/cart/DeliveryError";
import useFetchShippingByOwnerId from "../../../../hooks/useFetchShippingByOwnerId";
import React, { useState } from "react";
import { IShippingAddress } from "../../../../lib/types.d";
import { useAuth } from "../../Auth/useAuth";
import { useTranslations } from "next-intl";

export default function ShippingAddress() {
  const t = useTranslations();
  const { user } = useAuth();

  const [selectedAddress, setSelectedAddress] = useState<IShippingAddress>();

  const {
    data: shippingAddresses,
    error: shippingAddressesError,
    isLoading: shippingAddressesLoading,
  } = useFetchShippingByOwnerId(user?.id as string);

  if (shippingAddressesLoading) return <div>Loading...</div>;

  if (shippingAddressesError) return <div>Error</div>;

  return (
    <section className="space-y-4">
      <div className="">
        {t("send_to")}
        <select
          className="text-md w-full rounded-md border-2 border-beer-softBlondeBubble  py-1 after:absolute after:right-4 after:top-4 after:w-36 focus:border-beer-blonde  focus:bg-beer-softFoam focus:outline-none lg:text-lg "
          id="is_external_organizer"
          onClick={(e: any) => {
            const value = e.target.value;
            shippingAddresses?.find((address: IShippingAddress) => {
              if (address.id === value) {
                setSelectedAddress(address);
              }
            });
          }}
        >
          <option key={1} value={1}>
            {t("select")}
          </option>
          {shippingAddresses?.map((address: IShippingAddress) => (
            <option key={address.id} value={address.id}>
              <div className="h-40 gap-2 space-x-2 p-4 ">
                <span>{address.address} </span>
                <span>{address.city} </span>
                <span>{address.state} </span>
                <span>{address.country} </span>
              </div>
            </option>
          ))}
        </select>
      </div>

      <DeliveryError />
    </section>
  );
}
