'use client';

import AreaSidebar from './AreaSidebar';
import AreaAndWeightRangeForm from './AreaAndWeightRangeForm';
import SelectDistributionCost from '../SelectDistributionCost';
import Button from '@/app/[locale]/components/common/Button';
import InputLabel from '@/app/[locale]/components/common/InputLabel';
import React, { useEffect, useState } from 'react';
import { z, ZodType } from 'zod';
import {
    AreaAndWeightCostFormData,
    IAreaAndWeightCost,
    IAreaAndWeightInformation,
    IDistributionCost,
} from '@/lib/types/types';
import { DistributionCostType, DistributionDestinationType } from '@/lib/enums';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { DisplayInputError } from '@/app/[locale]/components/common/DisplayInputError';

const areaWeightCostRange = z
    .object({
        weight_from: z
            .number()
            .min(0, { message: 'errors.input_number_min_0' }),
        weight_to: z.number().min(0, { message: 'errors.input_number_min_0' }),
        base_cost: z.number().min(0, { message: 'errors.input_number_min_0' }),
        area_and_weight_information_id: z.string().uuid(),
    })
    .refine((data) => data.weight_from < data.weight_to, {
        message: 'errors.lower_greater_than_upper',
        path: ['weight_from'],
    });

const areaAndWeightInformationObjectSchema = z.object({
    area_weight_range: z
        .array(areaWeightCostRange)
        .refine(
            (ranges) =>
                ranges.length === 0 ||
                ranges.some((range) => range.weight_from === 0),
            {
                message: 'errors.must_start_from_zero',
            },
        )
        .refine(
            (ranges) => {
                if (ranges.length === 0) return true;

                // Ordenar los rangos por `weight_from` para facilitar la verificación
                ranges.sort((a, b) => a.weight_from - b.weight_from);

                for (let i = 1; i < ranges.length; i++) {
                    if (ranges[i - 1].weight_to !== ranges[i].weight_from) {
                        return false;
                    }
                }
                return true;
            },
            {
                message: 'errors.ranges_not_continuous',
            },
        ),
});

const schema: ZodType<AreaAndWeightCostFormData> = z.object({
    cost_extra_per_kg: z
        .number()
        .min(0, { message: 'errors.input_number_min_0' }),
    distribution_costs_id: z.string().uuid(),
    cities: z.array(areaAndWeightInformationObjectSchema),
    sub_regions: z.array(areaAndWeightInformationObjectSchema),
    regions: z.array(areaAndWeightInformationObjectSchema),
    international: z.array(areaAndWeightInformationObjectSchema),
});

export type AreaAndWeightInformationSchema = z.infer<
    typeof areaAndWeightInformationObjectSchema
>;
export type AreaAndWeightCostFormValidationSchema = z.infer<typeof schema>;

interface Props {
    extraCostPerKG: number;
    distributionCosts: IDistributionCost;
    distributionCostId: string;
    fromDBDistributionType: string;
}

/* Tarifa de envío por rango de coste del pedido */
const AreaAndWeightCostForm = ({
    extraCostPerKG,
    distributionCosts,
    distributionCostId,
    fromDBDistributionType,
}: Props) => {
    const t = useTranslations();

    const [selectedArea, setSelectedArea] =
        useState<IAreaAndWeightInformation>();

    const [areaWeightInformationSubRegion, setAreaWeightInformationSubRegion] =
        useState<IAreaAndWeightInformation[]>(
            distributionCosts.area_and_weight_cost
                ?.area_and_weight_information || [],
        );

    useEffect(() => {
        if (distributionCosts) {
            setAreaWeightInformationSubRegion(
                distributionCosts.area_and_weight_cost
                    ?.area_and_weight_information || [],
            );
        }

        return () => {};
    }, [distributionCosts]);

    const form = useForm<AreaAndWeightCostFormValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            cost_extra_per_kg: extraCostPerKG,
            distribution_costs_id: distributionCostId,
            // cities:
            //     areaAndWeightCost?.area_and_weight_information?.filter(
            //         (area) => area.type === DistributionDestinationType.CITY,
            //     ) || [],
            sub_regions: areaWeightInformationSubRegion
                .filter(
                    (item) =>
                        item.coverage_areas?.administrative_division ===
                        DistributionDestinationType.SUB_REGION,
                )
                .map((area: IAreaAndWeightInformation) => ({
                    id: area.id,
                    name: area.coverage_areas?.sub_region,
                    type: DistributionDestinationType.SUB_REGION,
                })),
            regions: areaWeightInformationSubRegion
                .filter(
                    (item) =>
                        item.coverage_areas?.administrative_division ===
                        DistributionDestinationType.REGION,
                )
                .map((area: IAreaAndWeightInformation) => ({
                    id: area.id,
                    name: area.coverage_areas?.region,
                    type: DistributionDestinationType.REGION,
                })),
            // international:
            //     areaAndWeightCost?.area_and_weight_information?.filter(
            //         (area) =>
            //             area.type === DistributionDestinationType.INTERNATIONAL,
            //     ) || [],
        },
    });

    const {
        formState: { errors },
    } = form;

    const onItemClick = (areaId: string) => {
        const area = areaWeightInformationSubRegion.find(
            (area) => area.id === areaId,
        );

        setSelectedArea(area);
    };

    return (
        <section
            className={`flex flex-col items-start space-y-4 rounded-xl border 
            border-beer-softBlondeBubble border-b-gray-200 bg-beer-foam p-4
        `}
        >
            <SelectDistributionCost
                distributionCostsId={distributionCostId}
                fromDBDistributionType={fromDBDistributionType}
                distributionType={DistributionCostType.AREA_AND_WEIGHT}
            />

            <span className="pb-4">
                <strong>Área y peso:</strong> Configura tus costes de
                distribución en base a las áreas de cobertura seleccionadas en
                la sección "ÁREA DE COBERTURAS" y sus respectivos rangos de peso
                por zona (ciudad, provincia, región o país) para asignar un
                coste base por rango de peso.
            </span>

            <span className="pb-4">
                Además, debes de indicar cual es la tarifa adicional por
                kilogramo que se aplicará a los envíos que superen el rango de
                peso establecido.
            </span>

            <section className="relative flex flex-col gap-4 w-full">
                <form onSubmit={form.handleSubmit((data) => console.log(data))}>
                    <div className="flex flex-row gap-4">
                        <InputLabel
                            form={form}
                            label={'cost_extra_per_kg'}
                            labelText={'cost_extra_per_kg'}
                            registerOptions={{
                                required: true,
                                min: 0,
                            }}
                            inputType="number"
                        />

                        {errors.cost_extra_per_kg && (
                            <DisplayInputError message="errors.input_required" />
                        )}

                        <Button accent small>
                            {t('save')}
                        </Button>
                    </div>
                </form>

                <AreaSidebar form={form} onItemClick={onItemClick} />

                {selectedArea && (
                    <fieldset className="space-y-6 p-6 rounded-lg border border-gray-300 bg-white shadow-sm max-w-3xl mx-auto">
                        <AreaAndWeightRangeForm selectedArea={selectedArea} />
                    </fieldset>
                )}
            </section>
        </section>
    );
};

export default AreaAndWeightCostForm;
