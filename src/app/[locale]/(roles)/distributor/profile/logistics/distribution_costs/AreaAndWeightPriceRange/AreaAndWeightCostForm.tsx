'use client';

import Error from 'next/error';
import Button from '../../../../../../components/common/Button';
import React, { useEffect, useState } from 'react';
import { z, ZodType } from 'zod';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMessage } from '../../../../../../components/message/useMessage';
import {
    FlatrateAndWeightCostFormData,
    IFlatrateAndWeightCost,
} from '../../../../../../../../lib/types/types';
import FlatrateAndWeightCostTable from '../FlatrateAndWeight/FlatrateAndWeightCostTable';
import FlatrateAndWeightCostFormRow from '../FlatrateAndWeight/FlatrateAndWeightCostFormRow';
import { updateFlatrateAndWeightShippingCost } from '../../../../actions';
import { DisplayInputError } from '../../../../../../components/common/DisplayInputError';
import AreaAndWeightRangeForm from './AreaAndWeightRangeForm';
import AreaSidebar from './AreaSidebar';

const rangeObjectSchema = z
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

const schema: ZodType<FlatrateAndWeightCostFormData> = z.object({
    distribution_costs_id: z.string().uuid(),
    cost_extra_per_kg: z
        .number()
        .min(0, { message: 'errors.input_number_min_0' }),
    weight_range_cost: z
        .array(rangeObjectSchema)
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

export type WeightRangeCostFormValidationSchema = z.infer<typeof schema>;

interface Props {
    extraCostPerKG: number;
    flatrateAndWeightCost?: IFlatrateAndWeightCost[];
    distributionCostId: string;
}

/* Tarifa de envío por rango de coste del pedido */
const AreaAndWeightCostFormData = ({
    extraCostPerKG,
    flatrateAndWeightCost,
    distributionCostId,
}: Props) => {
    const [selectedArea, setSelectedArea] = useState('');

    console.log(flatrateAndWeightCost);

    // Supongamos que `areas` es la lista de áreas que obtuviste de la base de datos
    const areas = ['Madrid', 'Barcelona' /* ... */];

    return (
        <div>
            <AreaSidebar items={areas} onItemClick={setSelectedArea} />
            {/* {selectedArea && (
                <AreaAndWeightRangeForm
                    area={selectedArea}
                    flatrateAndWeightCost={flatrateAndWeightCost}
                    distributionCostId={distributionCostId}
                />
            )} */}
        </div>
    );
};

export default AreaAndWeightCostFormData;
