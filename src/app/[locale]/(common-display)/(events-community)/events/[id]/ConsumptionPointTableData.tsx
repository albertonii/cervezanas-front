// components/ConsumptionPointTableData.tsx
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import TR from '@/app/[locale]/components/ui/table/TR';
import TD from '@/app/[locale]/components/ui/table/TD';
import { COMMON } from '@/constants';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { ROUTE_CP, ROUTE_EVENTS } from '@/config';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import classNames from 'classnames';

interface CPProps {
    cp: IConsumptionPointEvent;
    eventId: string;
}

export default function ConsumptionPointTableData({ cp, eventId }: CPProps) {
    const locale = useLocale();
    const t = useTranslations('event');

    const statusClasses = classNames(
        'px-4 py-2 text-center rounded-full text-sm font-semibold',
        {
            'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100':
                cp.cp?.status === 'active',
            'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100':
                cp.cp?.status === 'inactive',
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100':
                cp.cp?.status === 'pending', // Ejemplo de estado adicional
        },
    );

    return (
        <TR class_="hover:bg-gray-50 dark:hover:bg-gray-600">
            {/* Logo */}
            <TD class_="hidden sm:table-cell">
                <div className="flex items-center justify-center">
                    <Image
                        src={cp.cp?.logo_url || COMMON.PROFILE_IMG}
                        alt={cp.cp?.cp_name || 'CP Logo'}
                        width={48}
                        height={48}
                        className="object-contain rounded-full"
                        loading="lazy"
                    />
                </div>
            </TD>

            {/* Nombre del Punto de Consumo */}
            <TD class_="text-gray-900 dark:text-gray-100">
                <Link
                    href={`${ROUTE_EVENTS}/${eventId}${ROUTE_CP}/${cp.id}`}
                    locale={locale}
                    className="text-beer-gold dark:text-beer-blonde hover:underline"
                >
                    {cp.cp?.cp_name}
                </Link>
            </TD>

            {/* Fechas */}
            <TD class_="hidden sm:table-cell text-gray-600 dark:text-gray-300">
                {formatDateString(cp.start_date)} -{' '}
                {formatDateString(cp.end_date)}
            </TD>

            {/* Estado */}
            <TD>
                <span className={statusClasses}>{t(cp.cp?.status)}</span>
            </TD>
        </TR>
    );
}
