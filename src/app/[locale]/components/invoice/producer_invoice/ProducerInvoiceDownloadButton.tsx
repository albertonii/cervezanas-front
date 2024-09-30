'use client';

import ProducerInvoicePDF from './ProducerInvoicePDF';
import React, { useEffect, useState } from 'react';
import { IInvoiceProducer } from '@/lib/types/types';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Button from '../../ui/buttons/Button';
import { IconButton } from '../../ui/buttons/IconButton';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
    invoice: IInvoiceProducer;
}

const ProducerInvoiceDownloadButton = ({ invoice }: Props) => {
    const { invoice_items } = invoice;

    if (!invoice_items) {
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
                    document={<ProducerInvoicePDF invoice={invoice} />}
                    fileName={`Historial_de_ventas_${invoice.invoice_period}.pdf`}
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

export default ProducerInvoiceDownloadButton;
