'use client';

import ProducerCard from './ProducerCard';
import SalesRecordsHistory from './SalesRecordsHistory';
import CurrentInvoiceSummary from './CurrentInvoiceSummary';
import InvoiceUploadedList from '@/app/[locale]/(roles)/producer/profile/invoice_module/InvoiceUploadedList';
import React from 'react';
import { IBusinessOrder, IProducerUser } from '@/lib/types/types';

interface Props {
    producer: IProducerUser;
    bOrders: IBusinessOrder[];
}

const PersonalInvoiceModule = ({ producer, bOrders }: Props) => {
    return (
        <div className="space-y-8">
            <ProducerCard producer={producer} />
            <CurrentInvoiceSummary producer={producer} bOrders={bOrders} />
            <SalesRecordsHistory />
            {/* Lista de facturas subidas */}
            <InvoiceUploadedList />
        </div>
    );
};

export default PersonalInvoiceModule;
