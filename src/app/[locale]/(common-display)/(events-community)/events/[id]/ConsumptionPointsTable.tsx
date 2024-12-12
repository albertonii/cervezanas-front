// components/ConsumptionPointsTable.tsx
import React from 'react';
import Table from '@/app/[locale]/components/ui/table/Table';
import THead from '@/app/[locale]/components/ui/table/THead';
import TBody from '@/app/[locale]/components/ui/table/TBody';
import TR from '@/app/[locale]/components/ui/table/TR';
import TD from '@/app/[locale]/components/ui/table/TD';
import ConsumptionPointTableData from './ConsumptionPointTableData';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import { useTranslations } from 'next-intl';

interface TableProps {
    consumptionPoints: IConsumptionPointEvent[];
    eventId: string;
}

const ConsumptionPointsTable: React.FC<TableProps> = ({
    consumptionPoints,
    eventId,
}) => {
    const t = useTranslations();

    return (
        <div className="overflow-x-auto">
            <Table>
                <THead>
                    <TR>
                        <TD class_="w-8"> {'-'} </TD>
                        <TD class_="hidden sm:table-cell">
                            {t('logo_header')}
                        </TD>
                        <TD>{t('name_header')}</TD>
                        <TD class_="hidden sm:table-cell">
                            {t('date_header')}
                        </TD>
                        <TD>{t('status_header')}</TD>
                    </TR>
                </THead>
                <TBody>
                    {consumptionPoints.map((cp) => (
                        <ConsumptionPointTableData
                            key={cp.id}
                            cp={cp}
                            eventId={eventId}
                        />
                    ))}
                </TBody>
            </Table>
        </div>
    );
};

export default ConsumptionPointsTable;
