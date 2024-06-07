'use client';

import React, { useState } from 'react';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from 'react-query';
import ModalWithForm from '../../../../components/modals/ModalWithForm';
import { ModalAddCampaignFormData } from '../../../../../../lib/types/types';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import SelectInput from '../../../../components/common/SelectInput';
import { SupabaseProps } from '../../../../../../constants';
import { FilePreviewImageMultimedia } from '../../../../components/common/FilePreviewImageMultimedia';
import InputLabel from '../../../../components/common/InputLabel';
import InputTextarea from '../../../../components/common/InputTextarea';
import { v4 as uuidv4 } from 'uuid';
import { generateFileNameExtension } from '../../../../../../utils/utils';

const generateUUID = () => {
    return uuidv4();
};

enum CampaignStatus {
    uninitialized = 'uninitialized',
    active = 'active',
    finished = 'finished',
    cancelled = 'cancelled',
    paused = 'paused',
}

export const campaign_status_options: {
    label: string;
    value: CampaignStatus;
}[] = [
    { label: 'uninitialized', value: CampaignStatus.uninitialized },
    { label: 'active', value: CampaignStatus.active },
    { label: 'finished', value: CampaignStatus.finished },
    { label: 'cancelled', value: CampaignStatus.cancelled },
    { label: 'paused', value: CampaignStatus.paused },
];

const schema: ZodType<ModalAddCampaignFormData> = z.object({
    name: z.string().min(2, { message: 'errors.input_number__min_2' }).max(50, {
        message: 'errors.error_50_number_max_length',
    }),
    description: z
        .string()
        .min(2, { message: 'errors.input_number__min_2' })
        .max(2500, {
            message: 'errors.error_2500_max_length',
        }),
    img_url: z.instanceof(FileList).optional(),
    is_public: z.boolean(),
    start_date: z.date(),
    end_date: z.date(),
    slogan: z
        .string()
        .min(2, { message: 'errors.input_number__min_2' })
        .max(50, {
            message: 'errors.error_50_number_max_length',
        }),
    goal: z.string().min(2, { message: 'errors.input_number__min_2' }).max(50, {
        message: 'errors.error_50_number_max_length',
    }),
    status: z.string().nonempty({
        message: 'errors.input_required',
    }),
});

type ValidationSchema = z.infer<typeof schema>;

export function AddCampaign() {
    const t = useTranslations();

    const preUrl =
        SupabaseProps.BASE_URL + SupabaseProps.STORAGE_PRODUCTS_IMG_URL;

    const { supabase, user } = useAuth();

    const [showModal, setShowModal] = useState<boolean>(false);

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            description: '',
            is_public: false,
            slogan: '',
            goal: '',
            status: '',
        },
    });

    const { register, handleSubmit, reset } = form;
    const queryClient = useQueryClient();

    const handleInsertCampaign = async (form: ValidationSchema) => {
        const {
            name,
            description,
            img_url,
            is_public,
            start_date,
            end_date,
            slogan,
            goal,
            status,
        } = form;

        const startDateToString = start_date?.toISOString();
        const endDateToString = end_date?.toISOString();

        const randomUUID = generateUUID();

        const filename = `campaign/${user.id}/${randomUUID}`;
        let campaign_img_url = '';
        if (img_url && img_url[0]) {
            campaign_img_url = encodeURIComponent(
                `${filename}${generateFileNameExtension(img_url[0].name)}`,
            );
        }

        // TODO: Upload the campaign img_url to the storage

        const { error } = await supabase.from('campaigns').insert({
            name,
            description,
            img_url: campaign_img_url,
            is_public,
            start_date: startDateToString,
            end_date: endDateToString,
            slogan,
            goal,
            status,
            owner_id: user.id,
            campaign_discount: 0,
            social_cause: '',
        });

        if (error) {
            throw error;
        }

        reset();

        queryClient.invalidateQueries('campaignList');
        setShowModal(false);
    };

    const insertCampaignMutation = useMutation({
        mutationKey: ['insertCampaign'],
        mutationFn: handleInsertCampaign,
        onError: (error: any) => {
            console.error(error);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: ModalAddCampaignFormData,
    ) => {
        return new Promise<void>((resolve, reject) => {
            insertCampaignMutation.mutate(formValues, {
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
            title={'add_campaign'}
            btnTitle={'save'}
            description={''}
            classIcon={''}
            classContainer={''}
            handler={handleSubmit(onSubmit)}
            handlerClose={() => {
                setShowModal(false);
            }}
            form={form}
        >
            <form className="relative flex-auto space-y-4">
                <div className="flex w-full flex-col items-end">
                    <label
                        className="relative inline-flex cursor-pointer items-center"
                        htmlFor="is_public"
                    >
                        <input
                            id="is_public"
                            type="checkbox"
                            className="peer sr-only"
                            {...register('is_public', {
                                required: true,
                            })}
                            defaultChecked={true}
                        />

                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-beer-blonde peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beer-softFoam dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-beer-blonde"></div>

                        <span className="ml-3 text-lg font-medium text-gray-900 dark:text-gray-300">
                            {t('is_public_campaign')}
                        </span>
                    </label>

                    <span className="mt-2 text-sm font-medium text-gray-400 dark:text-gray-300">
                        {t('is_public_campaign_description')}
                    </span>
                </div>

                {/* name & status  */}
                <div className="flex w-full flex-row space-x-3 ">
                    <InputLabel
                        form={form}
                        label={'name'}
                        labelText={t('campaign_name')}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder={t('introduce_campaign_name')}
                    />

                    <SelectInput
                        form={form}
                        labelTooltip={'campaign_status_tooltip'}
                        options={campaign_status_options}
                        label={'status'}
                        registerOptions={{
                            required: true,
                        }}
                    />
                </div>

                {/* Description  */}
                <InputTextarea
                    form={form}
                    label={'description'}
                    labelText={t('campaign_description')}
                    registerOptions={{
                        required: true,
                    }}
                    placeholder={`${t('introduce_campaign_description')}`}
                />

                {/* Slogan  */}
                <InputLabel
                    form={form}
                    label={'slogan'}
                    registerOptions={{
                        required: true,
                    }}
                />

                {/* Goal  */}
                <InputLabel
                    form={form}
                    label={'goal'}
                    registerOptions={{
                        required: true,
                    }}
                />

                {/* Start and end date  */}
                <div className="flex flex-row space-x-4">
                    <InputLabel
                        form={form}
                        label={'start_date'}
                        registerOptions={{
                            required: true,
                            valueAsDate: true,
                        }}
                        inputType={'date'}
                    />

                    <InputLabel
                        form={form}
                        label={'end_date'}
                        registerOptions={{
                            required: true,
                            valueAsDate: true,
                        }}
                        inputType={'date'}
                    />
                </div>

                <div className="w-full">
                    <h2 className="text-base">{t('campaign_logo')}</h2>

                    <FilePreviewImageMultimedia
                        form={form}
                        registerName={`img_url`}
                        preUrl={preUrl}
                    />
                </div>
            </form>
        </ModalWithForm>
    );
}
