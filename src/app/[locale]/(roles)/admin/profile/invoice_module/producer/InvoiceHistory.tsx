import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import Description from '@/app/[locale]/components/ui/Description';
import useFetchInvoicesByProducerId from '@/hooks/useFetchInvoicesByProducerId';
import TableWithFooterAndSearch from '@/app/[locale]/components/ui/TableWithFooterAndSearch';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IInvoice } from '@/lib/types/types';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';
import { formatCurrency } from '@/utils/formatCurrency';

const InvoiceHistory = () => {
    const t = useTranslations();

    const resultsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [counter, setCounter] = useState(0);
    const [invoices, setInvoices] = useState<IInvoice[]>([]);

    const { user } = useAuth();

    const { data, isError, isLoading, refetch } = useFetchInvoicesByProducerId(
        user?.id,
        currentPage,
        resultsPerPage,
    );

    useEffect(() => {
        if (user) {
            refetch().then((res) => {
                console.log(res);
                const data = res.data as IInvoice[];

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
            render: (_: any, row: IInvoice) => (
                <span>{row.invoice_period}</span>
            ),
        },
        {
            header: t('invoice_module.generation_date_header'),
            key: 'created_at',
            accessor: 'created_at',
            sortable: true,
            render: (_: any, row: IInvoice) => <span>{row.created_at}</span>,
        },
        {
            header: t('invoice_module.total_sales_header'),
            key: 'total_sales',
            accessor: 'total_sales',
            sortable: true,
            render: (_: any, row: IInvoice) => (
                <span>{formatCurrency(row.total_sales)}</span>
            ),
        },
        {
            header: t('invoice_module.producer_earnings_header'),
            key: 'net_amount',
            accessor: 'net_amount',
            sortable: true,
            render: (_: any, row: IInvoice) => (
                <span>{formatCurrency(row.net_amount)}</span>
            ),
        },
        {
            header: t('invoice_module.cervezanas_comission_header'),
            key: 'comission',
            accessor: 'comission',
            sortable: true,
            render: (_: any, row: IInvoice) => (
                <span>{formatCurrency(row.comission)}</span>
            ),
        },
        {
            header: t('status_header'),
            key: 'status_comission',
            accessor: 'status_comission',
            sortable: true,
            render: (_: any, row: IInvoice) => <span>{row.status}</span>,
        },
        {
            header: t('action_header'),
            accessor: 'actions',
            render: (_: any, row: IInvoice) => (
                <div className="flex justify-center space-x-2">
                    <IconButton
                        // onClick={() => handleClickView(row)}
                        icon={faDownload}
                        title={''}
                    />{' '}
                </div>
            ),
        },
    ];

    return (
        <section className="space-y-8 border border-xl rounded-lg border-gray-300 p-8">
            <div className="">
                <Title size="large" color="black">
                    {t('invoice_module.historial_title')}
                </Title>

                <Description size="xsmall">
                    {t('invoice_module.historial_description')}
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
