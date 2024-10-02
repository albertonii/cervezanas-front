'use client';

import ProducerCard from './ProducerCard';
import SalesRecordsList from './SalesRecordsList';
import InvoiceUploadedList from './InvoiceUploadedList';
import CurrentInvoiceSummary from './CurrentSalesRecordsSummary';
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
            <SalesRecordsList />
            <InvoiceUploadedList />
        </div>
    );
};

export default PersonalInvoiceModule;
