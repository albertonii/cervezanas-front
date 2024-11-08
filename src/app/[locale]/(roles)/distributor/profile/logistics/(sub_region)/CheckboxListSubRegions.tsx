import React from 'react';
import SubRegionRow from './SubRegionRow';
import { useTranslations } from 'next-intl';
import { ICoverageArea } from '@/lib/types/types';
import { JSONSubRegion } from '@/lib/types/distribution_areas';
import PaginationFooter from '@/app/[locale]/components/ui/PaginationFooter';
import THead from '@/app/[locale]/components/ui/table/THead';
import Table from '@/app/[locale]/components/ui/table/Table';
import Label from '@/app/[locale]/components/ui/Label';
import TR from '@/app/[locale]/components/ui/table/TR';
import TH from '@/app/[locale]/components/ui/table/TH';
import TBody from '@/app/[locale]/components/ui/table/TBody';

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
                        <Label htmlFor="addressSubRegion">
                            {t('loc_sub_region')}
                        </Label>

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

                                    <TH scope="col">{t('sub_region')}</TH>
                                </TR>
                            </THead>

                            <TBody>
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

export default CheckboxListSubRegions;
