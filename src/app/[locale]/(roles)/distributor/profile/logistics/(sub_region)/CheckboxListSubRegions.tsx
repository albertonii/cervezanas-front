import React from 'react';
import SubRegionRow from './SubRegionRow';
import PaginationFooter from '@/app/[locale]/components/common/PaginationFooter';
import { useTranslations } from 'next-intl';
import { ICoverageArea } from '@/lib/types/types';
import { JSONSubRegion } from '@/lib/types/distribution_areas';

interface Props {
    tenSubRegions: JSONSubRegion[];
    counter: number;
    resultsPerPage: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    selectedSubRegions: ICoverageArea[];
    handleCheckbox: (
        e: React.ChangeEvent<HTMLInputElement>,
        name: JSONSubRegion,
    ) => void;
    register: any;
    handleSelectAllCurrentPage: (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    selectAllCurrentPage: boolean;
}

const CheckboxListSubRegions = ({
    tenSubRegions,
    counter,
    resultsPerPage,
    currentPage,
    setCurrentPage,
    selectedSubRegions,
    handleCheckbox,
    register,
    handleSelectAllCurrentPage,
    selectAllCurrentPage,
}: Props) => {
    const t = useTranslations();

    return (
        <>
            {tenSubRegions && tenSubRegions.length > 0 && (
                <div className="w-full">
                    <PaginationFooter
                        counter={counter}
                        resultsPerPage={resultsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />

                    {/* <div className="">
                    <label
                        htmlFor="allSubRegionsByRegion"
                        className="space-x-2 text-lg text-gray-600"
                    >
                        <input
                            id="allSubRegionsByRegion"
                            type="checkbox"
                            onChange={(e) => {
                                handleSelectAllSubRegionsByRegion(e);
                            }}
                            checked={selectAllSubRegionsByRegion}
                            className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                        />

                        <span className="text-sm text-gray-600">
                            {t('select_all_sub_regions')}
                        </span>
                    </label>
                </div> */}

                    <div className="w-full">
                        {/* Display selectable table with all sub_regions in the country selected */}
                        <label
                            htmlFor="addressSubRegion"
                            className="text-sm text-gray-600"
                        >
                            {t('loc_sub_region')}
                        </label>

                        <table className="bg-beer-foam w-full text-center text-sm text-gray-500 dark:text-gray-400 ">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {
                                                handleSelectAllCurrentPage(e);
                                            }}
                                            checked={selectAllCurrentPage}
                                            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                                        />
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        {t('sub_region')}
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {tenSubRegions?.map(
                                    (
                                        sub_region: JSONSubRegion,
                                        index: number,
                                    ) => {
                                        const startIndex =
                                            currentPage * resultsPerPage;
                                        const globalIndex = startIndex + index;

                                        return (
                                            <tr
                                                key={
                                                    sub_region.name +
                                                    currentPage
                                                }
                                                className=""
                                            >
                                                <SubRegionRow
                                                    sub_region={sub_region}
                                                    globalIndex={globalIndex}
                                                    selectedSubRegions={
                                                        selectedSubRegions
                                                    }
                                                    handleCheckbox={
                                                        handleCheckbox
                                                    }
                                                    register={register}
                                                />
                                            </tr>
                                        );
                                    },
                                )}
                            </tbody>
                        </table>

                        <PaginationFooter
                            counter={counter}
                            resultsPerPage={resultsPerPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default CheckboxListSubRegions;
