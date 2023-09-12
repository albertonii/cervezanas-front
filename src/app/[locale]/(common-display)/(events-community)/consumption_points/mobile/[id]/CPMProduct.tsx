import Link from "next/link";
import DisplayImageProduct from "../../../../../../../components/common/DisplayImageProduct";
import MarketCartButtons2 from "../../../../../../../components/common/MarketCartButtons2";
import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useEventCart } from "../../../../../../../components/Context/EventCartContext";
import { formatCurrency } from "../../../../../../../utils";
import { AddCardButton } from "../../../../../../../components/common/AddCartButton";
import { SupabaseProps } from "../../../../../../../constants";
import { IProductPack } from "../../../../../../../lib/types";

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
    increasePackCartQuantity,
    increaseOnePackCartQuantity,
    decreaseOnePackCartQuantity,
  } = useEventCart();

  const { name, price, product_id } = pack;
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
      quantity: packQuantity + 1,
      price: pack.price,
      name: pack.name,
      img_url: pack.img_url,
      randomUUID: pack.randomUUID,
      product_id: pack.product_id,
    };

    const product = pack.product_id;
    if (!product) return;

    increasePackCartQuantity(product, packCartItem);
    setPackQuantity(1);
  };

  const handleIncreaseCartQuantity = (pack: IProductPack) => {
    if (!product_id) return;
    setPackQuantity(packQuantity + 1);
    increaseOnePackCartQuantity(product_id.id, pack.id);
  };

  const handleDecreaseCartQuantity = (pack: IProductPack) => {
    if (!product_id) return;

    if (packQuantity > 1) {
      setPackQuantity(packQuantity - 1);
      decreaseOnePackCartQuantity(product_id.id, pack.id);
    }
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
        {packQuantity === 0 ? (
          <>
            <AddCardButton withText={true} onClick={() => handleAddToCart()} />
          </>
        ) : (
          <>
            <MarketCartButtons2
              quantity={packQuantity}
              handleIncreaseCartQuantity={() =>
                handleIncreaseCartQuantity(pack)
              }
              handleDecreaseCartQuantity={() =>
                handleDecreaseCartQuantity(pack)
              }
            />
          </>
        )}
      </td>
    </tr>
  );
}
