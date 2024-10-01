import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import Description from '@/app/[locale]/components/ui/Description';
import useFetchSalesRecordsByProducerId from '@/hooks/useFetchSalesRecordsByProducerId';
import TableWithFooterAndSearch from '@/app/[locale]/components/ui/TableWithFooterAndSearch';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatCurrency';
import { ISalesRecordsProducer } from '@/lib/types/types';
import { formatDateDefaultInput } from '@/utils/formatDate';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';
import DownloadInvoiceButton from '@/app/[locale]/(roles)/producer/profile/invoice_module/DownloadInvoiceButton';

const InvoiceHistory = () => {
    const t = useTranslations();

    const resultsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [counter, setCounter] = useState(0);
    const [invoices, setInvoices] = useState<ISalesRecordsProducer[]>([]);

    const { user } = useAuth();

    const { data, isError, isLoading, refetch } =
        useFetchSalesRecordsByProducerId(user?.id, currentPage, resultsPerPage);

    useEffect(() => {
        if (user) {
            refetch().then((res) => {
                const data = res.data as ISalesRecordsProducer[];

                setInvoices(data);
                setCounter(data.length);
            });
        }

        return () => {};
    }, [user]);

    const columns = [
        {
            header: t('invoice_module.period_header'),
            key: 'invoice_period',
            accessor: 'invoice_date',
            sortable: true,
            render: (_: any, row: ISalesRecordsProducer) => (
                <span>{row.invoice_period}</span>
            ),
        },
        {
            header: t('invoice_module.generation_date_header'),
            key: 'created_at',
            accessor: 'created_at',
            sortable: true,
            render: (_: any, row: ISalesRecordsProducer) => (
                <span>{formatDateDefaultInput(row.created_at)}</span>
            ),
        },
        {
            header: t('invoice_module.total_sales_header'),
            key: 'total_sales',
            accessor: 'total_sales',
            sortable: true,
            render: (_: any, row: ISalesRecordsProducer) => (
                <span>{formatCurrency(row.total_amount)}</span>
            ),
        },
        {
            header: t('status_header'),
            key: 'status_comission',
            accessor: 'status_comission',
            sortable: true,
            render: (_: any, row: ISalesRecordsProducer) => (
                <span>{t(row.status)}</span>
            ),
        },
        {
            header: t('action_header'),
            accessor: 'actions',
            render: (_: any, row: ISalesRecordsProducer) => (
                <div className="flex justify-center space-x-2">
                    <DownloadInvoiceButton salesRecordsId={row.id} />
                </div>
            ),
        },
    ];

    return (
        <section className="space-y-8 border border-xl rounded-lg border-gray-300 p-8">
            <div className="">
                <Title size="large" color="black">
                    {t('invoice_module.sales_historial_title')}
                </Title>

                <Description size="xsmall">
                    {t('invoice_module.sales_historial_description_admin')}
                </Description>
            </div>

            {isLoading && <Spinner color="beer-blonde" size="large" />}

            {isError ? (
                <Label size="medium" color="black" font="semibold">
                    {t('errors.fetching_invoices')}
                </Label>
            ) : (
                <>
                    {data && (
                        <TableWithFooterAndSearch
                            columns={columns}
                            data={invoices}
                            initialQuery={''}
                            resultsPerPage={resultsPerPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            searchPlaceHolder={''}
                            paginationCounter={counter}
                            sourceDataIsFromServer={false}
                            displaySearch={false}
                        />
                    )}
                </>
            )}
        </section>
    );
};

export default InvoiceHistory;
