'use client';

import SalesRecordsList from './SalesRecordsList';
import InvoiceManagement from './InvoiceManagement';
import CurrentSalesRecordsSummary from './CurrentSalesRecordsSummary';
import React from 'react';
import { IBusinessOrder, ISalesRecordsProducer } from '@/lib/types/types';

interface Props {
    bOrders: IBusinessOrder[];
    salesRecords: ISalesRecordsProducer;
}

const PersonalInvoiceModule = ({ bOrders, salesRecords }: Props) => {
    return (
        <div className="space-y-8 bg-beer-foam p-4">
            <CurrentSalesRecordsSummary bOrders={bOrders} />
            <SalesRecordsList />
            <InvoiceManagement salesRecords={salesRecords} />
        </div>
    );
};

export default PersonalInvoiceModule;
