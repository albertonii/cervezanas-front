import Link from 'next/link';
import Label from '@/app/[locale]/components/ui/Label';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocale, useTranslations } from 'next-intl';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

export default function EventEmptyCart() {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <section className="flex flex-col items-center justify-center space-y-6 p-6 bg-gray-50 rounded-lg shadow-md">
            {/* Icono del carrito vacío */}
            <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center justify-center w-24 h-24 bg-beer-softBlonde rounded-full shadow-lg">
                    <FontAwesomeIcon
                        icon={faShoppingCart}
                        style={{ color: '#f5a623' }}
                        size="2x"
                    />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 uppercase">
                    {t('your_empty_cart')}
                </h2>
                <Label color="gray" size="small">
                    {t('add_products_to_continue')}
                </Label>
            </div>
        </section>
    );
}