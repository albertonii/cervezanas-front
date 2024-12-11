import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import React from 'react';
import { useTranslations } from 'next-intl';
import { formatDateString } from '@/utils/formatDate';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';

interface Props {
    cpEvent: IConsumptionPointEvent;
}

const CPDetails: React.FC<Props> = ({ cpEvent }) => {
    const t = useTranslations();

    return (
        <article className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner space-y-4">
            {/* Título y Descripción */}
            <header>
                <Title size="xlarge" color="gray">
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
};

export default CPDetails;
