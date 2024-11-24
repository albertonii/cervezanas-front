import React from 'react';
import { useTranslations } from 'next-intl';
import { ICoverageArea } from '@/lib/types/types';
import Table from '@/app/[locale]/components/ui/table/Table';
import THead from '@/app/[locale]/components/ui/table/THead';
import TR from '@/app/[locale]/components/ui/table/TR';
import TH from '@/app/[locale]/components/ui/table/TH';
import TBody from '@/app/[locale]/components/ui/table/TBody';
import TD from '@/app/[locale]/components/ui/table/TD';

interface Props {
    regions: ICoverageArea[];
}

const RegionTable = ({ regions }: Props) => {
    const t = useTranslations();

    const reducedRegions = regions.reduce(
        (
            acc: Record<string, { country: string; regions: string[] }>,
            coverageArea: ICoverageArea,
        ) => {
            const { country, region } = coverageArea;
            const key = `${country}-${region}`;
            if (!acc[key]) {
                acc[key] = {
                    country,
                    regions: [],
                };
            }

            if (region !== null && region !== undefined)
                acc[key].regions.push(region);
            return acc;
        },
        {},
    );

    const regionArray = Object.values(reducedRegions);

    return (
        <div className="flex flex-col items-center w-full max-h-[42vh] overflow-x-auto w-full inline-block min-w-full shadow-md rounded-lg overflow-hidden">
            <Table class_="min-w-full leading-normal">
                <THead>
                    <TR>
                        <TH
                            class_="border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                            colSpan={3}
                        >
                            {t('country')}
                        </TH>
                        <TH class_="border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {t('region')}
                        </TH>
                    </TR>
                </THead>
                <TBody>
                    {regionArray.map((area, index) => (
                        <TR key={`${area.country + index} `}>
                            <TD
                                class_="border-b border-gray-200 bg-white text-sm"
                                colSpan={3}
                            >
                                <p className="text-gray-900 whitespace-no-wrap">
                                    {`${t('countries.' + area.country)}`}
                                </p>
                            </TD>

                            <TD class_="border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">
                                    {area.regions}
                                </p>
                            </TD>
                        </TR>
                    ))}
                </TBody>
            </Table>
        </div>
    );
};

export default RegionTable;
