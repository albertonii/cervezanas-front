'use client';

import BoxProductSlotsSection from '../../../../../components/products/boxPack/BoxProductSlotsSection';
import useBoxPackStore from '../../../../../../store/boxPackStore';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { z, ZodType } from 'zod';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMessage } from '../../../../../components/message/useMessage';
import { ModalAddBoxPackFormData } from '../../../../../../../lib/types/product';
import { BoxPackInfoSection } from '../../../../../components/products/boxPack/BoxPackInfoSection';
import { BoxPackStepper } from '../../../../../components/products/boxPack/BoxPackStepper';
import { BoxSummary } from '../../../../../components/products/boxPack/BoxSummary';
import { BoxMultimediaSection } from '../../../../../components/products/boxPack/BoxMultimediaSection';
import Spinner from '../../../../../components/common/Spinner';

const ModalWithForm = dynamic(
    () => import('../../../../../components/modals/ModalWithForm'),
    { ssr: false },
);

const MB_BYTES = 1000000; // Number of bytes in a megabyte.

// This is the list of mime types you will accept with the schema
const ACCEPTED_MIME_TYPES = ['image/gif', 'image/jpeg', 'image/png'];

const schema: ZodType<ModalAddBoxPackFormData> = z.object({
    is_public: z.boolean(),
    name: z.string().nonempty('Name is required'),
    description: z.string().nonempty('Description is required'),
    price: z.number().min(0, 'Price must be greater than 0'),
    weight: z.number().min(0, 'Weight must be greater than 0'),
    slots_per_box: z.number().min(1, 'Slots must be greater than 0'),
    p_principal: z.custom<File>().superRefine((f, ctx) => {
        // First, add an issue if the mime type is wrong.
        if (!ACCEPTED_MIME_TYPES.includes(f.type)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `File must be one of [${ACCEPTED_MIME_TYPES.join(
                    ', ',
                )}] but was ${f.type}`,
            });
        }
        // Next add an issue if the file size is too large.
        if (f.size > 3 * MB_BYTES) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                type: 'array',
                message: `The file must not be larger than ${
                    3 * MB_BYTES
                } bytes: ${f.size}`,
                maximum: 3 * MB_BYTES,
                inclusive: true,
            });
        }
    }),

    p_back: z
        .custom<File>()
        .superRefine((f, ctx) => {
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
                    message: `The file must not be larger than ${
                        3 * MB_BYTES
                    } bytes: ${f.size}`,
                    maximum: 3 * MB_BYTES,
                    inclusive: true,
                });
            }
        })
        .optional(),

    p_extra_1: z
        .custom<File>()
        .superRefine((f, ctx) => {
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
                    message: `The file must not be larger than ${
                        3 * MB_BYTES
                    } bytes: ${f.size}`,
                    maximum: 3 * MB_BYTES,
                    inclusive: true,
                });
            }
        })
        .optional(),

    p_extra_2: z
        .custom<File>()
        .superRefine((f, ctx) => {
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
                    message: `The file must not be larger than ${
                        3 * MB_BYTES
                    } bytes: ${f.size}`,
                    maximum: 3 * MB_BYTES,
                    inclusive: true,
                });
            }
        })
        .optional(),

    p_extra_3: z
        .custom<File>()
        .superRefine((f, ctx) => {
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
                    message: `The file must not be larger than ${
                        3 * MB_BYTES
                    } bytes: ${f.size}`,
                    maximum: 3 * MB_BYTES,
                    inclusive: true,
                });
            }
        })
        .optional(),
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
            name: '',
            description: '',
            price: 0,
            weight: 330,
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
        if (errors) {
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
            slots_per_box,
            p_principal,
        } = form;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/products/box_packs`;

        const formData = new FormData();

        formData.set('name', name);
        formData.set('description', description);
        formData.set('price', price.toString());
        formData.set('weight', weight.toString());
        formData.set('is_public', is_public.toString());
        formData.set('slots_per_box', slots_per_box.toString());

        const boxPackItems = boxPack.boxPackItems;
        formData.set('box_packs', JSON.stringify(boxPackItems));

        formData.set('p_principal', p_principal as File);
        formData.set('p_back', boxPack.p_back as File);
        formData.set('p_extra_1', boxPack.p_extra_1 as File);
        formData.set('p_extra_2', boxPack.p_extra_2 as File);
        formData.set('p_extra_3', boxPack.p_extra_3 as File);

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (response.status !== 200) {
            handleMessage({
                type: 'error',
                message: 'Error creating box pack',
            });

            setIsLoading(false);

            return;
        }

        if (response.status === 200) {
            handleMessage({
                type: 'success',
                message: 'Box pack created successfully',
            });

            setShowModal(false);
            queryClient.invalidateQueries('productList');

            clear();
            reset();
            setIsLoading(false);
        }
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
        try {
            insertProductMutation.mutate(formValues);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <ModalWithForm
            showBtn={true}
            showModal={showModal}
            setShowModal={setShowModal}
            title={'add_box_pack'}
            btnTitle={'add_box_pack'}
            description={''}
            classIcon={''}
            classContainer={`${isLoading && ' opacity-75'}`}
            handler={handleSubmit(onSubmit)}
            handlerClose={() => {
                setActiveStep(0);
                setShowModal(false);
            }}
            form={form}
        >
            <form>
                {isLoading ? (
                    <div className="h-[50vh]">
                        <Spinner size="xxLarge" color="beer-blonde" center />
                    </div>
                ) : (
                    <BoxPackStepper
                        activeStep={activeStep}
                        handleSetActiveStep={handleSetActiveStep}
                        isSubmitting={isSubmitting}
                    >
                        <>
                            <p className="text-slate-500 my-4 sm:text-lg leading-relaxed">
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
                )}
            </form>
        </ModalWithForm>
    );
}
