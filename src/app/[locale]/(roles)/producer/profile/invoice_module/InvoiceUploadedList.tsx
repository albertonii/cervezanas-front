import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import DownloadInvoiceButton from './DownloadInvoiceButton';
import Description from '@/app/[locale]/components/ui/Description';
import DeleteModal from '@/app/[locale]/components/modals/DeleteModal';
import useFetchInvoicesByProducerId from '@/hooks/useFetchInvoicesByProducerId';
import TableWithFooterAndSearch from '@/app/[locale]/components/ui/TableWithFooterAndSearch';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQueryClient } from 'react-query';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateDefaultInput } from '@/utils/formatDate';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { IInvoiceProducer } from '@/lib/types/types';
import { DeleteButton } from '@/app/[locale]/components/ui/buttons/DeleteButton';
import { useMessage } from '@/app/[locale]/components/message/useMessage';

const InvoiceUploadedList = () => {
    const t = useTranslations();

    const resultsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [counter, setCounter] = useState(0);
    const [invoices, setInvoices] = useState<IInvoiceProducer[]>([]);
    const [isDeleteShowModal, setIsDeleteShowModal] = useState(false);
    const [invoice, setInvoice] = useState<IInvoiceProducer>();

    const { handleMessage } = useMessage();

    const queryClient = useQueryClient();

    const { user } = useAuth();

    const { data, isError, isLoading, refetch } = useFetchInvoicesByProducerId(
        user?.id,
        currentPage,
        resultsPerPage,
    );

    useEffect(() => {
        if (user) {
            refetch().then((res) => {
                const data = res.data as IInvoiceProducer[];

                if (data) {
                    setInvoices(data);
                    setCounter(data.length);
                }
            });
        }

        return () => {};
    }, [user]);

    useEffect(() => {
        if (data) {
            setInvoices(data);
            setCounter(data.length);
        }
    }, [data]);

    const columns = [
        {
            header: t('invoice_module.period_header'),
            key: 'invoice_period',
            accessor: 'invoice_date',
            sortable: true,
            render: (_: any, row: IInvoiceProducer) => (
                <span>{row.invoice_period}</span>
            ),
        },
        {
            header: t('invoice_module.generation_date_header'),
            key: 'created_at',
            accessor: 'created_at',
            sortable: true,
            render: (_: any, row: IInvoiceProducer) => (
                <span>{formatDateDefaultInput(row.created_at)}</span>
            ),
        },
        {
            header: t('invoice_module.total_amount'),
            key: 'total_sales',
            accessor: 'total_sales',
            sortable: true,
            render: (_: any, row: IInvoiceProducer) => (
                <span>{formatCurrency(row.total_amount)}</span>
            ),
        },
        {
            header: t('status_header'),
            key: 'status_comission',
            accessor: 'status_comission',
            sortable: true,
            render: (_: any, row: IInvoiceProducer) => (
                <Label>{t(row.status)}</Label>
            ),
        },
        {
            header: t('action_header'),
            accessor: 'actions',
            render: (_: any, row: IInvoiceProducer) => (
                <div className="flex justify-center space-x-2">
                    <DownloadInvoiceButton salesRecordsId={row.id} />
                    <DeleteButton onClick={() => handleDeleteClick(row)} />
                </div>
            ),
        },
    ];

    const handleDeleteClick = (invoice: IInvoiceProducer) => {
        setIsDeleteShowModal(true);
        setInvoice(invoice);
    };

    const handleAcceptDelete = async () => {
        if (invoice) {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

            const url = `${baseUrl}/api/invoices/delete`;

            const formData = new FormData();
            formData.set('invoice_id', invoice.id);
            formData.set('invoice_file_path', invoice.file_path);

            const res = await fetch(url, {
                method: 'DELETE',
                body: formData,
            });

            if (res.ok) {
                queryClient.invalidateQueries('invoices_by_producer_id');
                handleMessage({
                    type: 'success',
                    message: t('invoice_module.invoice_deleted_successfully'),
                });
            } else {
                handleMessage({
                    type: 'error',
                    message: t('errors.deleting_invoice'),
                });
            }

            setIsDeleteShowModal(false);
        }
    };

    return (
        <>
            <section className="space-y-8 border border-xl rounded-lg border-gray-300 p-8">
                <div className="">
                    <Title size="large" color="black">
                        {t('invoice_module.invoice_historial_title')}
                    </Title>

                    <Description size="xsmall">
                        {t('invoice_module.invoice_historial_description')}
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

            {isDeleteShowModal && invoice && (
                <DeleteModal
                    title="invoice_module.delete_invoice_modal_title"
                    description="invoice_module.delete_invoice_modal_description"
                    handler={handleAcceptDelete}
                    setShowModal={setIsDeleteShowModal}
                    btnTitle="invoice_module.delete_invoice_modal_btn"
                    showModal={isDeleteShowModal}
                />
            )}
        </>
    );
};

export default InvoiceUploadedList;
