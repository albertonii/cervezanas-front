import createServerClient from '@/utils/supabaseServer';

export async function calculateNextBillingDate(
    cycle: 'weekly' | 'biweekly' | 'monthly',
    currentDate: string,
): Promise<string> {
    const date = new Date(currentDate);
    switch (cycle) {
        case 'weekly':
            date.setDate(date.getDate() + 7);
            break;
        case 'biweekly':
            date.setDate(date.getDate() + 14);
            break;
        case 'monthly':
            date.setMonth(date.getMonth() + 1);
            break;
        default:
            throw new Error('Ciclo de facturación no soportado');
    }
    return date.toISOString().split('T')[0];
}

// Devolución de una orden
async function handleReturn(orderId: string) {
    const supabase = await createServerClient();

    // Obtener detalles de la orden
    const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

    if (error || !order) {
        console.error('Orden no encontrada:', error);
        return;
    }

    // Marcar la business order como devuelta
    await supabase
        .from('orders')
        .update({ status: 'Returned' })
        .eq('id', orderId);

    // Obtener la factura correspondiente
    // const { data: invoiceDetails } = await supabase
    //     .from('InvoiceDetails')
    //     .select('*, invoice:Invoices(*)')
    //     .eq('order_id', orderId)
    //     .single();

    // if (!invoiceDetails) {
    //     console.error(
    //         'Detalles de factura no encontrados para la orden:',
    //         orderId,
    //     );
    //     return;
    // }

    // // Actualizar los montos en la factura
    // const newTotalSales = invoiceDetails.invoice.total_sales - order.total;
    // const newCommission = newTotalSales * 0.15;
    // const newNetAmount = newTotalSales - newCommission;

    // await supabase
    //     .from('Invoices')
    //     .update({
    //         total_sales: newTotalSales,
    //         commission: newCommission,
    //         net_amount: newNetAmount,
    //         updated_at: new Date().toISOString(),
    //     })
    //     .eq('id', invoiceDetails.invoice.id);

    // Opcional: Recalcular en `InvoiceDetails` si es necesario
}
