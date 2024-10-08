import createServerClient from '@/utils/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles the PUT request to update the status of a sales record.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object indicating the result of the operation.
 *
 * @route PUT /api/invoices/sales_records_download
 *
 * This endpoint expects a form data payload containing:
 * - `sales_records_id` (string): The ID of the sales record to update.
 * - `status` (string): The new status to set for the sales record.
 *
 * Responses:
 * - 200: Sales record successfully updated.
 * - 400: Sales records ID and status are required.
 * - 500: Error updating sales record.
 */
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createServerClient();

        const formData = await request.formData();

        const salesRecordsId = formData.get('sales_records_id') as string;
        const status = formData.get('status') as string;

        if (!salesRecordsId || !status) {
            return NextResponse.json(
                { message: 'Sales records ID and status are required' },
                { status: 400 },
            );
        }

        const { error } = await supabase
            .from('sales_records_producer')
            .update({ status })
            .eq('id', salesRecordsId);

        if (error) {
            console.error(
                'Error al actualizar el estados del registro de ventas:',
                error,
            );
            return NextResponse.json(
                { message: 'Error al actualizar registro de ventas' },
                { status: 500 },
            );
        }

        return NextResponse.json(
            { message: 'Sales Records successfully updated' },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json(
            { message: 'Error updating Sales Records' },
            { status: 500 },
        );
    }
}
