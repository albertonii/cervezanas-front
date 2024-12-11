import createServerClient from '@/utils/supabaseServer';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const supabase = await createServerClient();

    const url = new URL(request.url);
    const cpEventId = url.searchParams.get('id');

    if (!cpEventId) {
        return NextResponse.json(
            { error: 'Se requiere el ID del PC' },
            { status: 400 },
        );
    }

    try {
        const { data: cp_events, error } = await supabase
            .from('cp_events')
            .select('cp_name')
            .eq('id', cpEventId)
            .single();

        if (error || !cp_events) {
            return NextResponse.json(
                { error: 'Product no encontrado' },
                { status: 404 },
            );
        }

        return NextResponse.json({ name: cp_events.cp_name });
    } catch (error) {
        console.error('Error al obtener el nombre del producto:', error);
        return NextResponse.json(
            { error: 'Error Interno del Servidor' },
            { status: 500 },
        );
    }
}
