import createServerClient from '@/utils/supabaseServer';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
    const supabase = await createServerClient();

    const formData = await request.formData();
    const eventCPId = formData.get('event_cp_id');
    const status = formData.get('status') as string | null;

    if (!eventCPId) {
        return NextResponse.json(
            { error: 'Se requiere el ID del PC en el evento' },
            { status: 400 },
        );
    }

    if (!status) {
        return NextResponse.json(
            { error: 'Se requiere el estado del PC en el evento' },
            { status: 400 },
        );
    }

    try {
        const { error } = await supabase
            .from('event_order_cps')
            .update({
                status: status,
            })
            .eq('id', eventCPId);

        if (error) {
            return NextResponse.json(
                { error: 'CP no encontrado' },
                { status: 404 },
            );
        }

        return NextResponse.json({ status });
    } catch (error) {
        console.error('Error al obtener el nombre del PC en el evento:', error);
        return NextResponse.json(
            { error: 'Error Interno del Servidor' },
            { status: 500 },
        );
    }
}
