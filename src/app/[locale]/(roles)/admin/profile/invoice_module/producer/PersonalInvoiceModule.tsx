'use client';

import ProducerCard from './ProducerCard';
import SalesRecordsList from './SalesRecordsList';
import InvoiceUploadedList from './InvoiceUploadedList';
import CurrentSalesRecordsSummary from './CurrentSalesRecordsSummary';
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
            <CurrentSalesRecordsSummary producer={producer} bOrders={bOrders} />
            <SalesRecordsList />
            <InvoiceUploadedList producer={producer} />
        </div>
    );
};

export default PersonalInvoiceModule;
