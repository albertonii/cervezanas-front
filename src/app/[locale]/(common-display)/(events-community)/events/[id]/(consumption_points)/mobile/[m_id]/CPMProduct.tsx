import Link from 'next/link';
import DisplayImageProduct from '../../../../../../../components/common/DisplayImageProduct';
import MarketCartButtons2 from '../../../../../../../components/common/MarketCartButtons2';
import React, { useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { SupabaseProps } from '../../../../../../../../../constants';
import {
  ICPMobile,
  IEventProduct,
  IProductPack,
} from '../../../../../../../../../lib/types';
import { formatCurrency } from '../../../../../../../../../utils/formatCurrency';
import { AddCardButton } from '../../../../../../../components/common/AddCartButton';
import useEventCartStore from '../../../../../../../../store/eventCartStore';

interface ProductProps {
  pack: IProductPack;
  cpmId: string;
  eventId: string;
  cpMobile: ICPMobile;
}

export default function CPMProduct({
  pack,
  cpmId,
  eventId,
  cpMobile,
}: ProductProps) {
  const t = useTranslations();
  const locale = useLocale();

  const {
    eventCarts,
    getPackQuantity,
    removeFromCart,
    addPackToCart,
    increaseOnePackCartQuantity,
    decreaseOnePackCartQuantity,
  } = useEventCartStore();

  const { name, price, product_id, products: product, quantity } = pack;

  const [packQuantity, setPackQuantity] = React.useState(0);

  useEffect(() => {
    setPackQuantity(
      getPackQuantity(eventId, pack.product_id, cpMobile.id, pack.id),
    );
  }, [eventCarts]);

  const handleAddToCart = () => {
    if (!pack) {
      return;
    }

    const packCartItem: IProductPack = {
      id: pack.id,
      created_at: pack.created_at,
      quantity: 1,
      price: pack.price,
      name: pack.name,
      img_url: pack.img_url,
      randomUUID: pack.randomUUID,
      product_id: pack.product_id,
      products: pack.products,
    };

    const product = pack.products;

    if (!product) return;

    const productEvent: IEventProduct = {
      id: product.id,
      created_at: product.created_at,
      name: product.name,
      description: product.description,
      type: product.type,
      is_public: product.is_public,
      discount_code: product.discount_code,
      discount_percent: product.discount_percent,
      weight: product.weight,
      price: product.price,
      campaign_id: product.campaign_id,
      is_archived: product.is_archived,
      category: product.category,
      is_monthly: product.is_monthly,
      owner_id: product.owner_id,
      beers: product.beers,
      product_multimedia: product.product_multimedia,
      product_lots: product.product_lots,
      product_inventory: product.product_inventory,
      reviews: product.reviews,
      likes: product.likes,
      awards: product.awards,
      product_packs: product.product_packs,
      cpm_id: cpMobile.id,
      cpf_id: '',
      cp_name: cpMobile.cp_name,
    };

    addPackToCart(eventId, productEvent, packCartItem);
  };

  const handleIncreaseCartQuantity = () => {
    increaseOnePackCartQuantity(eventId, product_id, cpMobile.id, pack.id);
  };

  const handleDecreaseCartQuantity = () => {
    decreaseOnePackCartQuantity(eventId, product_id, cpMobile.id, pack.id);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(eventId, product_id, cpmId, pack.id);
  };

  return (
    <tr
      key={pack.id}
      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <td className="space-x-2 px-6 py-4">
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
          target={'_blank'}
          href={`/consumption_points/products/${cpmId}`}
          locale={locale}
        >
          {product?.name}
        </Link>
      </td>

      <td className="space-x-2 px-6 py-4 font-semibold hover:cursor-pointer hover:text-beer-draft">
        {name}
      </td>

      <td className="space-x-2 px-6 py-4 font-semibold hover:cursor-pointer hover:text-beer-draft">
        {quantity}
      </td>

      <td className="hidden max-w-[14vw] space-x-2 overflow-hidden px-6 py-4 md:block">
        <span className="truncate">{product?.description}</span>
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
