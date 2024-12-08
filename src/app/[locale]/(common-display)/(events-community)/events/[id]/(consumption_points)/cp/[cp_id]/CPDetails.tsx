import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { formatDateString } from '@/utils/formatDate';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

interface Props {
    cpEvent: IConsumptionPointEvent;
}

export default function CPDetails({ cpEvent }: Props) {
    const t = useTranslations();

    return (
        <>
            <article className="space-y-4 border rounded-md border-beer-blonde p-4 ">
                <header>
                    <Title size="large" color="beer-blonde">
                        {cpEvent.cp?.cp_name}
                    </Title>

                    <Label size="medium" color="gray">
                        {cpEvent.cp?.cp_description}
                    </Label>
                </header>

                <div className="mb-4 grid grid-cols-2">
                    <div>
                        <Label color="gray" size="small">
                            {t('start_date')}:{' '}
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

                {/* Organizer information */}
                <footer className="space-y-2">
                    <div className="grid grid-cols-2">
                        <Label color="gray" size="small">
                            {t('organizer')}:
                        </Label>
                        <Label color="black" size="small">
                            {cpEvent.cp?.organizer_name}{' '}
                            {cpEvent.cp?.organizer_lastname}{' '}
                        </Label>
                    </div>

                    <div className="grid grid-cols-2">
                        <Label color="gray" size="small">
                            {t('email')}:
                        </Label>
                        <Label color="black" size="small">
                            {cpEvent.cp?.organizer_email}
                        </Label>
                    </div>

                    <div className="grid grid-cols-2">
                        <Label color="gray" size="small">
                            {t('phone')}:
                        </Label>
                        <Label color="black" size="small">
                            {cpEvent.cp?.organizer_phone}
                        </Label>
                    </div>
                </footer>
            </article>
        </>
    );
}
