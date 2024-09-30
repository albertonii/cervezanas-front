import Title from '@/app/[locale]/components/ui/Title';
import DisplayPriceContainer from './DisplayPriceContainer';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import Description from '@/app/[locale]/components/ui/Description';
import useFetchOneInvoiceById from '@/hooks/useFetchOneInvoiceById';
import React from 'react';
import { useTranslations } from 'next-intl';
import {
    IBusinessOrder,
    IInvoiceProducer,
    IProducerUser,
} from '@/lib/types/types';

interface Props {
    producer: IProducerUser;
    bOrders: IBusinessOrder[];
}

const CurrentInvoiceSummary = ({ producer, bOrders }: Props) => {
    const t = useTranslations();

    const { data, refetch, error, isLoading } = useFetchOneInvoiceById(
        producer.user_id,
    );

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

            <Button primary large>
                {t('invoice_module.generate_sales_invoice')}
            </Button>
        </section>
    );
};

export default CurrentInvoiceSummary;
