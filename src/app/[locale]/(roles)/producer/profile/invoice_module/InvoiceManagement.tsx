import Title from '@/app/[locale]/components/ui/Title';
import InvoiceUploadedList from './InvoiceUploadedList';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import Description from '@/app/[locale]/components/ui/Description';
import InputLabel from '@/app/[locale]/components/form/InputLabel';
import React, { useState } from 'react';
import { z, ZodType } from 'zod';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { InvoiceFormData, ISalesRecordsProducer } from '@/lib/types/types';

// This is the list of mime types you will accept with the schema
const ACCEPTED_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
];

const MB_BYTES = 1000000; // Number of bytes in a megabyte.

const validateFile = (files: FileList, ctx: z.RefinementCtx) => {
    if (!files || files.length === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'No se seleccionó ningún archivo.',
        });
        return;
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `El archivo debe ser uno de [${ACCEPTED_MIME_TYPES.join(
                    ', ',
                )}], pero es ${file.type}`,
            });
        }
        if (file.size > 3 * MB_BYTES) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                type: 'number',
                message: `El archivo no debe ser mayor de ${
                    3 * MB_BYTES
                } bytes: ${file.size}`,
                maximum: 3 * MB_BYTES,
                inclusive: true,
            });
        }
    }
};

const schema: ZodType<InvoiceFormData> = z.object({
    invoice_name: z.string().nonempty({ message: 'errors.input_required' }),
    invoice_file: z.instanceof(FileList).superRefine(validateFile),
    total_amount: z.number().min(0, { message: 'errors.input_number_min_0' }),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    salesRecords: ISalesRecordsProducer;
}

const InvoiceManagement = ({ salesRecords }: Props) => {
    const t = useTranslations();

    const [isLoading, setIsLoading] = useState(false);

    const { user } = useAuth();

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            invoice_name: '',
            total_amount: 0,
        },
    });

    const {
        handleSubmit,
        reset,
        formState: { errors },
    } = form;

    const queryClient = useQueryClient();

    const handleUpload = async (form: ValidationSchema) => {
        setIsLoading(true);
        const { invoice_name, invoice_file, total_amount } = form;

        const file = invoice_file[0] as File;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/invoices/upload`;

        const formData = new FormData();

        formData.append('invoice_name', invoice_name);
        formData.append('invoice_file', file);
        formData.append('total_amount', total_amount.toString());
        formData.append('producer_id', user.id);
        formData.append('invoice_period', salesRecords.invoice_period);

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                reset();
                queryClient.invalidateQueries('invoices_by_producer_id');
            } else {
                const data = await response.json();
                alert(`Error al subir el archivo: ${data.error}`);
            }
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error al subir el archivo.');
            setIsLoading(false);
        }
    };

    const uploadInvoiceMutation = useMutation({
        mutationKey: 'upload-invoice',
        mutationFn: handleUpload,
        onError: (error) => {
            console.error('Error al subir la factura:', error);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: InvoiceFormData,
    ) => {
        return new Promise<void>((resolve, reject) => {
            uploadInvoiceMutation.mutate(formValues, {
                onSuccess: () => {
                    resolve();
                },
                onError: (error) => {
                    reject(error);
                },
            });
        });
    };

    return (
        <section
            className={`space-y-8 border border-xl rounded-lg border-gray-300 p-8 ${
                isLoading && 'opacity-60'
            }`}
        >
            <div className="">
                <Title size="large" color="black">
                    {t('invoice_module.invoice_management')}
                </Title>

                <Description size="xsmall">
                    {t('invoice_module.invoice_management_description')}
                </Description>
            </div>

            {/* Sección de subida de archivos */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 border-xl border-1 border-gray-500 gap-4">
                    <div className="col-span-2">
                        <InputLabel
                            label={'invoice_file'}
                            labelText={t('invoice_module.upload_invoice_file')}
                            form={form}
                            inputType="file"
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="col-span-1">
                        <InputLabel
                            label={'invoice_name'}
                            labelText={t('invoice_module.invoice_name')}
                            form={form}
                            isLoading={isLoading}
                            placeholder={t(
                                'invoice_module.invoice_name_placeholder',
                            )}
                        />
                    </div>

                    <div className="col-span-1">
                        <InputLabel
                            label={'total_amount'}
                            labelText={t('invoice_module.total_amount')}
                            form={form}
                            inputType="number"
                            registerOptions={{
                                valueAsNumber: true,
                            }}
                            isLoading={isLoading}
                        />
                    </div>

                    <Button
                        primary
                        large
                        btnType="submit"
                        isLoading={isLoading}
                    >
                        {t('invoice_module.upload_invoice_button')}
                    </Button>
                </div>
            </form>

            {/* Lista de facturas subidas */}
            <InvoiceUploadedList />
        </section>
    );
};

export default InvoiceManagement;
