import React from 'react';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';

export default function DeliveryError() {
    const t = useTranslations();

    return (
        <address className="flex max-w-xs items-center gap-6 rounded border-red-800 bg-red-100 px-4 py-2 shadow-md ring-1 ring-red-800 sm:max-w-lg lg:max-w-3xl">
            <FontAwesomeIcon
                icon={faCircleExclamation}
                style={{ color: 'red', height: '50px', width: '50px' }}
                title={'Delivery not allowed'}
            />

            <span className="sm:text-md text-balance text-sm text-red-800">
                {t('can_not_deliver_to_address')}
            </span>
        </address>
    );
}
