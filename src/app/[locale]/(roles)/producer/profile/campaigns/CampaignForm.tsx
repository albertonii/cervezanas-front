'use client';

import React, { ChangeEvent, ComponentProps, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { ICampaign, ICampaignItem } from '../../../../../../lib/types/types';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import Button from '../../../../components/common/Button';
import { DeleteButton } from '../../../../components/common/DeleteButton';
import { DisplayInputError } from '../../../../components/common/DisplayInputError';
import { useMessage } from '../../../../components/message/useMessage';
import InputTextarea from '../../../../components/common/InputTextarea';
import InputLabel from '../../../../components/common/InputLabel';

enum CampaignStatus {
    uninitialized = 'uninitialized',
    active = 'active',
    finished = 'finished',
    cancelled = 'cancelled',
    paused = 'paused',
}

enum SocialCauseExample {
    cleanOcean = 'Clean Ocean',
    beersInPeace = 'Beers in Peace',
}

type Props = {
    index: number;
    campaigns: ICampaign[];
    field: any;
    handleDeleteShowModal: ComponentProps<any>;
    handleShowProductsInCampaignModal: ComponentProps<any>;
    handleSaveCampaign: ComponentProps<any>;
    form: UseFormReturn<any, any>;
};

export function CampaignForm({
    index,
    field,
    handleDeleteShowModal,
    handleShowProductsInCampaignModal,
    handleSaveCampaign,
    form,
}: Props) {
    const t = useTranslations();

    const { user, supabase } = useAuth();

    const { handleMessage } = useMessage();

    const { register, getValues } = form;

    const [campaignStatus, setCampaignStatus] = useState(
        field.status ?? CampaignStatus.uninitialized,
    );

    const api_handleSaveCampaign = async (index: number) => {
        const campaign = getValues('campaigns')[index];

        if (campaign.id === '' || campaign.id === undefined) {
            const { data, error: campaignError } = await supabase
                .from('campaigns')
                .insert({
                    name: campaign.name,
                    description: campaign.description,
                    img_url: campaign.img_url,
                    is_public: campaign.is_public,
                    start_date: campaign.start_date,
                    end_date: campaign.end_date,
                    owner_id: user?.id ?? '',
                    slogan: campaign.slogan,
                    goal: campaign.goal,
                    status: campaign.status,
                });

            if (campaignError) throw campaignError;
            if (!data) return;
            const campaign_ = data[0] as ICampaign;

            if (campaign_.id !== campaign.id) {
                campaign.id = campaign_.id;
                handleSaveCampaign(campaign);
            }
        } else {
            const { data, error: campaignError } = await supabase
                .from('campaigns')
                .update({
                    name: campaign.name,
                    description: campaign.description,
                    img_url: campaign.img_url,
                    is_public: campaign.is_public,
                    start_date: campaign.start_date,
                    end_date: campaign.end_date,
                    owner_id: user?.id ?? '',
                    slogan: campaign.slogan,
                    goal: campaign.goal,
                    status: campaign.status,
                })
                .eq('id', campaign.id);

            if (campaignError) throw campaignError;
            if (!data) return;
            const campaign_ = data[0] as ICampaign;

            if (campaign_.id !== campaign.id) {
                campaign.id = campaign_.id;
                handleSaveCampaign(campaign);
            }
        }

        const products = getValues('products');

        if (products === undefined) return;

        products.map(async (item: ICampaignItem) => {
            if (!item.product_id) {
                const { error: orderItemError } = await supabase
                    .from('campaign_item')
                    .delete()
                    .eq('campaign_id', campaign.id);

                if (orderItemError) throw orderItemError;
            } else if (typeof item.product_id === 'string') {
                products?.map(async (item: ICampaignItem) => {
                    const { error: orderItemError } = await supabase
                        .from('campaign_item')
                        .upsert({
                            campaign_id: campaign.id,
                            product_id: item.product_id,
                            product_price: item.product_price,
                        });

                    if (orderItemError) throw orderItemError;
                });
            }
        });

        handleMessage({
            type: 'success',
            message: `${t('campaign_added_successfully')} , ${campaign.name}`,
        });
    };

    const handleStatusClick = (e: ChangeEvent<any>) => {
        const value = e.target.value;
        setCampaignStatus(value);
    };

    const handleSocialCauseClick = (e: ChangeEvent<any>) => {
        const value = e.target.value;
    };

    return (
        <form>
            <fieldset className="relative space-y-2 rounded bg-beer-softBlonde p-4">
                {/* Campaign Status Signal  */}
                <div className="absolute right-0 top-0 mr-2 mt-2">
                    <div className="flex flex-row items-center space-x-2">
                        <p className="text-md font-semibold text-gray-600">
                            {campaignStatus === CampaignStatus.active
                                ? t('active').toUpperCase()
                                : campaignStatus === CampaignStatus.paused
                                ? t('paused').toUpperCase()
                                : campaignStatus === CampaignStatus.cancelled
                                ? t('cancelled').toUpperCase()
                                : campaignStatus === CampaignStatus.finished
                                ? t('finished').toUpperCase()
                                : t('uninitialized').toUpperCase()}
                        </p>

                        <div
                            className={`h-4 w-4 rounded-full  ${
                                campaignStatus === CampaignStatus.active
                                    ? 'bg-green-500'
                                    : campaignStatus === CampaignStatus.paused
                                    ? 'bg-yellow-500'
                                    : campaignStatus ===
                                      CampaignStatus.cancelled
                                    ? 'bg-red-500'
                                    : campaignStatus === CampaignStatus.finished
                                    ? 'bg-gray-500'
                                    : 'bg-gray-500'
                            }`}
                        ></div>
                    </div>
                </div>

                <div className="flex w-full flex-row space-y-2">
                    {/* Is Public  */}
                    <div className="space-y flex w-full flex-col">
                        <label
                            htmlFor={`${index}-campaign_is_public`}
                            className="mr-2 text-sm text-gray-600"
                        >
                            {t('is_public_campaign')}
                        </label>

                        <select
                            id={`${index}-campaign_is_public`}
                            defaultValue="false"
                            className="relative block w-20 appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                            {...register(
                                `campaigns.${index}.is_public` as const,
                            )}
                        >
                            <option key={0} value={'false'}>
                                {t('no')}
                            </option>
                            <option key={1} value={'true'}>
                                {t('yes')}
                            </option>
                        </select>

                        {`errors.campaigns.${index}.is_public?.type` ===
                            'required' && (
                            <DisplayInputError message="errors.input_required" />
                        )}
                    </div>

                    {/* Status  */}
                    <div className="space-y flex w-full flex-col">
                        <label
                            htmlFor={`${index}-campaign_status`}
                            className="mr-2 text-sm text-gray-600"
                        >
                            {t('status')}
                        </label>

                        <select
                            {...register(`campaigns.${index}.status` as const, {
                                required: true,
                            })}
                            onChange={(e) => handleStatusClick(e)}
                            className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                        >
                            {(
                                Object.keys(CampaignStatus) as Array<
                                    keyof CampaignStatus
                                >
                            ).map((option, index) => (
                                <option key={index} value={option.toString()}>
                                    {option.toString().toUpperCase()}
                                </option>
                            ))}
                        </select>

                        {`errors.campaigns.${index}.status.type` ===
                            'required' && (
                            <DisplayInputError message="errors.input_required" />
                        )}
                    </div>
                </div>

                {/* Campaign Image */}
                <div className="space-y flex w-full flex-col">
                    <label
                        htmlFor={`${index}-campaign_img_url`}
                        className="mr-2 text-sm text-gray-600"
                    >
                        {t('img_url')}
                    </label>

                    <input
                        type="file"
                        className="rounded-md border border-gray-300 p-2"
                        defaultValue=""
                        {...register(`campaigns.${index}.img_url` as const, {
                            required: true,
                        })}
                    />
                    {`errors.campaigns.${index}.img_url.type` ===
                        'required' && (
                        <DisplayInputError message="errors.input_required" />
                    )}
                </div>

                {/* Campaign Name  */}
                <InputLabel
                    form={form}
                    label={`campaigns.${index}.name`}
                    labelText={t('name')}
                    registerOptions={{
                        required: true,
                        maxLength: 30,
                    }}
                />

                {/* Description  */}
                <InputTextarea
                    form={form}
                    label={`campaigns.${index}.description`}
                    labelText={t('description')}
                    registerOptions={{
                        required: true,
                        maxLength: 200,
                    }}
                />

                {/* Slogan  */}
                <div className="space-y flex w-full flex-col">
                    <label
                        htmlFor={`${index}-campaign_slogan`}
                        className="mr-2 text-sm text-gray-600"
                    >
                        {t('slogan')}
                    </label>

                    <textarea
                        className="rounded-md border border-gray-300"
                        defaultValue={field.slogan}
                        {...register(`campaigns.${index}.slogan` as const, {
                            required: true,
                            maxLength: 200,
                        })}
                    />
                    {`errors.campaigns.${index}.slogan.type` === 'required' && (
                        <DisplayInputError message="errors.input_required" />
                    )}
                    {`errors.campaigns.${index}.slogan.type` ===
                        'maxLength' && (
                        <DisplayInputError message="errors.error_200_max_length" />
                    )}
                </div>

                {/* Goal  */}
                <div className="space-y flex w-full flex-col">
                    <label
                        htmlFor={`${index}-campaign_goal`}
                        className="mr-2 text-sm text-gray-600"
                    >
                        {t('goal')}
                    </label>

                    <textarea
                        className="rounded-md border border-gray-300"
                        defaultValue={field.goal}
                        {...register(`campaigns.${index}.goal` as const, {
                            required: true,
                            maxLength: 200,
                        })}
                    />
                    {`errors.campaigns.${index}.goal.type` === 'required' && (
                        <DisplayInputError message="errors.input_required" />
                    )}
                    {`errors.campaigns.${index}.goal.type` === 'maxLength' && (
                        <DisplayInputError message="errors.error_200_max_length" />
                    )}
                </div>

                <div className="space-y flex w-full flex-row space-x-4">
                    {/* Start Date  */}
                    <div className="space-y flex w-full flex-col">
                        <label
                            htmlFor={`${index}-campaign_start_date`}
                            className="mr-2 text-sm text-gray-600"
                        >
                            {t('start_date')}
                        </label>

                        <input
                            type={'date'}
                            className="rounded-md border border-gray-300"
                            defaultValue={field.start_date.toString()}
                            {...register(
                                `campaigns.${index}.start_date` as const,
                            )}
                        />
                        {`errors.campaigns.${index}.start_date.type` ===
                            'required' && (
                            <DisplayInputError message="errors.input_required" />
                        )}
                    </div>

                    {/* End Date  */}
                    <div className="space-y flex w-full flex-col">
                        <label
                            htmlFor={`${index}-campaign_end_date`}
                            className="mr-2 text-sm text-gray-600"
                        >
                            {t('end_date')}
                        </label>

                        <input
                            type={'date'}
                            className="rounded-md border border-gray-300"
                            defaultValue={field.end_date.toString()}
                            {...register(
                                `campaigns.${index}.end_date` as const,
                            )}
                        />
                        {`errors.awards.${index}.end_date.type` ===
                            'required' && (
                            <DisplayInputError message="errors.input_required" />
                        )}
                    </div>
                </div>

                {/* Separator  */}
                <div className="inline-flex w-full items-center justify-center">
                    <hr className="my-8 h-[0.15rem] w-full rounded border-0 bg-beer-foam dark:bg-gray-700" />
                </div>

                {/* Social Cause */}
                <div className="space-y flex w-full flex-col ">
                    <p className="mb-0-4 text-lg">
                        {t('does_the_campaign_belong_to_a_social_cause')}
                    </p>

                    <label className="mb-2 inline-flex items-center">
                        {t('social_cause')}
                    </label>

                    <select
                        {...register(
                            `campaigns.${index}.social_cause` as const,
                            {
                                required: true,
                            },
                        )}
                        onChange={(e) => handleSocialCauseClick(e)}
                        className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                    >
                        {(
                            Object.keys(SocialCauseExample) as Array<
                                keyof SocialCauseExample
                            >
                        ).map((option, index) => (
                            <option key={index} value={option.toString()}>
                                {option.toString().toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Campaign Discount  */}
                <div className="space-y flex w-full flex-col">
                    <label
                        htmlFor={`${index}-campaign_discount`}
                        className="mr-2 text-sm text-gray-600"
                    >
                        {t('campaign_discount')} (%)
                    </label>

                    <input
                        type="number"
                        id={`${index}-campaign_discount`}
                        className="rounded-md border border-gray-300"
                        defaultValue={0}
                        max={100}
                        min={0}
                        {...register(
                            `campaigns.${index}.campaign_discount` as const,
                        )}
                    />
                </div>

                {/* Separator  */}
                <div className="inline-flex w-full items-center justify-center">
                    <hr className="my-8 h-[0.15rem] w-full rounded border-0 bg-beer-foam dark:bg-gray-700" />
                </div>

                <div className="space-y mt-12 flex w-full flex-col">
                    <Button
                        class="w-[44vw] px-4 py-2 text-xl"
                        primary
                        onClick={() =>
                            handleShowProductsInCampaignModal(true, index)
                        }
                    >
                        {t('configure_products_in_campaign')}
                    </Button>
                </div>

                <div className="flex justify-between space-x-2">
                    <Button
                        class=""
                        large
                        primary
                        onClick={() => api_handleSaveCampaign(index)}
                    >
                        {t('save_form_campaign')}
                    </Button>

                    <DeleteButton
                        onClick={() => handleDeleteShowModal(true, index)}
                    />
                </div>
            </fieldset>
        </form>
    );
}
