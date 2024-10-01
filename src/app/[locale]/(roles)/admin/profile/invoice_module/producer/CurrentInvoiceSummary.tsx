import Title from '@/app/[locale]/components/ui/Title';
import DisplayPriceContainer from './DisplayPriceContainer';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import Description from '@/app/[locale]/components/ui/Description';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { IBusinessOrder, IOrderItem, IProducerUser } from '@/lib/types/types';

interface Props {
    producer: IProducerUser;
    bOrders: IBusinessOrder[];
}

const CurrentInvoiceSummary = ({ producer, bOrders }: Props) => {
    const t = useTranslations();

    const { supabase } = useAuth();

    const totalAmount = bOrders.reduce(
        (acc, bOrder) =>
            acc +
            bOrder.order_items![0].quantity +
            bOrder.order_items![0].product_packs!.price,
        0,
    );

    const cervezanasComission = totalAmount * 0.15;
    const producerEarnings = totalAmount - cervezanasComission;

    const handleGenerateSalesInvoice = async () => {
        // 0. Crear un nuevo invoice con los datos de los business orders
        const { data: salesRecordsData, error: errorSalesRecords } =
            await supabase
                .from('sales_records_producer')
                .insert({
                    producer_id: producer.user_id,
                    total_amount: totalAmount,
                    producer_username: producer.users?.username,
                    producer_email: producer.users?.email,
                    invoice_period: '2021-09',
                })
                .select('id')
                .single();

        if (errorSalesRecords || !salesRecordsData) {
            console.error(
                'Error al crear el registro de ventas:',
                errorSalesRecords,
            );
            return;
        }

        // 1. Recorrer todos los business orders del periodo actual
        bOrders.forEach(async (bOrder) => {
            // 2. Obtener información del producto
            const orderItem: IOrderItem = bOrder.order_items![0];

            // 3. Cada elemento es una entrada a sales_records_items
            // 3.1. Calcular el monto total
            const total = orderItem.quantity * orderItem.product_price;
            const platformComission =
                total * bOrder.platform_comission_producer;
            const netAmount = total - platformComission;

            const { error } = await supabase
                .from('sales_records_items')
                .insert({
                    sales_records_id: salesRecordsData.id,
                    business_order_id: bOrder.id,
                    product_name: orderItem.product_packs?.products!.name,
                    product_pack_name: orderItem.product_packs!.name,
                    product_quantity: orderItem.quantity,
                    total_sales: total,
                    platform_commission: platformComission,
                    net_amount: netAmount,
                });

            if (error) {
                console.error('Error al crear el item de factura:', error);
                return;
            }
        });
    };

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

            <Button primary large onClick={handleGenerateSalesInvoice}>
                {t('invoice_module.generate_sales_invoice')}
            </Button>
        </section>
    );
};

export default CurrentInvoiceSummary;
