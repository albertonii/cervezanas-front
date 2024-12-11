import createServerClient from '@/utils/supabaseServer';
import { IQuestion } from '@/lib/types/beerMasterGame';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();

        const stepId = formData.get('step_id') as string;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const location = formData.get('location') as string;
        const step_number = Number(formData.get('step_number'));
        const isUnlocked = formData.get('is_unlocked') === 'true';
        const bmStateId = formData.get('bm_state_id') as string;

        const bmStepsQuestions = JSON.parse(
            formData.get('bm_steps_questions') as string,
        );

        const supabase = await createServerClient();

        const { data: stepData, error: stepError } = await supabase
            .from('bm_steps')
            .upsert({
                id: stepId,
                title,
                description,
                location,
                step_number: step_number,
                is_unlocked: isUnlocked,
                bm_state_id: bmStateId,
            })
            .select('id')
            .single();

        if (stepError) {
            throw new Error(
                `Error inserting into bm_steps: ${stepError.message}`,
            );
        }

        if (!stepData || !stepData.id) {
            throw new Error('No se pudo obtener el ID del paso actualizado');
        }

        const questionsData: IQuestion[] = bmStepsQuestions.map(
            (question: IQuestion) => ({
                id: question.id,
                bm_step_id: stepData.id,
                text: question.text,
                options: question.options,
                correct_answer: Number(question.correct_answer).toFixed(),
                explanation: question.explanation,
                difficulty: question.difficulty,
                points: question.points,
            }),
        );

        const upsertQuestions = questionsData.map(async (question) => {
            const { id, ...rest } = question;
            const { error: upsertError } = await supabase
                .from('bm_steps_questions')
                .upsert([{ id, ...rest }]);

            if (upsertError) {
                throw new Error(
                    `Error upserting bm_steps_questions: ${upsertError.message}`,
                );
            }
        });

        await Promise.all(upsertQuestions);

        return NextResponse.json({
            message: 'Steps and questions updated successfully',
        });

        // return NextResponse.json({ data });
    } catch (err) {
        return NextResponse.json(
            { message: 'Error updating game information - Catch' },
            { status: 500 },
        );
    }
}
