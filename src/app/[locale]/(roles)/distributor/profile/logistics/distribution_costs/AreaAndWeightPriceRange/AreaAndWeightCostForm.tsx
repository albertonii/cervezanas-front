'use client';

import AreaSidebar from './AreaSidebar';
import React, { useState } from 'react';
import { z, ZodType } from 'zod';
import {
    AreaAndWeightCostFormData,
    IAreaAndWeightCost,
    IAreaAndWeightInformation_,
} from '../../../../../../../../lib/types/types';
import AreaAndWeightRangeForm from './AreaAndWeightRangeForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SelectDistributionCost from '../SelectDistributionCost';
import {
    DistributionCostType,
    DistributionDestinationType,
} from '../../../../../../../../lib/enums';

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
    // name: z.string().nonempty({ message: 'errors.input_required' }),
    // type: z.string().nonempty({ message: 'errors.input_required' }),
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
    areaAndWeightCost?: IAreaAndWeightCost;
    distributionCostId: string;
    fromDBDistributionType: string;
}

/* Tarifa de envío por rango de coste del pedido */
const AreaAndWeightCostForm = ({
    extraCostPerKG,
    areaAndWeightCost,
    distributionCostId,
    fromDBDistributionType,
}: Props) => {
    const [selectedArea, setSelectedArea] =
        useState<IAreaAndWeightInformation_>();

    const areaWeightInformationSubRegion: IAreaAndWeightInformation_[] =
        areaAndWeightCost?.area_and_weight_information_ || [];

    const form = useForm<AreaAndWeightCostFormValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            distribution_costs_id: distributionCostId,
            // cities:
            //     areaAndWeightCost?.area_and_weight_information?.filter(
            //         (area) => area.type === DistributionDestinationType.CITY,
            //     ) || [],
            sub_regions: areaWeightInformationSubRegion.map(
                (area: IAreaAndWeightInformation_) => ({
                    id: area.id,
                    name: area.coverage_areas?.sub_region,
                    type: DistributionDestinationType.SUB_REGION,
                }),
            ),
            // regions:
            //     areaAndWeightCost?.area_and_weight_information?.filter(
            //         (area) => area.type === DistributionDestinationType.REGION,
            //     ) || [],
            // international:
            //     areaAndWeightCost?.area_and_weight_information?.filter(
            //         (area) =>
            //             area.type === DistributionDestinationType.INTERNATIONAL,
            //     ) || [],
        },
    });

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

            <section className="relative flex gap-4">
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
