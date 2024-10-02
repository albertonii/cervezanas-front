'use client';

import ProducerInvoicePDF from './ProducerInvoicePDF';
import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useMessage } from '../../message/useMessage';
import { ISalesRecordsProducer } from '@/lib/types/types';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
    salesRecords: ISalesRecordsProducer;
}

const ProducerSalesRecordsDownloadButton = ({ salesRecords }: Props) => {
    const { sales_records_items } = salesRecords;
    const { getActiveRole } = useAuth();

    if (!sales_records_items) {
        return null;
    }

    const [isClient, setIsClient] = useState(false);
    const { handleMessage } = useMessage();

    const handleOnClickDownload = async () => {
        if (getActiveRole() === 'producer') {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const url = `${baseUrl}/api/invoices/sales_records_download`;

            const formData = new FormData();
            formData.append('sales_records_id', salesRecords.id);
            formData.append('status', 'downloaded');

            const res = await fetch(url, {
                method: 'PUT',
                body: formData,
            });

            if (res.ok) {
                handleMessage({
                    type: 'success',
                    message: 'success.sales_records_download_status_updated',
                });
            } else {
                handleMessage({
                    type: 'error',
                    message: 'errors.updating_sales_records_download_status',
                });
            }
        }
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <>
            {isClient && (
                <PDFDownloadLink
                    onClick={handleOnClickDownload}
                    document={
                        <ProducerInvoicePDF sales_records={salesRecords} />
                    }
                    fileName={`Historial_de_ventas_${salesRecords.invoice_period}.pdf`}
                    style={{
                        textDecoration: 'none',
                        padding: '10px',
                        color: '#fff',
                        backgroundColor: '#90470b',
                        borderRadius: '5px',
                    }}
                >
                    <FontAwesomeIcon
                        icon={faDownload}
                        title={'chevron_circle_down'}
                        width={20}
                        height={20}
                    />
                </PDFDownloadLink>
            )}
        </>
    );
};

export default ProducerSalesRecordsDownloadButton;
