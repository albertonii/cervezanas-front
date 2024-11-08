import React from 'react';
import RegionRow from './RegionRow';
import { useTranslations } from 'next-intl';
import { ICoverageArea } from '@/lib/types/types';
import { JSONRegion } from '@/lib/types/distribution_areas';
import PaginationFooter from '@/app/[locale]/components/ui/PaginationFooter';
import Table from '@/app/[locale]/components/ui/table/Table';
import THead from '@/app/[locale]/components/ui/table/THead';
import TR from '@/app/[locale]/components/ui/table/TR';
import TH from '@/app/[locale]/components/ui/table/TH';
import TBody from '@/app/[locale]/components/ui/table/TBody';

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

                        <Table>
                            <THead>
                                <TR>
                                    <TH scope="col">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {
                                                handleSelectAllCurrentPage(e);
                                            }}
                                            checked={selectAllCurrentPage}
                                            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                                        />
                                    </TH>

                                    <TH scope="col">{t('region')}</TH>
                                </TR>
                            </THead>

                            <TBody>
                                {tenRegions?.map(
                                    (region: JSONRegion, index: number) => {
                                        const startIndex =
                                            currentPage * resultsPerPage;
                                        const globalIndex = startIndex + index;

                                        return (
                                            <TR key={region.name + currentPage}>
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
                                            </TR>
                                        );
                                    },
                                )}
                            </TBody>
                        </Table>

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
