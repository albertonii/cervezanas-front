import Image from 'next/image';
import React from 'react';
import Button from '@/app/[locale]/components/common/Button';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatCurrency';

export default function CarrierDetails() {
    const t = useTranslations();

    return (
        <div>
            <div className="flex w-full items-center justify-between bg-white p-4 rounded-lg shadow-md dark:bg-gray-700">
                <div className="flex items-center space-x-4">
                    <figure className="h-10 w-10">
                        <Image
                            width={40}
                            height={40}
                            className="h-full w-full"
                            alt="logo"
                            src="https://i.ibb.co/L8KSdNQ/image-3.png"
                            loader={() =>
                                'https://i.ibb.co/L8KSdNQ/image-3.png'
                            }
                        />
                    </figure>
                    <div className="flex flex-col">
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                            DPD Delivery
                        </p>
                        <span className="text-sm text-gray-500 dark:text-gray-300">
                            {t('delivery_24h')}
                        </span>
                    </div>
                </div>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {formatCurrency(0)}
                </p>
            </div>

            <div className="flex w-full justify-center">
                <Button
                    title={t('view_carrier_details') ?? 'View details'}
                    accent
                    medium
                    class="w-full text-base font-medium"
                >
                    {t('view_carrier_details')}
                </Button>
            </div>
        </div>
    );
}
