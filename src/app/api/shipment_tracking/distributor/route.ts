import createServerClient from '@/utils/supabaseServer';
import { IShipmentTrackingMessage } from '@/lib/types/types';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();

        const tracking_id = formData.get('tracking_id') as string;
        const status = formData.get('status') as string;
        const shipment_company = formData.get('shipment_company') as string;
        const shipment_tracking_id = formData.get(
            'shipment_tracking_id',
        ) as string;
        const shipment_url = formData.get('shipment_url') as string;
        const updated_estimated_date = formData.get(
            'updated_estimated_date',
        ) as string;
        const is_updated_by_distributor =
            formData.get('is_updated_by_distributor') === 'true';

        const messages = formData.get('messages') as string;

        const messagesArray = JSON.parse(messages);

        const supabase = await createServerClient();

        if (!tracking_id) {
            return NextResponse.json(
                { message: 'Tracking ID is required' },
                { status: 400 },
            );
        }

        const { error: shipmentTrackingError } = await supabase
            .from('shipment_tracking')
            .update({
                status,
                shipment_company,
                shipment_tracking_id,
                shipment_url,
                upd_estimated_date: updated_estimated_date,
                is_updated_by_distributor: true,
            })
            .eq('id', tracking_id);

        if (shipmentTrackingError) {
            console.log(shipmentTrackingError);
            return NextResponse.json(
                { message: 'Error updating shipment tracking status' },
                { status: 500 },
            );
        }

        messagesArray.forEach(async (message: IShipmentTrackingMessage) => {
            const { error } = await supabase
                .from('shipment_tracking_messages' as any)
                .insert({
                    content: message.content,
                    created_at: message.created_at,
                    tracking_id: message.tracking_id,
                });

            if (error) {
                return NextResponse.json(
                    { message: 'Error updating shipment tracking messages' },
                    { status: 500 },
                );
            }
        });

        return NextResponse.json(
            { message: 'Shipment tracking successfully updated' },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json(
            { message: 'Error updating shipment tracking' },
            { status: 500 },
        );
    }
}
