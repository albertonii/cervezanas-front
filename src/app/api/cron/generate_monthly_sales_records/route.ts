import createServerClient from '@/utils/supabaseServer';
import { calculateInvoicePeriod } from '@/utils/utils';
import { IBusinessOrder, IProducerUser } from '@/lib/types/types';
import { NextApiRequest, NextApiResponse } from 'next';

export async function GET(request: NextApiRequest, res: NextApiResponse) {
    const sharedKey = request.query.key;
    const CRON_JOB_TOKEN = process.env.NEXT_PUBLIC_CRON_JOB_TOKEN; // Configura esta variable de entorno

    if (!sharedKey || sharedKey !== CRON_JOB_TOKEN) {
        console.log('Token: ', sharedKey);
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const supabase = await createServerClient();

        // Calcular el invoicePeriod del mes anterior
        const invoicePeriod = getPreviousInvoicePeriod();

        // Lógica para generar sales_records
        await generateSalesRecords(supabase, invoicePeriod);

        res.status(200).json({
            message: 'Sales records generated successfully',
        });
    } catch (error) {
        console.error('Error generating sales records:', error);
        res.status(500).json({ error: 'Error generating sales records' });
    }
}

// Función para calcular el invoicePeriod del mes anterior
function getPreviousInvoicePeriod(): string {
    const date = new Date();
    date.setMonth(date.getMonth() - 1); // Restar un mes

    const invoicePeriod = calculateInvoicePeriod(date);

    return invoicePeriod;
}

async function generateSalesRecords(supabase: any, invoicePeriod: string) {
    // 1º Obtener todos los productores
    const producers = await getAllProducers(supabase);

    // 2º Por cada productor, obtener sus ventas del mes consultando en los businessOrders por periodo actual y productor
    await Promise.all(
        producers.map(async (producer: IProducerUser) => {
            const producerId = producer.user_id;
            const producerBusinessOrders: IBusinessOrder[] =
                await getBusinessOrdersByProducerIdAndPeriod(
                    supabase,
                    invoicePeriod,
                    producerId,
                );

            if (producerBusinessOrders.length === 0) {
                return;
            }

            // 3º Generar Registro de Ventas
            await generateSalesRecordsByProducerAndBOrders(
                supabase,
                producer,
                producerBusinessOrders,
                invoicePeriod,
            );
        }),
    );
}

async function getAllProducers(supabase: any) {
    const { data: producers, error } = await supabase
        .from('producer_user')
        .select('user_id');

    if (error) {
        throw new Error('Error getting producers');
    }

    return producers;
}

async function getBusinessOrdersByProducerIdAndPeriod(
    supabase: any,
    invoicePeriod: string,
    producerId: string,
) {
    const { data: businessOrders, error } = await supabase
        .from('business_orders')
        .select(
            `
            *,
            order_items (
                created_at,
                product_name,
                product_pack_name,
                product_price,
                quantity,
                subtotal
            )
        `,
        )
        .eq('producer_id', producerId)
        .eq('invoice_period', invoicePeriod);

    if (error) {
        throw new Error('Error getting sales records');
    }

    return businessOrders;
}

const generateSalesRecordsByProducerAndBOrders = async (
    supabase: any,
    producer: IProducerUser,
    businessOrders: IBusinessOrder[],
    invoicePeriod: string,
) => {
    const totalAmount = businessOrders.reduce(
        (acc: number, curr: IBusinessOrder) => acc + curr.total_sales,
        0,
    );

    // 4º Insertar en la tabla sales_records_producer
    const { data: salesRecordsData, error: errorSalesRecords } = await supabase
        .from('sales_records_producer')
        .insert({
            producer_id: producer.user_id,
            total_amount: totalAmount,
            producer_username: producer.users?.username,
            producer_email: producer.users?.email,
            invoice_period: invoicePeriod,
        })
        .select('id')
        .single();

    if (errorSalesRecords) {
        throw new Error('Error inserting sales records');
    }

    // 5º Insertar en la tabla sales_records_items los items de cada venta
    await Promise.all(
        businessOrders.map(async (bOrder: IBusinessOrder) => {
            if (!bOrder.order_items) {
                throw new Error('Error inserting sales records items');
            }

            const orderItem = bOrder.order_items[0];

            console.log(orderItem);

            const total = orderItem.quantity * orderItem.product_price;
            const platformComission =
                total * bOrder.platform_comission_producer;
            const netAmount = total - platformComission;

            console.log('Inserting sales records items:', {
                sales_record_id: salesRecordsData.id,
                business_order_id: bOrder.id,
                product_name: orderItem.product_name,
                product_pack_name: orderItem.product_pack_name,
                product_quantity: orderItem.quantity,
                total_sales: total,
                platform_commission: platformComission,
                net_amount: netAmount,
            });

            const { error: errorSalesRecordsItems } = await supabase
                .from('sales_records_items')
                .insert({
                    sales_records_id: salesRecordsData.id,
                    business_order_id: bOrder.id,
                    product_name: orderItem.product_name,
                    product_pack_name: orderItem.product_pack_name,
                    product_quantity: orderItem.quantity,
                    total_sales: total,
                    platform_commission: platformComission,
                    net_amount: netAmount,
                });

            if (errorSalesRecordsItems) {
                console.error(
                    'Error inserting sales records items:',
                    errorSalesRecordsItems,
                );
                throw new Error('Error inserting sales records items');
            }
        }),
    );

    return salesRecordsData;
};
