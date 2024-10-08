import Spinner from '@/app/[locale]/components/ui/Spinner';
import useFetchOneSalesRecordsById from '@/hooks/useFetchOneSalesRecordsById';
import ProducerSalesRecordsDownloadButton from '@/app/[locale]/components/invoice/producer_invoice/ProducerSalesRecordsDownloadButton';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ISalesRecordsProducer } from '@/lib/types/types';

interface Props {
    salesRecordsId: string;
}

const DownloadInvoiceButton = ({ salesRecordsId }: Props) => {
    const t = useTranslations();

    const { data, error, isLoading } =
        useFetchOneSalesRecordsById(salesRecordsId);

    const [salesRecords, setSalesRecords] = useState<ISalesRecordsProducer>();

    useEffect(() => {
        if (data) {
            const salesRecords = data as ISalesRecordsProducer;
            if (salesRecords) setSalesRecords(salesRecords);
        }
    }, [data]);

    if (isLoading) return <Spinner size="small" color="beer-blonde" />;
    if (error) return <p>{t('error')}</p>;

    return (
        <div>
            {salesRecords && (
                <ProducerSalesRecordsDownloadButton
                    salesRecords={salesRecords}
                />
            )}
        </div>
    );
};

export default DownloadInvoiceButton;
