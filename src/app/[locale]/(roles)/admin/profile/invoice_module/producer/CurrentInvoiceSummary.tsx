import Title from '@/app/[locale]/components/ui/Title';
import DisplayPriceContainer from './DisplayPriceContainer';
import React from 'react';
import { useTranslations } from 'next-intl';
import { IBusinessOrder, IProducerUser } from '@/lib/types/types';
import Description from '@/app/[locale]/components/ui/Description';

interface Props {
    producer: IProducerUser;
    bOrders: IBusinessOrder[];
}

const CurrentInvoiceSummary = ({ producer, bOrders }: Props) => {
    const t = useTranslations();

    const totalAmount = bOrders.reduce(
        (acc, bOrder) =>
            acc +
            bOrder.order_items![0].quantity +
            bOrder.order_items![0].product_packs!.price,
        0,
    );

    const cervezanasComission = totalAmount * 0.15;
    const producerEarnings = totalAmount - cervezanasComission;

    return (
        <section className="space-y-8 border border-xl rounded-lg border-gray-300 p-8">
            <div className="">
                <Title size="large" color="black">
                    {t('invoice_module.sales_summary')}
                </Title>

                <Description size="xsmall">
                    {t('invoice_module.invoice_current_period')}
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
                        text="invoice_module.producer_earnings"
                        price={producerEarnings}
                    />
                </div>
                <div className="col-span-1 ">
                    <DisplayPriceContainer
                        text="invoice_module.cervezanas_comission"
                        price={cervezanasComission}
                    />
                </div>
            </div>
        </section>
    );
};

export default CurrentInvoiceSummary;
