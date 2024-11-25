import createServerClient from '@/utils/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();
        const steps: any[] = [];

        // Parsear datos de los pasos
        formData.forEach((value, key) => {
            const match = key.match(/steps\[(\d+)]\[(.+)]/);
            if (match) {
                const [, index, field] = match;
                steps[Number(index)] = {
                    ...steps[Number(index)],
                    [field]: field === 'step_number' ? Number(value) : value,
                };
            }
        });

        const supabase = await createServerClient();

        // Actualizar pasos en la base de datos
        for (const step of steps) {
            const { error } = await supabase
                .from('bm_steps')
                .update({ step_number: step.step_number })
                .eq('id', step.id);

            if (error) {
                throw new Error(
                    `Failed to update step ${step.id}: ${error.message}`,
                );
            }
        }

        return NextResponse.json({ message: 'Steps updated successfully' });
    } catch (err: any) {
        console.error('Error updating steps:', err.message);
        return NextResponse.json(
            { message: 'Error updating steps' },
            { status: 500 },
        );
    }
}
