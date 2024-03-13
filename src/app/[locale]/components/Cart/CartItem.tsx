'use client';

import { useTranslations } from 'next-intl';
import { IProductPackCartItem } from '../../../../lib/types/types';
import { CartPackItem } from './CartPackItem';

type Props = {
  item: IProductPackCartItem;
};

export function CartItem({ item }: Props) {
  const t = useTranslations();

  return (
    <>
      {item && (
        <div data-testid={'cart-item'}>
          <span>
            <p className="font-semibold">{t('product_name')}:</p> {item.name}
          </span>

          {item.packs.map((pack) => (
            <div key={pack.id}>
              <CartPackItem item={item} pack={pack} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
