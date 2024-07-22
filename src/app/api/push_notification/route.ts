import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '@/utils/supabaseServer';

export async function POST(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const destinationUserId = requestUrl.searchParams.get('destination_user');
    const message = requestUrl.searchParams.get('message');
    const link = requestUrl.searchParams.get('link');
    const source = requestUrl.searchParams.get('source');

    if (!destinationUserId) {
        console.error('ERROR: destination user id not found');
        return NextResponse.redirect(`${requestUrl.origin}`);
    }

    const supabase = await createServerClient();

    const { error } = await supabase.from('notifications').insert({
        user_id: destinationUserId,
        message: message,
        link: link ?? '',
        source: source ?? process.env.NEXT_PUBLIC_ADMIN_ID, // El ID por defecto es el del admin de Cervezanas
    });

    if (error) throw new Error(error.message);

    // Deveolver OK para que el cliente no se quede esperando
    return NextResponse.json({ message: 'Notification sent successfully' });
}
