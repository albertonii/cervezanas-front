import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames';
import TR from '@/app/[locale]/components/ui/table/TR';
import TD from '@/app/[locale]/components/ui/table/TD';
import CPProductCollapsableItem from './CPProductCollapsableItem';
import React, { useState } from 'react';
import { COMMON } from '@/constants';
import { ROUTE_CP, ROUTE_EVENTS } from '@/config';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import {
    ChevronDownIcon,
    ChevronRightIcon,
    ArrowRightIcon,
} from 'lucide-react';
import {
    IConsumptionPointEvent,
    IConsumptionPointProduct,
} from '@/lib/types/consumptionPoints';

interface CPProps {
    cp: IConsumptionPointEvent;
    eventId: string;
}

const ConsumptionPointTableData: React.FC<CPProps> = ({ cp, eventId }) => {
    const locale = useLocale();
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);

    const activeCPProducts = cp?.cp_products?.filter(
        (cp_product: IConsumptionPointProduct) => cp_product.is_active,
    );

    const statusClasses = classNames(
        'px-2 sm:px-4 py-1 sm:py-2 text-center rounded-full text-sm font-semibold',
        {
            'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100':
                cp.cp?.status === 'active',
            'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100':
                cp.cp?.status === 'inactive',
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100':
                cp.cp?.status === 'pending', // Ejemplo de estado adicional
        },
    );

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <TR
                class_="hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                onClick={toggleDropdown}
            >
                {/* Indicador Desplegable */}
                <TD class_="w-8 text-center">
                    {isOpen ? (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                        <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                    )}
                </TD>

                {/* Logo */}
                <TD class_="hidden sm:table-cell">
                    <div className="flex items-center justify-center">
                        <Image
                            src={cp.cp?.logo_url || COMMON.PROFILE_IMG}
                            alt={cp.cp_name || 'CP Logo'}
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
                        className="flex items-center text-beer-gold dark:text-beer-blonde hover:underline"
                        onClick={(e) => e.stopPropagation()} // Evitar que el clic en el enlace seleccione el CP
                    >
                        {cp.cp_name}
                        <ArrowRightIcon className="ml-1 h-4 w-4 text-current" />
                    </Link>
                </TD>

                {/* Fechas */}
                <TD class_="hidden sm:table-cell text-gray-600 dark:text-gray-300">
                    {formatDateString(cp.start_date)} -{' '}
                    {formatDateString(cp.end_date)}
                </TD>

                {/* Estado */}
                <TD class_="hidden sm:table-cell">
                    <span className={statusClasses}>{t(cp.status)}</span>
                </TD>
            </TR>

            {isOpen && (
                <TR>
                    <TD colSpan={5} class_="p-0">
                        {activeCPProducts?.map(
                            (product: IConsumptionPointProduct) => (
                                <CPProductCollapsableItem
                                    key={product.id}
                                    eventId={eventId}
                                    cpProduct={product}
                                    cpEvent={cp}
                                />
                            ),
                        )}
                    </TD>
                </TR>
            )}
        </>
    );
};

export default ConsumptionPointTableData;
