import Spinner from '@/app/[locale]/components/ui/Spinner';
import React, { useEffect, useState } from 'react';
import { ISalesRecordsProducer } from '@/lib/types/types';
import useFetchOneSalesRecordsById from '@/hooks/useFetchOneSalesRecordsById';
import ProducerSalesRecordsDownloadButton from '@/app/[locale]/components/invoice/producer_invoice/ProducerSalesRecordsDownloadButton';

interface Props {
    salesRecordsId: string;
}

const DownloadInvoiceButton = ({ salesRecordsId }: Props) => {
    const { data, refetch, error, isLoading } =
        useFetchOneSalesRecordsById(salesRecordsId);

    const [salesRecords, setSalesRecords] = useState<ISalesRecordsProducer>();

    useEffect(() => {
        refetch().then((res) => {
            const salesRecords = res.data as ISalesRecordsProducer;

            if (salesRecords) setSalesRecords(salesRecords);
        });
    }, []);

    const handleDownloadSalesInvoice = async () => {
        const res = await refetch();

        const salesRecords = res.data as ISalesRecordsProducer;

        if (error) {
            console.log(error);
            return;
        }

        if (salesRecords) {
            setSalesRecords(salesRecords);
        }
    };

    if (isLoading) return <Spinner size="small" color="beer-blonde" />;
    if (error) return <p>Error</p>;

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
