import path from 'path';
import createServerClient from '@/utils/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';
import { generateFileNameExtension } from '@/utils/utils';

const uploadDir = path.join(process.cwd(), 'public', 'documents', 'invoices');

export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerClient();

        const formData = await request.formData();

        const invoiceName = formData.get('invoice_name') as string;
        const invoiceFile = formData.get('invoice_file') as File;
        const producerId = formData.get('producer_id') as string;
        const totalAmount = parseFloat(formData.get('total_amount') as string);
        // const invoicePeriod = formData.get('invoice_period') as string;

        if (!invoiceName || !invoiceFile) {
            return NextResponse.json(
                { message: 'Nombre de factura o archivo no proporcionado' },
                { status: 400 },
            );
        }

        // Leer el contenido del archivo
        const arrayBuffer = await invoiceFile.arrayBuffer();

        const buffer = Buffer.from(arrayBuffer);

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileName =
            invoiceName +
            '-' +
            uniqueSuffix +
            '.' +
            generateFileNameExtension(invoiceFile.name);

        // Subir el archivo al almacenamiento de Supabase
        const filePath = `invoices/${fileName}`;

        const { data, error: uploadError } = await supabase.storage
            .from('documents') // Reemplaza con el nombre de tu bucket
            .upload(filePath, buffer, {
                contentType: invoiceFile.type,
                upsert: false, // Evita sobrescribir archivos existentes
            });

        if (uploadError) {
            console.error('Error al subir el archivo:', uploadError);
            return NextResponse.json(
                { message: 'Error al subir el archivo' },
                { status: 500 },
            );
        }

        // Guardar la información de la factura en la base de datos
        const { error: dbError } = await supabase
            .from('invoices_producer') // Asegúrate de que esta tabla exista
            .insert([
                {
                    producer_id: producerId,
                    name: invoiceName,
                    file_path: filePath,
                    total_amount: totalAmount,
                    // invoice_period: invoicePeriod,
                },
            ]);

        if (dbError) {
            console.error(
                'Error al guardar la factura en la base de datos:',
                dbError,
            );
            return NextResponse.json(
                { message: 'Error al guardar la factura' },
                { status: 500 },
            );
        }

        return NextResponse.json(
            { message: 'Invoice successfully uploaded' },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json(
            { message: 'Error uploading invoice' },
            { status: 500 },
        );
    }
}
