'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { z, ZodType } from 'zod';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppContext } from '@/app/context/AppContext';
import { faBox } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from 'react-query';
import { isFileEmpty } from '@/utils/utils';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { ModalAddBreweryFormData } from '@/lib/types/types';
import BrewerySection from './BrewerySection';

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

const schema: ZodType<ModalAddBreweryFormData> = z.object({
    name: z.string().nonempty(),
    foundation_year: z.number().int().positive(),
    history: z.string().nonempty(),
    description: z.string().nonempty(),
    logo: z.string().nonempty(),
    country: z.string().nonempty(),
    region: z.string().nonempty(),
    sub_region: z.string().nonempty(),
    city: z.string().nonempty(),
    address: z.string().nonempty(),
    website: z.string().nonempty(),
    rrss_ig: z.string().nonempty(),
    rrss_fb: z.string().nonempty(),
    rrss_linkedin: z.string().nonempty(),
    types_of_beers_produced: z.array(z.string().nonempty()),
    special_processing_methods: z.array(z.string().nonempty()),
    guided_tours: z.string().nonempty(),
    is_brewery_dirty: z.boolean(),
});

type ValidationSchema = z.infer<typeof schema>;

export function AddBreweryModal() {
    const t = useTranslations();

    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [activeStep, setActiveStep] = useState<number>(0);

    const { handleMessage } = useMessage();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSetActiveStep = (value: number) => {
        setActiveStep(value);
    };

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            foundation_year: 0,
            history: '',
            description: '',
            logo: '',
            country: '',
            region: '',
            sub_region: '',
            city: '',
            address: '',
            website: '',
            rrss_ig: '',
            rrss_fb: '',
            rrss_linkedin: '',
            types_of_beers_produced: [],
            special_processing_methods: [],
            guided_tours: '',
            is_brewery_dirty: false,
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

    const handleInsertBrewery = async (form: ValidationSchema) => {
        setIsLoading(true);

        const {
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
            is_brewery_dirty,
        } = form;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/breweries`;

        const formData = new FormData();

        // Basic
        // formData.append('name', name);
        // formData.append('description', description ?? '');
        // formData.append('type', type);
        // formData.append('price', price.toString());
        // formData.append('is_public', is_public.toString());
        // formData.append('is_available', is_available.toString());
        // formData.append('category', category);
        // formData.append('weight', weight.toString());

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
            method: 'POST',
            body: formData,
            headers: headers,
        });

        if (response.status !== 200) {
            handleMessage({
                type: 'error',
                message: 'errors.insert_brewery',
            });

            setIsLoading(true);

            return;
        }

        if (response.status === 200) {
            handleMessage({
                type: 'success',
                message: 'success.insert_brewery',
            });

            setShowModal(false);
            setIsLoading(false);
            queryClient.invalidateQueries('breweryList');

            reset();
            setActiveStep(0);
        }
    };

    const insertBreweryMutation = useMutation({
        mutationKey: ['insertBrewery'],
        mutationFn: handleInsertBrewery,
        onMutate: () => {
            setIsSubmitting(true);
        },
        onSuccess: () => {
            setIsSubmitting(false);
        },
        onError: (error: any) => {
            console.error(error);
            setIsSubmitting(false);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: ModalAddBreweryFormData,
    ) => {
        return new Promise<void>((resolve, reject) => {
            insertBreweryMutation.mutate(formValues, {
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
            showBtn={true}
            showModal={showModal}
            setShowModal={setShowModal}
            title={'brewery.add'}
            btnTitle={'brewery.add'}
            triggerBtnTitle={'brewery.agregate'}
            description={''}
            icon={faBox}
            classContainer={`${isLoading && ' opacity-75'}`}
            handler={() => {}}
            handlerClose={() => {
                setActiveStep(0);
                setShowModal(false);
            }}
            form={form}
            showTriggerBtn={false}
            showCancelBtn={false}
        >
            <>
                <p className="text-slate-500 my-4 sm:text-md leading-relaxed">
                    {t('brewery.modal_description')}
                </p>

                <BrewerySection form={form} />
            </>
        </ModalWithForm>
    );
}
