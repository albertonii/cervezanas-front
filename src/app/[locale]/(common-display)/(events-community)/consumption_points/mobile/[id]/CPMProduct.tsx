import Link from "next/link";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { useEventCartContext } from "../../../../../../../components/Context/EventCartContext";
import { IProductPack } from "../../../../../../../lib/types";
import { formatCurrency } from "../../../../../../../utils";
import { AddCardButton } from "../../../../../../../components/common/AddCartButton";
import MarketCartButtons from "../../../../../../../components/common/MarketCartButtons2";
import { SupabaseProps } from "../../../../../../../constants";
import DisplayImageProduct from "../../../../../../../components/common/DisplayImageProduct";

interface ProductProps {
  pack: IProductPack;
  cpmId: string;
}

export default function CPMProduct({ pack, cpmId }: ProductProps) {
  const t = useTranslations();
  const locale = useLocale();

  const {
    marketplaceEventItems,
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    removeMarketplaceItems,
  } = useEventCartContext();

  const quantity = getItemQuantity(pack.id);

  const { id, name, price, product_id } = pack;

  const handleIncreaseToCartItem = () => {
    increaseCartQuantity(id);

    // Check if the product is already in the marketplace items
    if (marketplaceEventItems.find((item) => item.id === id)) return;

    // addMarketplaceItems(product);
  };

  const handleDecreaseFromCartItem = () => {
    decreaseCartQuantity(id);
    if (quantity > 1) return;
    removeMarketplaceItems(id);
  };

  const handleRemoveFromCart = () => {
    removeMarketplaceItems(id);
    removeFromCart(id);
  };

  return (
    <tr
      key={pack.id}
      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <td className=" space-x-2 px-6 py-4">
        <DisplayImageProduct
          imgSrc={
            SupabaseProps.BASE_PRODUCTS_URL + decodeURIComponent(pack.img_url)
          }
          alt={pack.name}
          width={600}
          height={600}
          class="w-[10vw] px-2 py-2 sm:w-[15vw] md:w-[20vw] lg:w-[6vw]"
        />
      </td>
      <td className="space-x-2 px-6 py-4 font-semibold hover:cursor-pointer hover:text-beer-draft">
        <Link
          target={"_blank"}
          href={`/consumption_points/products/${cpmId}`}
          locale={locale}
        >
          {name}
        </Link>
      </td>

      <td className="space-x-2 px-6 py-4">{product_id?.description}</td>

      <td className="space-x-2 px-6 py-4 font-medium  text-green-500">
        {formatCurrency(price)}
      </td>

      <td className="space-x-2 px-6 py-4">
        {t(product_id?.type.toLowerCase())}
      </td>

      <td className="space-x-2 px-6 py-4">
        {quantity === 0 ? (
          <>
            <AddCardButton onClick={() => handleIncreaseToCartItem()} />
          </>
        ) : (
          <>
            <MarketCartButtons
              quantity={quantity}
              item={pack}
              handleIncreaseCartQuantity={() => handleIncreaseToCartItem()}
              handleDecreaseCartQuantity={() => handleDecreaseFromCartItem()}
            />
          </>
        )}
      </td>
    </tr>
  );
}
