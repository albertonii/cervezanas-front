import createServerClient from '@/utils/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();

        const trackingId = formData.get('tracking_id') as string;
        const messages = formData.get('messages') as string;
        const messagesArray = JSON.parse(messages);

        const supabase = await createServerClient();

        // Delete previos messages
        const { error: shipmentTrackingMessagesError } = await supabase
            .from('shipment_tracking_messages')
            .delete()
            .eq('tracking_id', trackingId);

        if (shipmentTrackingMessagesError) {
            return NextResponse.json(
                { message: 'Error deleting shipment tracking messages' },
                { status: 500 },
            );
        }

        for (let i = 0; i < messagesArray.length; i++) {
            const { error: shipmentTrackingError } = await supabase
                .from('shipment_tracking_messages')
                .insert({
                    content: messagesArray[i].content,
                    created_at: messagesArray[i].created_at,
                    tracking_id: messagesArray[i].tracking_id,
                });

            if (shipmentTrackingError) {
                return NextResponse.json(
                    { message: 'Error updating shipment tracking status' },
                    { status: 500 },
                );
            }
        }
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
