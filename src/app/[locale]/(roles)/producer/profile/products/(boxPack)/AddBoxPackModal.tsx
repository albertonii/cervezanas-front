'use client';

import dynamic from 'next/dynamic';
import useBoxPackStore from '@/app/store//boxPackStore';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import ProductHeaderDescription from '@/app/[locale]/components/modals/ProductHeaderDescription';
import BoxProductSlotsSection from '@/app/[locale]/components/products/boxPack/BoxProductSlotsSection';
import React, { useState, useEffect } from 'react';
import { z, ZodType } from 'zod';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { faBoxes } from '@fortawesome/free-solid-svg-icons';
import { ModalAddBoxPackFormData } from '@/lib/types/product';
import { useFileUpload } from '@/app/context/ProductFileUploadContext';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { BoxSummary } from '@/app/[locale]/components/products/boxPack/BoxSummary';
import { BoxPackStepper } from '@/app/[locale]/components/products/boxPack/BoxPackStepper';
import { BoxPackInfoSection } from '@/app/[locale]/components/products/boxPack/BoxPackInfoSection';
import { BoxMultimediaSection } from '@/app/[locale]/components/products/boxPack/BoxMultimediaSection';

const ModalWithForm = dynamic(
    () => import('@/app/[locale]/components/modals/ModalWithForm'),
    { ssr: false },
);

const schema: ZodType<ModalAddBoxPackFormData> = z.object({
    is_public: z.boolean(),
    is_available: z.boolean(),
    name: z.string().nonempty('errors.input_required'),
    description: z.string().nonempty('errors.input_required'),
    price: z.number().min(0, 'errors.input_number_min_0'),
    weight: z.number().min(0, 'errors.input_number_min_0'),
    slots_per_box: z.number().min(1, 'errors.input_number_min_1'),
});

type ValidationSchema = z.infer<typeof schema>;

export function AddBoxPackModal() {
    const t = useTranslations();

    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [activeStep, setActiveStep] = useState<number>(0);
    const { clear, boxPack } = useBoxPackStore();
    const { files, clearFiles } = useFileUpload();

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
        },
    });

    const {
        handleSubmit,
        reset,
        formState: { errors },
    } = form;

    const queryClient = useQueryClient();

    useEffect(() => {
        clearFiles();
    }, []);

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
        } = form;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}/api/products/box_packs`;

        const formData = new FormData();

        // Agregar archivos al FormData
        files?.forEach((object, index) => {
            if (object.file) {
                formData.append('media_files', object.file);
                formData.append(
                    `isMain_${index}`,
                    object.isMain ? 'true' : 'false',
                );
            }
        });

        clearFiles();

        formData.set('name', name);
        formData.set('description', description);
        formData.set('price', price.toString());
        formData.set('weight', weight.toString());
        formData.set('is_public', is_public.toString());
        formData.set('is_available', is_available.toString());
        formData.set('slots_per_box', slots_per_box.toString());

        const boxPackItems = boxPack.boxPackItems;
        formData.set('box_packs', JSON.stringify(boxPackItems));

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
            handler={() => {}}
            handlerClose={() => {
                setActiveStep(0);
                setShowModal(false);
            }}
            form={form}
            showTriggerBtn={false}
            showCancelBtn={false}
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
                <BoxPackStepper
                    activeStep={activeStep}
                    handleSetActiveStep={handleSetActiveStep}
                    isSubmitting={isSubmitting}
                    handler={handleSubmit(onSubmit)}
                    btnTitle={'add_box_pack'}
                >
                    <>
                        <ProductHeaderDescription />

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
        </ModalWithForm>
    );
}
