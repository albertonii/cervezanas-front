import Spinner from '@/app/[locale]/components/ui/Spinner';
import useFetchOneInvoiceById from '@/hooks/useFetchOneInvoiceById';
import ProducerInvoiceDownloadButton from '@/app/[locale]/components/invoice/producer_invoice/ProducerInvoiceDownloadButton';
import React, { useEffect, useState } from 'react';
import { IInvoiceProducer } from '@/lib/types/types';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';

interface Props {
    invoiceId: string;
}

const DownloadInvoiceButton = ({ invoiceId }: Props) => {
    const { data, refetch, error, isLoading } =
        useFetchOneInvoiceById(invoiceId);

    const [invoice, setInvoice] = useState<IInvoiceProducer>();

    useEffect(() => {
        refetch().then((res) => {
            const invoice = res.data as IInvoiceProducer;

            if (invoice) setInvoice(invoice);
        });
    }, []);

    const handleDownloadSalesInvoice = async () => {
        const res = await refetch();

        const invoice = res.data as IInvoiceProducer;

        if (error) {
            console.log(error);
            return;
        }

        console.log(invoice);

        if (invoice) {
            setInvoice(invoice);
        }
    };

    if (isLoading) return <Spinner size="small" color="beer-blonde" />;
    if (error) return <p>Error</p>;

    return (
        <div>
            {invoice && <ProducerInvoiceDownloadButton invoice={invoice} />}
        </div>
    );

    return (
        <IconButton
            onClick={() => handleDownloadSalesInvoice()}
            icon={faDownload}
            title={''}
        />
    );
};

export default DownloadInvoiceButton;
