import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '@/utils/supabaseServer';

export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();
        const gameStateId = formData.get('game_state_id') as string;
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const location = formData.get('location') as string;
        const totalSteps = Number(formData.get('total_steps'));

        const supabase = await createServerClient();

        // Check if the user has already scanned the QR code
        const { data, error } = await supabase
            .from('bm_steps_game_state')
            .update({
                title: name,
                description,
                location,
                total_steps: totalSteps,
            })
            .eq('id', gameStateId);

        if (error) {
            return NextResponse.json(
                { message: 'Error updating game information' },
                { status: 500 },
            );
        }

        return NextResponse.json({ data });
    } catch (err) {
        return NextResponse.json(
            { message: 'Error updating game information - Catch' },
            { status: 500 },
        );
    }
}
