import createServerClient from '@/utils/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
    const supabase = await createServerClient();
    const formData = await request.formData();

    const awardsSize = parseInt(formData.get('awards_size') as string);

    for (let i = 0; i < awardsSize; i++) {
        const awardUrl = formData.get(`awards[${i}].img_url`) as string;

        const { error: awardError } = await supabase.storage
            .from('products')
            .remove([`${decodeURIComponent(awardUrl)}`]);

        if (awardError) {
            return NextResponse.json(
                { message: 'Error deleting award image' },
                { status: 500 },
            );
        }
    }

    return NextResponse.json(
        { message: 'Award successfully deleted' },
        { status: 200 },
    );
}
