'use client';

import { z, ZodType } from 'zod';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { IDistributorUser } from '@/lib//types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import InputLabel from '@/app/[locale]/components/form/InputLabel';
import InputTextarea from '@/app/[locale]/components/form/InputTextarea';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import ProfileSettingsContainer from '@/app/[locale]/components/ui/ProfileSettingsContainer';

type FormData = {
    company_history_year?: number;
    company_history_description?: string;
    company_vision?: string;
    company_mission?: string;
    company_values?: string;
};

const schema: ZodType<FormData> = z.object({
    company_history_year: z.number().optional(),
    company_history_description: z.string().optional(),
    company_vision: z.string().optional(),
    company_mission: z.string().optional(),
    company_values: z.string().optional(),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    profile: IDistributorUser;
}

export function CompanyHistoryForm({ profile }: Props) {
    const t = useTranslations();
    const successMessage = t('success.profile_history_data_updated');

    const { supabase } = useAuth();

    if (!profile || !profile.users) return <></>;

    const { handleMessage } = useMessage();

    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            company_history_year: profile.company_history_year,
            company_history_description: profile.company_history_description,
            company_vision: profile.company_vision,
            company_mission: profile.company_mission,
            company_values: profile.company_values,
        },
    });

    const { handleSubmit } = form;

    const handleUpdataHistoryData = async (form: ValidationSchema) => {
        const {
            company_history_year,
            company_history_description,
            company_vision,
            company_mission,
            company_values,
        } = form;

        const { error } = await supabase
            .from('distributor_user')
            .update({
                company_history_year,
                company_history_description,
                company_vision,
                company_mission,
                company_values,
            })
            .eq('user_id', profile.user_id);

        if (error) {
            handleMessage({
                type: 'error',
                message: error.message,
            });
            throw error;
        }

        handleMessage({
            type: 'success',
            message: successMessage,
        });
    };

    const handleUpdateBasicDataMutation = useMutation({
        mutationKey: ['updateHistoryDataDistributor'],
        mutationFn: handleUpdataHistoryData,
        onMutate: () => {
            setLoading(true);
        },
        onError: (error: Error) => {
            handleMessage({
                type: 'error',
                message: error.message,
            });
        },
        onSettled: () => {
            setLoading(false);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = async (
        formValues: FormData,
    ) => {
        try {
            handleUpdateBasicDataMutation.mutate(formValues);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ProfileSettingsContainer sectionId="account_distributor_data">
            <div>
                <Title size="large" color="black">
                    {t('history_title_acc_data')}
                </Title>

                <Label className="block text-sm sm:text-base h-[auto]">
                    <i>{t('company_history_description_descriptive')}</i>
                </Label>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative space-y-2"
            >
                <div className="block sm:flex w-full sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <InputLabel
                        form={form}
                        inputType={'number'}
                        label={'company_history_year'}
                        registerOptions={{
                            valueAsNumber: true,
                            min: 1900,
                        }}
                        placeholder={'1994'}
                    />
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-3 sm:col-span-1">
                        <InputTextarea
                            form={form}
                            label={'company_vision'}
                            placeholder={t('profile_acc_vision_placeholder')}
                        />
                    </div>

                    <div className="col-span-3 sm:col-span-1">
                        <InputTextarea
                            form={form}
                            label={'company_mission'}
                            placeholder={t('profile_acc_mission_placeholder')}
                        />
                    </div>

                    <div className="col-span-3 sm:col-span-1">
                        <InputTextarea
                            form={form}
                            label={'company_values'}
                            placeholder={t('profile_acc_values_placeholder')}
                        />
                    </div>
                </div>

                <div className="block sm:flex w-full sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <InputTextarea
                        form={form}
                        label={'company_history_description'}
                        registerOptions={{}}
                        placeholder={
                            'Redacta acerca de la historia de la empresa'
                        }
                    />
                </div>

                {loading && (
                    <Spinner
                        color="beer-blonde"
                        size={'xLarge'}
                        absolute
                        absolutePosition="center"
                    />
                )}

                <Button primary medium btnType={'submit'} disabled={loading}>
                    {t('save')}
                </Button>
            </form>
        </ProfileSettingsContainer>
    );
}
