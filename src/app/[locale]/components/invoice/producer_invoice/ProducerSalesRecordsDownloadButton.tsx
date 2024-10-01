'use client';

import ProducerInvoicePDF from './ProducerInvoicePDF';
import React, { useEffect, useState } from 'react';
import { ISalesRecordsProducer } from '@/lib/types/types';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
    salesRecords: ISalesRecordsProducer;
}

const ProducerSalesRecordsDownloadButton = ({ salesRecords }: Props) => {
    const { sales_records_items } = salesRecords;

    if (!sales_records_items) {
        return null;
    }

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <>
            {isClient && (
                <PDFDownloadLink
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
