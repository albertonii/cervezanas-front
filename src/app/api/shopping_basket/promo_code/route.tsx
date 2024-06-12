import createServerClient from '../../../../utils/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);

    const code = requestUrl.searchParams.get('code');

    const supabase = await createServerClient();

    const { data: codeData, error: codeError } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', code)
        .single();

    if (codeError) {
        return NextResponse.json(
            { message: 'Error with discount code' },
            { status: 500 },
        );
    }

    return NextResponse.json({ codeData }, { status: 200 });
}
