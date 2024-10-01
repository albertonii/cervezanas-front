import Title from '@/app/[locale]/components/ui/Title';
import DisplayPriceContainer from './DisplayPriceContainer';
import Description from '@/app/[locale]/components/ui/Description';
import useFetchOneSalesRecordsById from '@/hooks/useFetchOneSalesRecordsById';
import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
    IBusinessOrder,
    IProducerUser,
    ISalesRecordsProducer,
} from '@/lib/types/types';

interface Props {
    producer: IProducerUser;
    salesRecords: ISalesRecordsProducer;
}

const CurrentInvoiceSummary = ({ producer, salesRecords }: Props) => {
    const t = useTranslations();

    // const { data, refetch, error, isLoading } = useFetchOneSalesRecordsById(
    //     producer.user_id,
    // );

    const [totalAmount, setTotalAmount] = React.useState<number>(0);
    const [cervezanasComission, setCervezanasComission] =
        React.useState<number>(0);
    const [producerEarnings, setProducerEarnings] = React.useState<number>(0);

    useEffect(() => {
        if (salesRecords && salesRecords.sales_records_items) {
            const totalAmount = salesRecords.sales_records_items?.reduce(
                (acc, item) => acc + item.total_sales,
                0,
            );

            const cervezanasComission = totalAmount * 0.15;
            const producerEarnings = totalAmount - cervezanasComission;

            setTotalAmount(totalAmount);
            setCervezanasComission(cervezanasComission);
            setProducerEarnings(producerEarnings);
        }
    }, [salesRecords]);

    return (
        <section className="space-y-8 border border-xl rounded-lg border-gray-300 p-8">
            <div className="">
                <Title size="large" color="black">
                    {t('invoice_module.sales_summary')}
                </Title>

                <Title size="large" color="black">
                    {t('invoice_module.invoice_current_period_title')} :{' '}
                    {salesRecords?.invoice_period}
                </Title>

                <Description size="xsmall">
                    {t('invoice_module.sales_records_period')}
                </Description>
            </div>

            <div className="grid grid-cols-3 border-xl border-1 border-gray-500 gap-4">
                <div className="col-span-1 ">
                    <DisplayPriceContainer
                        text="invoice_module.total_amount"
                        price={totalAmount}
                    />
                </div>
                <div className="col-span-1 ">
                    <DisplayPriceContainer
                        text="invoice_module.net_amount"
                        price={producerEarnings}
                    />
                </div>
                <div className="col-span-1 ">
                    <DisplayPriceContainer
                        text="invoice_module.comission"
                        price={cervezanasComission}
                    />
                </div>
            </div>
        </section>
    );
};

export default CurrentInvoiceSummary;
