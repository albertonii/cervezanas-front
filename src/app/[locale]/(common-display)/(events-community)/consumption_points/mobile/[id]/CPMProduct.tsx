import Link from "next/link";
import DisplayImageProduct from "../../../../../components/common/DisplayImageProduct";
import MarketCartButtons2 from "../../../../../components/common/MarketCartButtons2";
import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SupabaseProps } from "../../../../../../../constants";
import { IProductPack } from "../../../../../../../lib/types.d";
import { formatCurrency } from "../../../../../../../utils/formatCurrency";
import { useEventCart } from "../../../../../../../../context/EventCartContext";
import { AddCardButton } from "../../../../../components/common/AddCartButton";

interface ProductProps {
  pack: IProductPack;
  cpmId: string;
}

export default function CPMProduct({ pack, cpmId }: ProductProps) {
  const t = useTranslations();
  const locale = useLocale();

  const {
    eventItems,
    getPackQuantity,
    removeFromCart,
    increasePackCartQuantity,
    increaseOnePackCartQuantity,
    decreaseOnePackCartQuantity,
  } = useEventCart();

  const { name, price, product_id, products: product } = pack;

  const [packQuantity, setPackQuantity] = useState<number>(
    getPackQuantity(pack.id)
  );

  // Synch pack with cart
  useEffect(() => {
    setPackQuantity(getPackQuantity(pack.id));
  }, [eventItems]);

  const handleAddToCart = () => {
    if (!pack) {
      return;
    }

    const packCartItem: IProductPack = {
      id: pack.id,
      created_at: pack.created_at,
      quantity: packQuantity + 1,
      price: pack.price,
      name: pack.name,
      img_url: pack.img_url,
      randomUUID: pack.randomUUID,
      product_id: pack.product_id,
      products: pack.products,
    };

    const product = pack.products;
    if (!product) return;

    increasePackCartQuantity(product, packCartItem);
    setPackQuantity(1);
  };

  const handleIncreaseCartQuantity = () => {
    // if (!product_id) return;
    // setPackQuantity(packQuantity + 1);
    increaseOnePackCartQuantity(product_id, pack.id);
  };

  const handleDecreaseCartQuantity = () => {
    // if (!product_id) return;

    // if (packQuantity > 1) {
    //   setPackQuantity(packQuantity - 1);
    decreaseOnePackCartQuantity(product_id, pack.id);
    // }
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product_id, pack.id);
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
          {product?.name}
        </Link>
      </td>

      <td className="space-x-2 px-6 py-4 font-semibold hover:cursor-pointer hover:text-beer-draft">
        {name}
      </td>

      <td className="hidden space-x-2 px-6 py-4 md:block">
        {product?.description}
      </td>

      <td className="space-x-2 px-6 py-4 font-medium  text-green-500">
        {formatCurrency(price)}
      </td>

      <td className="hidden space-x-2 px-6 py-4 md:block">
        {t(product?.type.toLowerCase())}
      </td>

      <td className="space-x-2 px-6 py-4">
        {packQuantity === 0 ? (
          <>
            <AddCardButton withText={true} onClick={() => handleAddToCart()} />
          </>
        ) : (
          <>
            <MarketCartButtons2
              item={pack}
              quantity={packQuantity}
              handleIncreaseCartQuantity={() => handleIncreaseCartQuantity()}
              handleDecreaseCartQuantity={() => handleDecreaseCartQuantity()}
              handleRemoveFromCart={() => {
                handleRemoveFromCart();
              }}
              displayDeleteButton={true}
            />
          </>
        )}
      </td>
    </tr>
  );
}
