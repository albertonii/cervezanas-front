import React from 'react';
import { useTranslations } from 'next-intl';
import { ICoverageArea } from '../../../../../../../lib/types/types';

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
        <div className="flex flex-col items-center w-full max-h-[42vh]">
            <div className="overflow-x-auto w-full">
                <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="">
                                <th
                                    className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                    colSpan={3}
                                >
                                    {t('country')}
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    {t('region')}
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    {t('sub_region')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {subRegionArray.map((area) => (
                                <tr key={`${area.country}-${area.region}`}>
                                    <td
                                        className="px-5 py-3 border-b border-gray-200 bg-white text-sm"
                                        colSpan={3}
                                    >
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            {`${t(
                                                'countries.' + area.country,
                                            )}`}
                                        </p>
                                    </td>

                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            {area.region}
                                        </p>
                                    </td>

                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            {area.sub_regions.join(', ')}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubRegionTable;
