import React from 'react';
import { useTranslations } from 'next-intl';
import { ICoverageArea } from '../../../../../../../lib/types/types';

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
                            </tr>
                        </thead>
                        <tbody>
                            {regionArray.map((area) => (
                                <tr key={`${area.country}`}>
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
                                            {area.regions}
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

export default RegionTable;
