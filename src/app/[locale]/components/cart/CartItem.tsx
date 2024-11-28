'use client';

import { useLocale, useTranslations } from 'next-intl';
import { IProductPackCartItem } from '@/lib//types/types';
import { CartPackItem } from './CartPackItem';
import classNames from 'classnames';
import Link from 'next/link';

type Props = {
    item: IProductPackCartItem;
};

export function CartItem({ item }: Props) {
    const locale = useLocale();

    return (
        <>
            {item && (
                <div data-testid={'cart-item'} className="my-4">
                    <Link href={`/products/${item.product_id}`} locale={locale}>
                        <span className="text-beer-draft hover:underline hover:text-beer-gold font-semibold sm:text-xl transition-all ease-in-out duration-200 dark:text-white">
                            {item.name}
                        </span>
                    </Link>

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
