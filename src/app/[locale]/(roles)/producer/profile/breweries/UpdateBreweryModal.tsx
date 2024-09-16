'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { z, ZodType } from 'zod';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { faBox } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from 'react-query';
import { isFileEmpty } from '@/utils/utils';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { ModalUpdateBreweryFormData } from '@/lib/types/types';
import UpdateBreweryInfo from './UpdateBreweryInfo';
import useBreweryStore from '@/app/store/breweryStore';
import UpdateBreweryExtraDetails from './UpdateBreweryExtraDetails';
import UpdateBreweryLocation from './UpdateBreweryLocation';
import UpdateBreweryRRSS from './UpdateBreweryRRSS';

const ModalWithForm = dynamic(
    () => import('@/app/[locale]/components/modals/ModalWithForm'),
    { ssr: false },
);

// This is the list of mime types you will accept with the schema
const ACCEPTED_MIME_TYPES = [
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/webp',
];

const MB_BYTES = 1000000; // Number of bytes in a megabyte.

const validateFile = (f: File, ctx: any) => {
    if (!f) return;
    if (typeof f === 'string') return;

    if (!ACCEPTED_MIME_TYPES.includes(f.type)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `File must be one of [${ACCEPTED_MIME_TYPES.join(
                ', ',
            )}] but was ${f.type}`,
        });
    }
    if (f.size > 3 * MB_BYTES) {
        ctx.addIssue({
            code: z.ZodIssueCode.too_big,
            type: 'array',
            message: `The file must not be larger than ${3 * MB_BYTES} bytes: ${
                f.size
            }`,
            maximum: 3 * MB_BYTES,
            inclusive: true,
        });
    }
};

const schema: ZodType<ModalUpdateBreweryFormData> = z.object({
    id: z.string().nonempty({ message: 'errors.input_required' }),
    name: z
        .string()
        .min(2, { message: 'errors.min_2_characters' })
        .max(50, { message: 'errors.error_50_number_max_length' })
        .regex(/^[a-zA-Z0-9\s]+$/, { message: 'errors.invalid_characters' }),
    foundation_year: z
        .number()
        .int()
        .min(1900, { message: 'errors.input_number_min_1900' }),
    history: z.string().nonempty({ message: 'errors.input_required' }),
    description: z.string().nonempty({ message: 'errors.input_required' }),
    // logo: z
    //     .any()
    //     .refine((file) => file instanceof File, {
    //         message: 'errors.invalid_file_type',
    //     })
    //     .refine((file) => ACCEPTED_MIME_TYPES.includes(file.type), {
    //         message: `errors.invalid_mime_type`,
    //     })
    //     .refine((file) => file.size <= 3 * MB_BYTES, {
    //         message: `errors.file_too_large`,
    //     })
    //     .optional(),
    logo: z.any().optional(),
    country: z.string().nonempty({ message: 'errors.input_required' }),
    region: z.string().nonempty({ message: 'errors.input_required' }),
    sub_region: z.string().nonempty({ message: 'errors.input_required' }),
    city: z.string().nonempty({ message: 'errors.input_required' }),
    address: z.string().nonempty({ message: 'errors.input_required' }),
    website: z.string().optional(),
    rrss_ig: z
        .string()
        .refine(
            (value) => value === '' || /^[a-zA-Z0-9._]{1,30}$/.test(value),
            {
                message:
                    'Solo se permiten caracteres alfanuméricos, puntos y guiones bajos, con un máximo de 30 caracteres.',
            },
        )
        .optional(),
    rrss_fb: z
        .string()
        .refine(
            (value) => value === '' || /^[a-zA-Z0-9._]{1,30}$/.test(value),
            {
                message:
                    'Solo se permiten caracteres alfanuméricos, puntos y guiones bajos, con un máximo de 30 caracteres.',
            },
        )
        .optional(),
    rrss_linkedin: z
        .string()
        .refine(
            (value) => value === '' || /^[a-zA-Z0-9._]{1,30}$/.test(value),
            {
                message:
                    'Solo se permiten caracteres alfanuméricos, puntos y guiones bajos, con un máximo de 30 caracteres.',
            },
        )
        .optional(),
    types_of_beers_produced: z.array(z.string()).optional(),
    special_processing_methods: z.array(z.string()).optional(),
    guided_tours: z.string().optional(),
});

type ValidationSchema = z.infer<typeof schema>;

export function UpdateBreweryModal() {
    const t = useTranslations();

    const [isLoading, setIsLoading] = useState(false);

    const { brewery, isEditShowModal, handleEditShowModal } = useBreweryStore();
    const { handleMessage } = useMessage();

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            id: brewery.id,
            name: brewery.name,
            foundation_year: brewery.foundation_year,
            history: brewery.history,
            description: brewery.description,
            logo: brewery.logo,
            country: brewery.country,
            region: brewery.region,
            sub_region: brewery.sub_region,
            city: brewery.city,
            address: brewery.address,
            website: brewery.website,
            rrss_ig: brewery.rrss_ig,
            rrss_fb: brewery.rrss_fb,
            rrss_linkedin: brewery.rrss_linkedin,
            types_of_beers_produced: brewery.types_of_beers_produced,
            special_processing_methods: brewery.special_processing_methods,
            guided_tours: brewery.guided_tours,
        },
    });

    const {
        handleSubmit,
        reset,
        formState: { errors },
    } = form;

    const queryClient = useQueryClient();

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.info('Errores detectados creando un breweryo', errors);
        }
    }, [errors]);

    const handleUpdateBrewery = async (form: ValidationSchema) => {
        setIsLoading(true);

        const {
            id: breweryId,
            name,
            foundation_year,
            history,
            description,
            logo,
            country,
            region,
            sub_region,
            city,
            address,
            website,
            rrss_ig,
            rrss_fb,
            rrss_linkedin,
            types_of_beers_produced,
            special_processing_methods,
            guided_tours,
        } = form;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/breweries`;

        const formData = new FormData();

        // Basic
        formData.append('brewery_id', breweryId);
        formData.append('name', name);
        formData.append('foundation_year', foundation_year.toString());
        formData.append('history', history);
        formData.append('description', description);
        formData.append('country', country);
        formData.append('region', region);
        formData.append('sub_region', sub_region);
        formData.append('city', city);
        formData.append('address', address);
        formData.append('website', website || '');
        formData.append('rrss_ig', rrss_ig || '');
        formData.append('rrss_fb', rrss_fb || '');
        formData.append('rrss_linkedin', rrss_linkedin || '');
        formData.append(
            'types_of_beers_produced',
            types_of_beers_produced?.join(',') || '',
        );
        formData.append(
            'special_processing_methods',
            special_processing_methods?.join(',') || '',
        );
        formData.append('guided_tours', guided_tours || '');

        // Logo
        if (logo && !isFileEmpty(logo)) {
            formData.append('logo', logo);
        }

        // CORS
        const headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', 'POST');
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append(
            'Access-Control-Allow-Headers',
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
        );

        const response = await fetch(url, {
            method: 'PUT',
            body: formData,
            headers: headers,
        });

        if (response.status !== 200) {
            handleMessage({
                type: 'error',
                message: 'errors.update_brewery',
            });

            setIsLoading(true);

            return;
        }

        if (response.status === 200) {
            handleMessage({
                type: 'success',
                message: 'success.update_brewery',
            });

            handleEditShowModal(false);
            setIsLoading(false);

            queryClient.invalidateQueries('breweriesList', {
                refetchActive: true,
            });

            reset();
        }
    };

    const updateBreweryMutation = useMutation({
        mutationKey: ['updateBrewery'],
        mutationFn: handleUpdateBrewery,
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: ModalUpdateBreweryFormData,
    ) => {
        return new Promise<void>((resolve, reject) => {
            updateBreweryMutation.mutate(formValues, {
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
        <ModalWithForm
            showModal={isEditShowModal}
            setShowModal={handleEditShowModal}
            title={'brewery.edit'}
            btnTitle={'brewery.update'}
            triggerBtnTitle={'brewery.update'}
            description={''}
            icon={faBox}
            classContainer={`${isLoading && ' opacity-75'}`}
            handler={handleSubmit(onSubmit)}
            handlerClose={() => {
                handleEditShowModal(false);
            }}
            form={form}
            showCancelBtn={false}
        >
            <>
                <p className="text-slate-500 my-4 sm:text-md leading-relaxed">
                    {t('brewery.modal_description')}
                </p>

                <section className="relative border-2 rounded-lg border-gray-200 p-6 bg-white shadow-md space-y-8 mt-8">
                    <UpdateBreweryInfo form={form} />

                    <UpdateBreweryExtraDetails form={form} />

                    <UpdateBreweryLocation form={form} />

                    <UpdateBreweryRRSS form={form} />
                </section>
            </>
        </ModalWithForm>
    );
}
