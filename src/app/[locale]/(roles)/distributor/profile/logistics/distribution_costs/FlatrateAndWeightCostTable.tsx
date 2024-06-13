import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
    flatrateRanges: {
        weight_from: number;
        weight_to: number;
        base_cost: number;
        extra_cost_per_kg: number;
    }[];
}

export default function FlatrateAndWeightCostTable({ flatrateRanges }: Props) {
    const t = useTranslations();

    return (
        <table className="min-w-full my-8 border-2 border-beer-softBlondeBubble bg-beer-foam p-4">
            {/* Minimalistic and simple table displaying all the ranges and costs. Información obtenida del array registrado en "distribution_range_cost*/}

            <thead>
                <tr>
                    <th className="border-b-2 border-gray-300 px-6 py-3 text-center leading-4 tracking-wider text-beer-draft">
                        {t('flatrate_weight_from')}
                    </th>
                    <th className="border-b-2 border-gray-300 px-6 py-3 text-center leading-4 tracking-wider text-beer-draft">
                        {t('flatrate_weight_to')}
                    </th>
                    <th className="border-b-2 border-gray-300 px-6 py-3 text-center leading-4 tracking-wider text-beer-draft">
                        {t('flatrate_base_cost')}
                    </th>
                    <th className="border-b-2 border-gray-300 px-6 py-3 text-center leading-4 tracking-wider text-beer-draft">
                        {t('flatrate_extra_cost_per_kg')}
                    </th>
                </tr>
            </thead>

            <tbody>
                {flatrateRanges.map((range, index) => (
                    <tr key={index}>
                        <td className="whitespace-no-wrap text-center border-b border-gray-500 px-6 py-4">
                            {range.weight_from} Kg
                        </td>
                        <td className="whitespace-no-wrap text-center border-b border-gray-500 px-6 py-4">
                            {range.weight_to} Kg
                        </td>
                        <td className="whitespace-no-wrap text-center border-b border-gray-500 px-6 py-4">
                            {range.base_cost} €
                        </td>
                        <td className="whitespace-no-wrap text-center border-b border-gray-500 px-6 py-4">
                            {range.extra_cost_per_kg} €
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
