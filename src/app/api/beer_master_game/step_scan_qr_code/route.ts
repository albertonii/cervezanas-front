import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '@/utils/supabaseServer';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const userId = formData.get('user_id') as string;
        const stepId = formData.get('step_id') as string;

        const supabase = await createServerClient();

        // Check if the user has already scanned the QR code
        const { data, error } = await supabase
            .from('bm_game_steps_registered')
            .select('*')
            .eq('user_id', userId)
            .eq('step_id', stepId);

        if (error) {
            console.error('Error scanning QR code', error);
            return NextResponse.json(
                { message: 'Error scanning QR code' },
                { status: 500 },
            );
        }

        if (data.length > 0) {
            return NextResponse.json(
                { message: 'User has already scanned this QR code' },
                { status: 400 },
            );
        }

        // Si no lo ha escaneado previamente, se registra el escaneo
        const { error: registerError } = await supabase
            .from('bm_game_steps_registered')
            .insert([
                {
                    user_id: userId,
                    step_id: stepId,
                    is_qr_scanned: true,
                    is_unlocked: true,
                },
            ]);

        if (registerError) {
            console.error('Error registering QR code', registerError);
            return NextResponse.json(
                { message: 'Error registering QR code' },
                { status: 500 },
            );
        }

        return NextResponse.json(
            {
                message: 'QR code successfully scanned',
                data: { user_id: userId, step_id: stepId },
            },
            { status: 200, statusText: 'OK' },
        );
    } catch (err) {
        return NextResponse.json(
            { message: 'Error scanning QR code' },
            { status: 500 },
        );
    }
}
