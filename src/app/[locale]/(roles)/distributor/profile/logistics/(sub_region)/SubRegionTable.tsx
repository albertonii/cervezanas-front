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
    subRegions: ICoverageArea[];
}

const SubRegionTable = ({ subRegions }: Props) => {
    const t = useTranslations();

    const regions = subRegions.reduce(
        (
            acc: Record<
                string,
                { country: string; region: string; sub_regions: string[] }
            >,
            subRegion: ICoverageArea,
        ) => {
            const { country, region, sub_region } = subRegion;
            const key = `${country}-${region}`;
            if (!acc[key]) {
                acc[key] = {
                    country,
                    region,
                    sub_regions: [],
                };
            }

            if (sub_region !== null && sub_region !== undefined)
                acc[key].sub_regions.push(sub_region);
            return acc;
        },
        {},
    );

    const subRegionArray = Object.values(regions);

    return (
        <div className="flex flex-col items-center w-full max-h-[42vh] inline-block min-w-full shadow-md rounded-lg overflow-hidden">
            <Table class_="min-w-full leading-normal">
                <THead>
                    <TR>
                        <TH
                            class_="border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                            colSpan={3}
                        >
                            {t('country')}
                        </TH>
                        <TH class_="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {t('region')}
                        </TH>
                        <TH class_="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {t('sub_region')}
                        </TH>
                    </TR>
                </THead>
                <TBody>
                    {subRegionArray.map((area) => (
                        <TR key={`${area.country}-${area.region}`}>
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
                                    {area.region}
                                </p>
                            </TD>

                            <TD class_="border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">
                                    {area.sub_regions.join(', ')}
                                </p>
                            </TD>
                        </TR>
                    ))}
                </TBody>
            </Table>
        </div>
    );
};

export default SubRegionTable;
