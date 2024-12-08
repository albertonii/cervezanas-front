// components/CPDetails.tsx
import React from 'react';
import { useTranslations } from 'next-intl';
import { formatDateString } from '@/utils/formatDate';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';

interface Props {
    cpEvent: IConsumptionPointEvent;
}

const CPDetails: React.FC<Props> = ({ cpEvent }) => {
    const t = useTranslations();

    return (
        <article className="space-y-6 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
            {/* Título y Descripción */}
            <header>
                <Title size="large" color="gray">
                    {cpEvent.cp?.cp_name}
                </Title>
                <Label size="medium" color="gray">
                    {cpEvent.cp?.cp_description}
                </Label>
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
            <footer className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </footer>
        </article>
    );
};

export default CPDetails;
