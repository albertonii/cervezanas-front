import React, { useState } from 'react';
import Label from '@/app/[locale]/components/ui/Label';
import Title from '@/app/[locale]/components/ui/Title';
import { useTranslations } from 'next-intl';
import { formatDateString } from '@/utils/formatDate';
import { ChipCard } from '@/app/[locale]/components/ui/ChipCard';
import { IEvent } from '@/lib/types/eventOrders';

interface EventHeaderProps {
    event: IEvent;
}

export default function DisplayEventHeader({
    event: { name, description, start_date, end_date, status },
}: EventHeaderProps) {
    const t = useTranslations();
    const [isExpanded, setIsExpanded] = useState(false);

    const MAX_DESCRIPTION_LENGTH = 150; // Número máximo de caracteres antes de truncar

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const renderDescription = () => {
        if (description.length <= MAX_DESCRIPTION_LENGTH || isExpanded) {
            return description;
        }
        return `${description.substring(0, MAX_DESCRIPTION_LENGTH)}...`;
    };

    return (
        <div className="bg-gradient-to-r from-beer-blonde to-beer-gold dark:from-gray-700 dark:to-gray-900 rounded-lg p-6 shadow-lg">
            {/* Title Section */}
            <Title size="xlarge" color="white">
                {name}
            </Title>

            {/* Description Section */}
            <div className="mt-2 text-sm text-gray-100 dark:text-gray-400">
                <Label color="gray">{renderDescription()}</Label>
                {description.length > MAX_DESCRIPTION_LENGTH && (
                    <button
                        onClick={toggleExpand}
                        className="ml-2 text-beer-softBlonde dark:text-beer-blonde font-semibold underline hover:text-beer-draft"
                    >
                        {isExpanded ? t('show_less') : t('show_more')}
                    </button>
                )}
            </div>

            {/* Date Section */}
            <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 text-sm text-gray-900 dark:text-gray-200">
                <div>
                    <Label
                        color="gray"
                        size="small"
                        className="text-gray-200 dark:text-gray-400"
                    >
                        {t('start_date')}:
                    </Label>
                    <Label
                        color="black"
                        size="small"
                        className="font-semibold text-gray-50 dark:text-gray-300"
                    >
                        {formatDateString(start_date)}
                    </Label>
                </div>
                <div>
                    <Label
                        color="gray"
                        size="small"
                        className="text-gray-200 dark:text-gray-400"
                    >
                        {t('end_date')}:
                    </Label>
                    <Label
                        color="black"
                        size="small"
                        className="font-semibold text-gray-50 dark:text-gray-300"
                    >
                        {formatDateString(end_date)}
                    </Label>
                </div>
            </div>

            {/* Status Section */}
            {status && (
                <div className="mt-4 flex justify-start">
                    <ChipCard content={status} />
                </div>
            )}
        </div>
    );
}
