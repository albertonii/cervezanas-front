'use client';

import ProducerCard from './ProducerCard';
import InvoiceHistory from './InvoiceHistory';
import CurrentInvoiceSummary from './CurrentInvoiceSummary';
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
            <InvoiceHistory />
        </div>
    );
};

export default PersonalInvoiceModule;
