import TD from '@/app/[locale]/components/ui/table/TD';
import TH from '@/app/[locale]/components/ui/table/TH';
import TR from '@/app/[locale]/components/ui/table/TR';
import THead from '@/app/[locale]/components/ui/table/THead';
import Table from '@/app/[locale]/components/ui/table/Table';
import TBody from '@/app/[locale]/components/ui/table/TBody';
import React from 'react';
import { useTranslations } from 'next-intl';

interface Props {
    flatrateRanges: {
        weight_from: number;
        weight_to: number;
        base_cost: number;
    }[];
}

export default function FlatrateAndWeightCostTable({ flatrateRanges }: Props) {
    const t = useTranslations();

    return (
        <Table class_="min-w-full my-8 border-2 border-beer-softBlondeBubble bg-beer-foam">
            <THead>
                <TR>
                    <TH class_="border-b-2 border-gray-300 text-center leading-4 tracking-wider text-beer-draft">
                        {t('flatrate_weight_from')}
                    </TH>
                    <TH class_="border-b-2 border-gray-300 text-center leading-4 tracking-wider text-beer-draft">
                        {t('flatrate_weight_to')}
                    </TH>
                    <TH class_="border-b-2 border-gray-300 text-center leading-4 tracking-wider text-beer-draft">
                        {t('flatrate_base_cost')}
                    </TH>
                </TR>
            </THead>

            <TBody>
                {flatrateRanges.map((range, index) => (
                    <TR key={index}>
                        <TD class_="whitespace-no-wrap text-center border-b border-gray-500">
                            {range.weight_from} Kg
                        </TD>
                        <TD class_="whitespace-no-wrap text-center border-b border-gray-500">
                            {range.weight_to} Kg
                        </TD>
                        <TD class_="whitespace-no-wrap text-center border-b border-gray-500">
                            {range.base_cost} €
                        </TD>
                    </TR>
                ))}
            </TBody>
        </Table>
    );
}
