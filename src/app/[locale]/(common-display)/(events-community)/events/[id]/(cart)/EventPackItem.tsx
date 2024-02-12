import DisplayImageProduct from '../../../../../components/common/DisplayImageProduct';
import MarketCartButtons from '../../../../../components/common/MarketCartButtons';
import React, { useState } from 'react';
import { SupabaseProps } from '../../../../../../../constants';
import {
  IProductPack,
  IProductPackEventCartItem,
} from '../../../../../../../lib/types';
import { formatCurrency } from '../../../../../../../utils/formatCurrency';
import useEventCartStore from '../../../../../../store/eventCartStore';

interface Props {
  pack: IProductPack;
  item: IProductPackEventCartItem;
  eventId: string;
}

export default function EventPackItem({ pack, item, eventId }: Props) {
  const cpId = item.cpm_id !== '' ? item.cpm_id : item.cpf_id;

  const {
    removeFromCart,
    increaseOnePackCartQuantity,
    decreaseOnePackCartQuantity,
  } = useEventCartStore();

  const [animateRemove, setAnimateRemove] = useState(false);

  const handleIncreaseCartQuantity = () => {
    increaseOnePackCartQuantity(eventId, item.product_id, cpId, pack.id);
  };

  const handleDecreaseCartQuantity = () => {
    decreaseOnePackCartQuantity(eventId, item.product_id, cpId, pack.id);
  };

  const handleRemoveFromCart = () => {
    setTimeout(() => {
      setAnimateRemove(true);

      removeFromCart(eventId, item.product_id, cpId, pack.id);
    }, 500);
  };

  return (
    <section
      className={`flex items-center space-x-2 ${
        animateRemove && 'animate-ping overflow-hidden '
      }`}
    >
      <DisplayImageProduct
        imgSrc={
          SupabaseProps.BASE_PRODUCTS_URL + decodeURIComponent(pack.img_url)
        }
        alt={pack.name}
        width={200}
        height={200}
        class="w-[6vw] px-2 py-2 sm:w-[5vw] md:w-[6vw] lg:w-[5vw]"
      />

      <h3 className="text-sm text-gray-900">{pack.name}</h3>

      <div className="flex flex-1 items-center justify-end gap-2 space-x-2">
        <p className="xl:text-md text-base leading-6 dark:text-white">
          {formatCurrency(pack.price)}
        </p>

        <MarketCartButtons
          item={pack}
          quantity={pack.quantity}
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
    </section>
  );
}
