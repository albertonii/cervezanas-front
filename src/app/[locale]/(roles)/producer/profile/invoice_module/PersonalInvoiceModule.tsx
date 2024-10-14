'use client';

import SalesRecordsList from './SalesRecordsList';
import InvoiceManagement from './InvoiceManagement';
import CurrentSalesRecordsSummary from './CurrentSalesRecordsSummary';
import React from 'react';
import { IBusinessOrder } from '@/lib/types/types';

interface Props {
    bOrders: IBusinessOrder[];
}

const PersonalInvoiceModule = ({ bOrders }: Props) => {
    return (
        <div className="space-y-8 bg-beer-foam p-4">
            <CurrentSalesRecordsSummary bOrders={bOrders} />
            <SalesRecordsList />
            <InvoiceManagement />
        </div>
    );
};

export default PersonalInvoiceModule;
