'use client';

import AreaSidebar from './AreaSidebar';
import React, { useState } from 'react';
import { z, ZodType } from 'zod';
import {
    AreaAndWeightCostFormData,
    IAreaAndWeightCost,
} from '../../../../../../../../lib/types/types';
import AreaAndWeightRangeForm from './AreaAndWeightRangeForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const areaWeightCostRange = z
    .object({
        weight_from: z
            .number()
            .min(0, { message: 'errors.input_number_min_0' }),
        weight_to: z.number().min(0, { message: 'errors.input_number_min_0' }),
        base_cost: z.number().min(0, { message: 'errors.input_number_min_0' }),
    })
    .refine((data) => data.weight_from < data.weight_to, {
        message: 'errors.lower_greater_than_upper',
        path: ['weight_from'],
    });

const areaAndWeightInformationObjectSchema = z.object({
    name: z.string().nonempty({ message: 'errors.input_required' }),
    type: z.string().nonempty({ message: 'errors.input_required' }),
    area_weight_range: z
        .array(areaWeightCostRange)
        .refine(
            (ranges) => ranges.length === 0 || ranges[0].weight_from === 0,
            {
                message: 'errors.must_start_from_zero',
            },
        )
        .refine(
            (ranges) => {
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
    provinces: z.array(areaAndWeightInformationObjectSchema),
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
}

/* Tarifa de envío por rango de coste del pedido */
const AreaAndWeightCostForm = ({
    extraCostPerKG,
    areaAndWeightCost,
    distributionCostId,
}: Props) => {
    const [selectedArea, setSelectedArea] = useState<{
        id: string;
        name: string;
        type: string;
        area_and_weight_cost_id: string;
    }>();

    const form = useForm<AreaAndWeightCostFormValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            distribution_costs_id: distributionCostId,
            cities:
                areaAndWeightCost?.area_and_weight_information?.filter(
                    (area) => area.type === 'city',
                ) || [],
            provinces:
                areaAndWeightCost?.area_and_weight_information?.filter(
                    (area) => area.type === 'province',
                ) || [],
            regions:
                areaAndWeightCost?.area_and_weight_information?.filter(
                    (area) => area.type === 'region',
                ) || [],
            international:
                areaAndWeightCost?.area_and_weight_information?.filter(
                    (area) => area.type === 'international',
                ) || [],
        },
    });

    const onItemClick = (area: {
        id: string;
        name: string;
        type: string;
        area_and_weight_cost_id: string;
    }) => {
        setSelectedArea(area);
    };

    return (
        <section className="relative">
            <AreaSidebar form={form} onItemClick={onItemClick} />

            {selectedArea && (
                <fieldset className="space-y-6 p-6 rounded-lg border border-gray-300 bg-white shadow-sm max-w-3xl mx-auto">
                    <AreaAndWeightRangeForm
                        selectedArea={selectedArea}
                        // flatrateAndWeightCost={flatrateAndWeightCost}
                        distributionCostId={distributionCostId}
                    />
                </fieldset>
            )}
        </section>
    );
};

export default AreaAndWeightCostForm;
