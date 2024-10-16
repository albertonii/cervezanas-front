import createServerClient from '@/utils/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';
import { type EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType | null;
    const next = searchParams.get('next') ?? '/';
    const redirectTo = request.nextUrl.clone();
    redirectTo.pathname = next;

    if (token_hash && type) {
        const supabase = await createServerClient();

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        });

        if (!error) {
            return NextResponse.redirect(redirectTo);
        }
    }

    // return the user to an error page with some instructions
    redirectTo.pathname = '/auth/auth-code-error';
    return NextResponse.redirect(redirectTo);
}
