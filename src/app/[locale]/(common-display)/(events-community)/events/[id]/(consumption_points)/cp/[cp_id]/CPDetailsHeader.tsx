import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { formatDateString } from '@/utils/formatDate';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';

interface Props {
    cpEvent: IConsumptionPointEvent;
}

export default function CPDetailsHeader({ cpEvent }: Props) {
    const t = useTranslations();

    const [isExpanded, setIsExpanded] = useState(false);

    const MAX_DESCRIPTION_LENGTH = 150; // Número máximo de caracteres antes de truncar

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const renderDescription = () => {
        if (
            cpEvent.cp_description.length <= MAX_DESCRIPTION_LENGTH ||
            isExpanded
        ) {
            return cpEvent.cp_description;
        }
        return `${cpEvent.cp_description.substring(
            0,
            MAX_DESCRIPTION_LENGTH,
        )}...`;
    };

    return (
        <article className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner space-y-4">
            {/* Título y Descripción */}
            <header>
                <Title size="xlarge" color="gray">
                    {cpEvent.cp_name}
                </Title>

                <div className="mt-2 text-sm text-gray-100 dark:text-gray-400">
                    <Label color="gray">{renderDescription()}</Label>
                    {cpEvent.cp_description.length > MAX_DESCRIPTION_LENGTH && (
                        <button
                            onClick={toggleExpand}
                            className="ml-2 text-beer-gold dark:text-beer-blonde font-semibold underline hover:text-beer-draft"
                        >
                            {isExpanded ? t('show_less') : t('show_more')}
                        </button>
                    )}
                </div>
            </header>

            {/* Información de Fechas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label color="gray" size="small">
                        {t('start_date')}:
                    </Label>
                    <Label color="black" size="small">
                        {formatDateString(cpEvent.start_date)}
                    </Label>
                </div>

                <div>
                    <Label color="gray" size="small">
                        {t('end_date')}:
                    </Label>
                    <Label color="black" size="small">
                        {formatDateString(cpEvent.end_date)}
                    </Label>
                </div>
            </div>

            {/* Información del Organizador */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <Label color="gray" size="small">
                        {t('organizer')}:
                    </Label>
                    <Label color="black" size="small">
                        {cpEvent.cp?.organizer_name}{' '}
                        {cpEvent.cp?.organizer_lastname}
                    </Label>
                </div>

                <div>
                    <Label color="gray" size="small">
                        {t('email')}:
                    </Label>
                    <Label color="black" size="small">
                        {cpEvent.cp?.organizer_email}
                    </Label>
                </div>

                <div>
                    <Label color="gray" size="small">
                        {t('phone')}:
                    </Label>
                    <Label color="black" size="small">
                        {cpEvent.cp?.organizer_phone}
                    </Label>
                </div>
            </div>
        </article>
    );
}
