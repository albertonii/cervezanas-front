'use client';

import dynamic from 'next/dynamic';
import useBoxPackStore from '@/app/store//boxPackStore';
import Spinner from '@/app/[locale]/components/common/Spinner';
import BoxProductSlotsSection from '@/app/[locale]/components/products/boxPack/BoxProductSlotsSection';
import React, { useState, useEffect } from 'react';
import { z, ZodType } from 'zod';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { faBoxes } from '@fortawesome/free-solid-svg-icons';
import { ModalAddBoxPackFormData } from '@/lib/types/product';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { BoxSummary } from '@/app/[locale]/components/products/boxPack/BoxSummary';
import { BoxPackStepper } from '@/app/[locale]/components/products/boxPack/BoxPackStepper';
import { BoxPackInfoSection } from '@/app/[locale]/components/products/boxPack/BoxPackInfoSection';
import { BoxMultimediaSection } from '@/app/[locale]/components/products/boxPack/BoxMultimediaSection';

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

const schema: ZodType<ModalAddBoxPackFormData> = z.object({
    is_public: z.boolean(),
    is_available: z.boolean(),
    name: z.string().nonempty('errors.input_required'),
    description: z.string().nonempty('errors.input_required'),
    price: z.number().min(0, 'errors.input_number_min_0'),
    weight: z.number().min(0, 'errors.input_number_min_0'),
    slots_per_box: z.number().min(1, 'errors.input_number_min_1'),
    p_principal: z.custom<File>().superRefine(validateFile),
    p_back: z.custom<File>().superRefine(validateFile).optional(),
    p_extra_1: z.custom<File>().superRefine(validateFile).optional(),
    p_extra_2: z.custom<File>().superRefine(validateFile).optional(),
    p_extra_3: z.custom<File>().superRefine(validateFile).optional(),
});

type ValidationSchema = z.infer<typeof schema>;

export function AddBoxPackModal() {
    const t = useTranslations();

    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [activeStep, setActiveStep] = useState<number>(0);
    const { clear, boxPack } = useBoxPackStore();
    const { handleMessage } = useMessage();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            is_public: true,
            is_available: true,
            name: '',
            description: '',
            price: 0,
            weight: 0,
            slots_per_box: 6,
            p_principal: null,
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
            console.info('Errores detectados creando un pack', errors);
        }
    }, [errors]);

    const handleSetActiveStep = (value: number) => {
        setActiveStep(value);
    };

    const handleInsertBoxPack = async (form: ValidationSchema) => {
        setIsLoading(true);

        const {
            name,
            description,
            price,
            weight,
            is_public,
            is_available,
            slots_per_box,
            p_principal,
            p_back,
            p_extra_1,
            p_extra_2,
            p_extra_3,
        } = form;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/products/box_packs`;

        const formData = new FormData();

        formData.set('name', name);
        formData.set('description', description);
        formData.set('price', price.toString());
        formData.set('weight', weight.toString());
        formData.set('is_public', is_public.toString());
        formData.set('is_available', is_available.toString());
        formData.set('slots_per_box', slots_per_box.toString());

        const boxPackItems = boxPack.boxPackItems;
        formData.set('box_packs', JSON.stringify(boxPackItems));

        if (p_principal) {
            formData.set('p_principal', p_principal as File);
        }

        if (p_back) {
            formData.set('p_back', p_back as File);
        }

        if (p_extra_1) {
            formData.set('p_extra_1', p_extra_1 as File);
        }

        if (p_extra_2) {
            formData.set('p_extra_2', p_extra_2 as File);
        }

        if (boxPack.p_extra_3) {
            formData.set('p_extra_3', p_extra_3 as File);
        }

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (response.status !== 200) {
            handleMessage({
                type: 'error',
                message: 'errors.creating_box_pack',
            });

            setIsLoading(false);

            return;
        }

        handleMessage({
            type: 'success',
            message: `${t('success.boxpack_created')}`,
        });

        setShowModal(false);
        queryClient.invalidateQueries('productList');

        clear();
        reset();
        setIsLoading(false);
    };

    const insertProductMutation = useMutation({
        mutationKey: ['insertBoxPack'],
        mutationFn: handleInsertBoxPack,
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
        formValues: ModalAddBoxPackFormData,
    ) => {
        return new Promise<void>((resolve, reject) => {
            insertProductMutation.mutate(formValues, {
                onSuccess: () => resolve(),
                onError: (error: any) => reject(error),
            });
        });
    };

    return (
        <ModalWithForm
            showBtn={true}
            showModal={showModal}
            setShowModal={setShowModal}
            title={'add_box_pack'}
            btnTitle={'add_box_pack'}
            description={''}
            classContainer={`${isLoading && ' opacity-75'}`}
            icon={faBoxes}
            handler={handleSubmit(onSubmit)}
            handlerClose={() => {
                setActiveStep(0);
                setShowModal(false);
            }}
            form={form}
        >
            {isLoading ? (
                <div className="h-[50vh]">
                    <Spinner
                        size="xxLarge"
                        color="beer-blonde"
                        absolutePosition="center"
                    />
                </div>
            ) : (
                <form>
                    <BoxPackStepper
                        activeStep={activeStep}
                        handleSetActiveStep={handleSetActiveStep}
                        isSubmitting={isSubmitting}
                    >
                        <>
                            <p className="text-slate-500 my-4 text-sm leading-normal max-w-full text-justify bg-cerv-brown bg-opacity-10 p-4 rounded-2xl">
                                {t('modal_product_description')}
                            </p>

                            {activeStep === 0 ? (
                                <BoxPackInfoSection form={form} />
                            ) : activeStep === 1 ? (
                                <BoxProductSlotsSection form={form} />
                            ) : activeStep === 2 ? (
                                <BoxMultimediaSection form={form} />
                            ) : (
                                <BoxSummary form={form} />
                            )}
                        </>
                    </BoxPackStepper>
                </form>
            )}
        </ModalWithForm>
    );
}
