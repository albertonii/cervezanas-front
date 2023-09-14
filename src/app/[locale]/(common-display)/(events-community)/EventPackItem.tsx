import DisplayImageProduct from "../../components/common/DisplayImageProduct";
import MarketCartButtons from "../../components/common/MarketCartButtons";
import React, { useState } from "react";
import { SupabaseProps } from "../../../../constants";
import { IProductPack, IProductPackCartItem } from "../../../../lib/types";
import { useEventCart } from "../../../../context/EventCartContext";

interface Props {
  pack: IProductPack;
  item: IProductPackCartItem;
}

export default function EventPackItem({ pack, item }: Props) {
  const {
    removeFromCart,
    increaseOnePackCartQuantity,
    decreaseOnePackCartQuantity,
  } = useEventCart();

  const [animateRemove, setAnimateRemove] = useState(false);

  const handleIncreaseCartQuantity = () => {
    increaseOnePackCartQuantity(item.id, pack.id);
  };

  const handleDecreaseCartQuantity = () => {
    decreaseOnePackCartQuantity(item.id, pack.id);
  };

  const handleRemoveFromCart = () => {
    setTimeout(() => {
      setAnimateRemove(true);

      removeFromCart(item.id, pack.id);
    }, 500);
  };

  return (
    <div
      className={`flex items-center space-x-2 ${
        animateRemove && "animate-ping overflow-hidden "
      }`}
    >
      <DisplayImageProduct
        imgSrc={
          SupabaseProps.BASE_PRODUCTS_URL + decodeURIComponent(pack.img_url)
        }
        alt={pack.name}
        width={600}
        height={600}
        class="w-[8vw] px-2 py-2 sm:w-[6vw] md:w-[8vw] lg:w-[6vw]"
      />

      <div>
        <h3 className="text-sm text-gray-900">{pack.name}</h3>

        <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
          <div>
            <dt className="inline">Size:</dt>
            <dd className="inline">XXS</dd>
          </div>

          <div>
            <dt className="inline">Color:</dt>
            <dd className="inline">White</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <div className="flex space-x-2">
          <MarketCartButtons
            quantity={pack.quantity}
            item={pack}
            handleIncreaseCartQuantity={() => {
              handleIncreaseCartQuantity();
            }}
            handleDecreaseCartQuantity={() => {
              handleDecreaseCartQuantity();
            }}
            handleRemoveFromCart={() => {
              handleRemoveFromCart();
            }}
            displayDeleteButton={true}
          />
        </div>
      </div>
    </div>
  );
}
