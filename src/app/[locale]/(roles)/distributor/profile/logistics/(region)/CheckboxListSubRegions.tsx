import React from 'react';
import RegionRow from './RegionRow';
import PaginationFooter from '../../../../../components/common/PaginationFooter';
import { useTranslations } from 'next-intl';
import { ICoverageArea } from '../../../../../../../lib/types/types';
import { JSONRegion } from '../../../../../../../lib/types/distribution_areas';

interface Props {
    tenRegions: JSONRegion[];
    counter: number;
    resultsPerPage: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    selectedRegions: ICoverageArea[];
    handleCheckbox: (
        e: React.ChangeEvent<HTMLInputElement>,
        name: JSONRegion,
    ) => void;
    register: any;
    handleSelectAllCurrentPage: (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    selectAllCurrentPage: boolean;
}

const CheckboxListRegions = ({
    tenRegions,
    counter,
    resultsPerPage,
    currentPage,
    setCurrentPage,
    selectedRegions,
    handleCheckbox,
    register,
    handleSelectAllCurrentPage,
    selectAllCurrentPage,
}: Props) => {
    const t = useTranslations();

    return (
        <>
            {tenRegions && tenRegions.length > 0 && (
                <div className="w-full">
                    <PaginationFooter
                        counter={counter}
                        resultsPerPage={resultsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />

                    {/* <div className="">
                    <label
                        htmlFor="allRegionsByRegion"
                        className="space-x-2 text-lg text-gray-600"
                    >
                        <input
                            id="allRegionsByRegion"
                            type="checkbox"
                            onChange={(e) => {
                                handleSelectAllRegionsByRegion(e);
                            }}
                            checked={selectAllRegionsByRegion}
                            className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                        />

                        <span className="text-sm text-gray-600">
                            {t('select_all_regions')}
                        </span>
                    </label>
                </div> */}

                    <div className="w-full">
                        {/* Display selectable table with all regions in the country selected */}
                        <label
                            htmlFor="addressRegion"
                            className="text-sm text-gray-600"
                        >
                            {t('loc_region')}
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
                                        {t('region')}
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {tenRegions?.map(
                                    (region: JSONRegion, index: number) => {
                                        const startIndex =
                                            currentPage * resultsPerPage;
                                        const globalIndex = startIndex + index;

                                        return (
                                            <tr
                                                key={region.name + currentPage}
                                                className=""
                                            >
                                                <RegionRow
                                                    region={region}
                                                    globalIndex={globalIndex}
                                                    selectedRegions={
                                                        selectedRegions
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

export default CheckboxListRegions;
