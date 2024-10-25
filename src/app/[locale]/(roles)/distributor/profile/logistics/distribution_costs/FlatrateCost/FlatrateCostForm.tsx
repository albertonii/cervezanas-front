'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { FlatrateCostFormData, IFlatrateCost } from '@/lib/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'react-query';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import Error from 'next/error';
import { useAuth } from '../../../../../../(auth)/Context/useAuth';
import InputLabel from '@/app/[locale]/components/form/InputLabel';
import Button from '@/app/[locale]/components/ui/buttons/Button';

const schema: ZodType<FlatrateCostFormData> = z.object({
    local_distribution_cost: z.number().min(0),
    national_distribution_cost: z.number().min(0),
    europe_distribution_cost: z.number().min(0),
    international_distribution_cost: z.number().min(0),
    is_checked_local: z.boolean().optional(),
    is_checked_national: z.boolean().optional(),
    is_checked_europe: z.boolean().optional(),
    is_checked_international: z.boolean().optional(),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    flatrateCost?: IFlatrateCost;
    distributionCostId: string;
}

/* Tarifa de envío por rango de coste del pedido */
const FlatrateCostForm = ({ flatrateCost, distributionCostId }: Props) => {
    const t = useTranslations();
    const { handleMessage } = useMessage();
    const submitSuccessMessage = t('messages.updated_successfully');
    const submitErrorMessage = t('messages.submit_error');
    const { supabase } = useAuth();

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            local_distribution_cost: flatrateCost?.local_distribution_cost ?? 0,
            national_distribution_cost:
                flatrateCost?.national_distribution_cost ?? 0,
            europe_distribution_cost:
                flatrateCost?.europe_distribution_cost ?? 0,
            international_distribution_cost:
                flatrateCost?.international_distribution_cost ?? 0,
        },
    });

    const { handleSubmit } = form;

    const handleUpdateFlatrateCost = async (form: ValidationSchema) => {
        const {
            local_distribution_cost,
            national_distribution_cost,
            europe_distribution_cost,
            international_distribution_cost,
            is_checked_local,
            is_checked_national,
            is_checked_europe,
            is_checked_international,
        } = form;

        const flatrateCost = {
            local_distribution_cost,
            national_distribution_cost,
            europe_distribution_cost,
            international_distribution_cost,
            is_checked_local,
            is_checked_national,
            is_checked_europe,
            is_checked_international,
            distribution_costs_id: distributionCostId,
        };

        const { error } = await supabase
            .from('flatrate_cost')
            .upsert(flatrateCost);

        if (error) {
            handleMessage({
                type: 'error',
                message: submitErrorMessage,
            });
            throw error;
        }

        handleMessage({
            type: 'success',
            message: submitSuccessMessage,
        });
    };

    const handleUpdateFlatrateCostMutation = useMutation({
        mutationKey: 'updateFlatrateCost',
        mutationFn: handleUpdateFlatrateCost,
        onSuccess: () => {
            console.info('Flatrate cost updated successfully');
        },
        onError: (error: Error) => {
            console.error(error);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: FlatrateCostFormData,
    ) => {
        try {
            handleUpdateFlatrateCostMutation.mutate(formValues);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className="flex flex-col items-start space-y-4 rounded-xl border border-beer-softBlondeBubble border-b-gray-200 bg-beer-foam py-4 px-1 sm:px-4 max-w-full">
            <span className="pb-4">
                <strong>Tarifa Plana:</strong> Precio único para cualquier tipo
                de envío, sin tener en cuenta el peso del paquete.
            </span>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid w-full grid-cols-2 gap-4"
            >
                <Button
                    btnType="submit"
                    onClick={handleSubmit(onSubmit)}
                    class="col-span-2 w-24"
                    primary
                    medium
                >
                    {t('save')}
                </Button>

                <fieldset className="mr-2 flex gap-4 rounded-xl border p-2">
                    <legend className=" text-gray-600">
                        {t('cities_distribution_cost')}
                    </legend>

                    <InputLabel
                        form={form}
                        label={'cities_distribution_cost'}
                        labelText={`${'cities_distribution_cost'} (€) `}
                        registerOptions={{
                            required: true,
                            valueAsNumber: true,
                        }}
                        placeholder={'0'}
                        inputType="number"
                    />
                </fieldset>

                <fieldset className="mr-2 flex gap-4 rounded-xl border p-2">
                    <legend className=" text-gray-600">
                        {t('sub_regions_distribution_cost')}
                    </legend>

                    <InputLabel
                        form={form}
                        label={'sub_regions_distribution_cost'}
                        labelText={`${'sub_regions_distribution_cost'} (€) `}
                        registerOptions={{
                            required: true,
                            valueAsNumber: true,
                        }}
                        placeholder={'0'}
                        inputType="number"
                    />
                </fieldset>

                <fieldset className="mr-2 flex gap-4 rounded-xl border p-2">
                    <legend className=" text-gray-600">
                        {t('regions_distribution_cost') + ' (€)'}
                    </legend>

                    <InputLabel
                        form={form}
                        label={'regions_distribution_cost'}
                        labelText={`${'regions_distribution_cost'} (€) `}
                        registerOptions={{
                            required: true,
                            valueAsNumber: true,
                        }}
                        placeholder={'0'}
                        inputType="number"
                    />
                </fieldset>

                <fieldset className="mr-2 flex gap-4 rounded-xl border p-2">
                    <legend className=" text-gray-600">
                        {t('country_distribution_cost') + ' (€)'}
                    </legend>

                    <InputLabel
                        form={form}
                        label={'country_distribution_cost'}
                        labelText={`${'country_distribution_cost'} (€) `}
                        registerOptions={{
                            required: true,
                            valueAsNumber: true,
                        }}
                        placeholder={'0'}
                        inputType="number"
                    />
                </fieldset>
            </form>
        </section>
    );
};

export default FlatrateCostForm;
