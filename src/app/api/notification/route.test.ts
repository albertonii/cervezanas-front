import createServerClient from '@/utils/supabaseServer';
import { POST } from './route';
import { isResponseCodeOk } from 'redsys-easy';
import { ONLINE_ORDER_STATUS } from '@/constants';
import { NextRequest, NextResponse } from 'next/server';
import { processRestNotification } from '../../[locale]/components/TPV/redsysClient';
import { Response } from 'node-fetch';

// When we enter to this router, we are getting the response from TPV bank
// and we need to check if the response is ok or not.
jest.mock('../../[locale]/components/TPV/redsysClient');
jest.mock('redsys-easy');

// Mocking NextResponse
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((data) => data),
    },
}));

jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((data) => data),
    },
}));

global.Response = jest.fn().mockImplementation(() => ({
    json: jest.fn(),
}));

describe('POST /api/notification', () => {
    let req: NextRequest;
    let formData: FormData;

    beforeEach(() => {
        formData = new FormData();
        formData.append('Ds_SignatureVersion', 'HMAC_SHA256_V1');
        formData.append(
            'Ds_MerchantParameters',
            'eyJEc19BbW91bnQiOiIxNDUiLCJEc19DdXJyZW5jeSI6Ijk3OCIsIkRzX09yZGVyIjoiMTQ0NjA2ODU4MSIsIkRzX01lcmNoYW50Q29kZSI6Ijk5OTAwODg4MSIsIkRzX1Rlcm1pbmFsIjoiMSIsIkRzX1Jlc3BvbnNlIjoiMDAwMCIsIkRzX0F1dGhvcmlzYXRpb25Db2RlIjoiNTAxNjAyIiwiRHNfVHJhbnNhY3Rpb25UeXBlIjoiMCIsIkRzX1NlY3VyZVBheW1lbnQiOiIwIiwiRHNfTGFuZ3VhZ2UiOiIxIiwiRHNfQ2FyZE51bWJlciI6IjQ1NDg4MSoqKioqKioqMDQiLCJEc19NZXJjaGFudERhdGEiOiIiLCJEc19DYXJkX0NvdW50cnkiOiI3MjQiLCJEc19DYXJkX0JyYW5kIjoiMSJ9',
        );
        formData.append(
            'Ds_Signature',
            'QVxoXwwp919v7XYjyBjhr1VXozESRosHPb3PDW-rcME=',
        );

        req = {
            formData: jest.fn().mockResolvedValue(formData),
        } as unknown as NextRequest;
    });

    it('should update order status to PAID when payment is successful', async () => {
        console.log('processRestNotification', processRestNotification);
        (processRestNotification as jest.Mock).mockReturnValue({
            Ds_Response: '0000',
            Ds_Order: '1446068581',
        });
        (isResponseCodeOk as jest.Mock).mockReturnValue(true);

        const supabase = {
            from: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            select: jest.fn().mockResolvedValue({ error: null }),
            insert: jest.fn().mockResolvedValue({ error: null }),
        };
        (createServerClient as jest.Mock).mockResolvedValue(supabase);

        const res = await POST(req);

        expect(supabase.update).toHaveBeenCalledWith({
            status: ONLINE_ORDER_STATUS.PAID,
        });
        expect(supabase.eq).toHaveBeenCalledWith('order_number', '1446068581');
        expect(res).toEqual(
            NextResponse.json({
                message: 'Order number 1446068581 updated successfully',
            }),
        );
    });

    it('should update order status to CANCELLED when payment fails', async () => {
        (processRestNotification as jest.Mock).mockReturnValue({
            Ds_Response: '0101',
            Ds_Order: '1446068581',
        });
        (isResponseCodeOk as jest.Mock).mockReturnValue(false);

        const supabase = {
            from: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            select: jest.fn().mockResolvedValue({ error: null }),
        };
        (createServerClient as jest.Mock).mockResolvedValue(supabase);

        const res = await POST(req);

        expect(supabase.update).toHaveBeenCalledWith({
            status: ONLINE_ORDER_STATUS.CANCELLED,
        });
        expect(supabase.eq).toHaveBeenCalledWith('order_number', '1446068581');
        expect(res).toEqual(
            NextResponse.json({
                message: 'Order number 1446068581 failed. Error Code: 0101',
            }),
        );
    });

    it('should handle database errors gracefully', async () => {
        (processRestNotification as jest.Mock).mockReturnValue({
            Ds_Response: '0000',
            Ds_Order: '1446068581',
        });
        (isResponseCodeOk as jest.Mock).mockReturnValue(true);

        const supabase = {
            from: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            select: jest.fn().mockResolvedValue({
                error: { message: 'Database error', code: '500' },
            }),
        };
        (createServerClient as jest.Mock).mockResolvedValue(supabase);

        const res = await POST(req);

        expect(res).toEqual(
            NextResponse.json({
                message:
                    'Order number 1446068581 failed with error: Database error. Error Code: 500',
            }),
        );
    });
});
