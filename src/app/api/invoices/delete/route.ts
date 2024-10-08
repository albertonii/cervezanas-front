import createServerClient from '@/utils/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createServerClient();

        const formData = await request.formData();

        const invoiceId = formData.get('invoice_id') as string;
        const invoiceFilePath = formData.get('invoice_file_path') as string;

        if (!invoiceId || !invoiceFilePath) {
            return NextResponse.json(
                {
                    message:
                        'ID de factura o dirección del archivo no proporcionado',
                },
                { status: 400 },
            );
        }

        const { error: storageError } = await supabase.storage
            .from('documents')
            .remove([invoiceFilePath]);

        if (storageError) {
            console.error(
                'Error al eliminar el archivo de la factura:',
                storageError,
            );
            return NextResponse.json(
                { message: 'Error deleting invoice file from storage' },
                { status: 500 },
            );
        }

        const { error } = await supabase
            .from('invoices_producer')
            .delete()
            .eq('id', invoiceId);

        if (error) {
            console.error('Error al eliminar la factura:', error);
            return;
        }

        return NextResponse.json(
            { message: 'Invoice successfully deleted' },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json(
            { message: 'Error deleting invoice' },
            { status: 500 },
        );
    }
}
