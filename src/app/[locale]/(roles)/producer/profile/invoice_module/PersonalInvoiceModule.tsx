'use client';

import InvoiceHistory from './InvoiceHistory';
import InvoiceManagement from './InvoiceManagement';
import CurrentInvoiceSummary from './CurrentInvoiceSummary';
import React from 'react';
import {
    IBusinessOrder,
    IProducerUser,
    ISalesRecordsProducer,
} from '@/lib/types/types';

interface Props {
    producer: IProducerUser;
    bOrders: IBusinessOrder[];
    salesRecords: ISalesRecordsProducer;
}

const PersonalInvoiceModule = ({ producer, bOrders, salesRecords }: Props) => {
    return (
        <div className="space-y-8 bg-beer-foam p-4">
            <CurrentInvoiceSummary
                producer={producer}
                bOrders={bOrders}
                salesRecords={salesRecords}
            />
            <InvoiceManagement />
            <InvoiceHistory />
        </div>
    );
};

export default PersonalInvoiceModule;
