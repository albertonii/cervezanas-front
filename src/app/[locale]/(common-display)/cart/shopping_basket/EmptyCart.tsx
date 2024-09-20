import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocale, useTranslations } from 'next-intl';
import {
    faCircleExclamation,
    faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function EmptyCart() {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <section className="container mt-6">
            {/* Cart Empty Icon */}
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="mb-4">
                    <FontAwesomeIcon
                        icon={faShoppingCart}
                        style={{ color: '#432a14', height: '40px' }}
                        title={t('empty_cart') ?? 'empty_cart'}
                        width={80}
                        height={80}
                    />

                    <FontAwesomeIcon
                        icon={faCircleExclamation}
                        style={{ color: '#fdc300', height: '40px' }}
                        title={'circle_warning'}
                        width={80}
                        height={80}
                    />
                </div>
                <h2 className="text-xl font-semibold uppercase text-black">
                    {t('your_empty_cart')}
                </h2>

                <div className="mt-4 items-center  space-y-2 text-base text-black">
                    {t('add_products_to_continue')}
                </div>

                {/* Link para ir hacia el marketplace  */}
                <Link href="/marketplace" locale={locale}>
                    <button className="border-2 border-beer-blonde bg-beer-softBlonde hover:bg-beer-blonde inline-flex items-center justify-center rounded-md border transition duration-200 ease-in-out px-1 sm:px-4 text-base font-semibold">
                        {t('go_to_marketplace')}
                    </button>
                </Link>
            </div>
        </section>
    );
}
