'use client';

import SalesRecordsList from './SalesRecordsList';
import InvoiceManagement from './InvoiceManagement';
import CurrentSalesRecordsSummary from './CurrentSalesRecordsSummary';
import React from 'react';
import { IProducerUser, ISalesRecordsProducer } from '@/lib/types/types';

interface Props {
    producer: IProducerUser;
    salesRecords: ISalesRecordsProducer;
}

const PersonalInvoiceModule = ({ producer, salesRecords }: Props) => {
    return (
        <div className="space-y-8 bg-beer-foam p-4">
            <CurrentSalesRecordsSummary salesRecords={salesRecords} />
            <SalesRecordsList />
            <InvoiceManagement salesRecords={salesRecords} />
        </div>
    );
};

export default PersonalInvoiceModule;
