import Title from '@/app/[locale]/components/ui/Title';
import DisplayPriceContainer from './DisplayPriceContainer';
import Description from '@/app/[locale]/components/ui/Description';
import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { IBusinessOrder } from '@/lib/types/types';
import { calculateInvoicePeriod } from '@/utils/utils';

interface Props {
    bOrders: IBusinessOrder[];
}

const CurrentSalesRecordsSummary = ({ bOrders }: Props) => {
    const t = useTranslations();

    const [totalAmount, setTotalAmount] = React.useState<number>(0);
    const [cervezanasComission, setCervezanasComission] =
        React.useState<number>(0);
    const [producerEarnings, setProducerEarnings] = React.useState<number>(0);

    useEffect(() => {
        if (bOrders) {
            const totalAmount = bOrders.reduce(
                (acc, bOrder) =>
                    acc +
                    bOrder.order_items![0].quantity *
                        bOrder.order_items![0].product_packs!.price,
                0,
            );

            const cervezanasComission = totalAmount * 0.15;
            const producerEarnings = totalAmount - cervezanasComission;

            setTotalAmount(totalAmount);
            setCervezanasComission(cervezanasComission);
            setProducerEarnings(producerEarnings);
        }
    }, [bOrders]);

    return (
        <section className="space-y-8 border border-xl rounded-lg border-gray-300 p-8">
            <div className="">
                <Title size="large" color="black">
                    {t('invoice_module.sales_summary')}
                </Title>

                <Title size="large" color="black">
                    {t('invoice_module.invoice_current_period_title')} :{' '}
                    {calculateInvoicePeriod(new Date())}
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

export default CurrentSalesRecordsSummary;
