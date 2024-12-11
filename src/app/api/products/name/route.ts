import createServerClient from '@/utils/supabaseServer';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const supabase = await createServerClient();

    const url = new URL(request.url);
    const eventId = url.searchParams.get('id');

    if (!eventId) {
        return NextResponse.json(
            { error: 'Se requiere el ID del evento' },
            { status: 400 },
        );
    }

    try {
        const { data: event, error } = await supabase
            .from('products')
            .select('name')
            .eq('id', eventId)
            .single();

        if (error || !event) {
            return NextResponse.json(
                { error: 'Product no encontrado' },
                { status: 404 },
            );
        }

        return NextResponse.json({ name: event.name });
    } catch (error) {
        console.error('Error al obtener el nombre del producto:', error);
        return NextResponse.json(
            { error: 'Error Interno del Servidor' },
            { status: 500 },
        );
    }
}
