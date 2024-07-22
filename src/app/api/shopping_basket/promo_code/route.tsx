import createServerClient from '@/utils/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';
import { IDiscountCode } from '@/lib//types/types';
import { convertToDate } from '@/utils/formatDate';

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const code = formData.get('code') as string;
    const userId = formData.get('user_id') as string;

    if (!userId) {
        return NextResponse.json(
            { message: 'User id is required' },
            { status: 400 },
        );
    }

    if (!code) {
        return NextResponse.json(
            { message: 'Code is required' },
            { status: 400 },
        );
    }

    const response = await checkDiscountCode(code, userId);
    return response;
}

async function checkDiscountCode(code: string, userId: string) {
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

    if (!codeData) {
        return NextResponse.json(
            { message: 'Invalid discount code' },
            { status: 404 },
        );
    }

    const discountCode = codeData as IDiscountCode;

    const expirationDate = convertToDate(discountCode.expiration_date);

    if (expirationDate && expirationDate < new Date()) {
        return NextResponse.json(
            { message: 'Discount code expired' },
            { status: 404 },
        );
    }

    if (
        codeData.uses &&
        codeData.max_uses &&
        codeData.uses >= codeData.max_uses
    ) {
        return NextResponse.json(
            { message: 'Discount code max uses reached' },
            { status: 404 },
        );
    }

    // Check if the user has already used this code
    const { data: userCodeData, error: userCodeError } = await supabase
        .from('user_discount_codes')
        .select('*')
        .eq('discount_code_id', code)
        .eq('user_id', userId);

    // Si es null -> No se ha utilizado aún por ningún usuario
    if (userCodeData === null) {
        return NextResponse.json(
            {
                message: discountCode,
            },
            { status: 200 },
        );
    }

    if (userCodeData) {
        return NextResponse.json(
            { message: 'User has already used this code' },
            { status: 404 },
        );
    }

    return NextResponse.json(
        { message: 'Error with user discount code' },
        { status: 500 },
    );
}
