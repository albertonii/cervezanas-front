import useFetchStatesByCountry from '../useFetchStatesByCountry';
import PaginationFooter from '../../../../../components/common/PaginationFooter';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from 'react-query';
import { useForm, UseFormRegister } from 'react-hook-form';
import { Country, ICountry, IState } from 'country-state-city';
import Button from '../../../../../components/common/Button';
import {
    filterSearchInputQuery,
    slicePaginationResults,
} from '../../../../../../../utils/utils';
import InputSearch from '../../../../../components/common/InputSearch';
import DistributionChipCard from '../DistributionChipCard';
import Spinner from '../../../../../components/common/Spinner';
import { updateSubRegionDistribution } from '../../../actions';
import { IDistributionCost } from '../../../../../../../lib/types/types';
import { useMessage } from '../../../../../components/message/useMessage';

interface FormData {
    country: string;
    region: string;
    sub_regions: IState[];
}

type Props = {
    sub_regions: string[];
    coverageAreaId: string;
    distributionCosts: IDistributionCost;
};

export default function SubRegionDistribution({
    sub_regions,
    coverageAreaId,
    distributionCosts,
}: Props) {
    const t = useTranslations();

    const { handleMessage } = useMessage();

    const [isLoading, setIsLoading] = useState(false);

    const [addressCountry, setAddressCountry] = useState<string>();
    const [tenSubRegions, setTenSubRegions] = useState<IState[] | undefined>(
        [],
    );
    const [listOfAllSubRegionsByRegion, setListOfAllSubRegionsByRegion] =
        useState<IState[] | undefined>([]);

    const [unCheckedSubRegions, setUnCheckedSubRegions] = useState<string[]>(
        [],
    );
    const [newSelectedSubRegions, setNewSelectedSubRegions] = useState<
        string[]
    >([]);
    const [selectedSubRegions, setSelectedSubRegions] =
        useState<string[]>(sub_regions);
    const [fromDBSubRegions, setFromDBSubRegions] = useState<string[]>(
        sub_regions ?? [],
    );

    const [selectAllCurrentPage, setSelectAllCurrentPage] = useState(false);

    const [selectAllSubRegionsByRegion, setSelectAllSubRegionsByRegion] =
        useState(false); // rastrear si todaslas ciudades de la región están seleccionadas, independientemente de la paginación

    const [currentPage, setCurrentPage] = useState(1);
    const [counter, setCounter] = useState(0);
    const resultsPerPage = 10;

    const [query, setQuery] = useState('');

    const queryClient = useQueryClient();

    const countryData = Country.getAllCountries();

    const form = useForm<FormData>();

    const { handleSubmit, register } = form;

    const { refetch } = useFetchStatesByCountry(addressCountry ?? 'ES');

    useEffect(() => {
        const country = Country.getCountryByCode('ES') as ICountry;
        setAddressCountry(country.isoCode ?? '');
    }, []);

    useEffect(() => {
        if (!addressCountry) return;

        const getSubRegionData = async () => {
            return await refetch().then((res) => {
                const { data: sub_regionData, error } = res;

                if (error || !sub_regionData) {
                    console.error(error);
                    return;
                }

                const lOfSubRegions = slicePaginationResults(
                    sub_regionData,
                    currentPage,
                    resultsPerPage,
                );

                setListOfAllSubRegionsByRegion(sub_regionData ?? []);
                setCounter(sub_regionData?.length ?? 0);

                setTenSubRegions(lOfSubRegions);
            });
        };

        // const sub_regionData = State.getStatesOfCountry(addressCountry);
        getSubRegionData().then();
    }, [addressCountry]);

    useEffect(() => {
        if (!listOfAllSubRegionsByRegion) return;

        const lOfSubRegions = filterSearchInputQuery(
            listOfAllSubRegionsByRegion,
            query,
            currentPage,
            resultsPerPage,
        );
        setTenSubRegions(lOfSubRegions);

        // Update selectAllCurrentPage based on whether all sub_regions on this page are selected
        setSelectAllCurrentPage(
            lOfSubRegions?.every((sub_region) =>
                selectedSubRegions.includes(sub_region.name),
            ) ?? false,
        );
    }, [currentPage]);

    useEffect(() => {
        if (!listOfAllSubRegionsByRegion) return;

        const lAllSubRegions = filterSearchInputQuery(
            listOfAllSubRegionsByRegion,
            query,
            currentPage,
            resultsPerPage,
        );

        setTenSubRegions(lAllSubRegions);
    }, [query]);

    const handleAddressCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAddressCountry(e.target.value);
        setTenSubRegions([]);
    };

    const handleUpdateSubRegionsDistribution = async () => {
        setIsLoading(true);

        const areaAndWeightId = distributionCosts?.area_and_weight_cost?.id;

        if (!areaAndWeightId) {
            handleMessage({
                type: 'error',
                message: t('errors.update_sub_region_coverage_area'),
            });

            setIsLoading(false);
        } else {
            // Remove the cities from unCheckedSubRegions that are already in the list of selected sub_regions
            const filteredUnCheckedSubRegions = unCheckedSubRegions.filter(
                (sub_region) => fromDBSubRegions.includes(sub_region),
            );

            // Eliminate duplicated sub_regions
            const unCheckedSubRegions_ = Array.from(
                new Set(filteredUnCheckedSubRegions),
            );
            const newSelectedSubRegions_ = Array.from(
                new Set(newSelectedSubRegions),
            );
            const selectedSubRegions_ = Array.from(new Set(selectedSubRegions));

            const res = await updateSubRegionDistribution(
                unCheckedSubRegions_,
                newSelectedSubRegions_,
                selectedSubRegions_,
                coverageAreaId,
                areaAndWeightId,
            );

            if (
                !res ||
                (res.status !== 200 && res.status !== 201 && res.status !== 202)
            ) {
                handleMessage({
                    type: 'error',
                    message: t('errors.update_sub_region_coverage_area'),
                });

                setIsLoading(false);
                return;
            }

            handleMessage({
                type: 'success',
                message: t('success.update_sub_region_coverage_area'),
            });

            queryClient.invalidateQueries('distribution');

            setUnCheckedSubRegions([]);
            setNewSelectedSubRegions([]);
            setFromDBSubRegions(selectedSubRegions_); // Update the list of sub_regions that are already in the database

            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    };

    const updateSubRegionsDistributionMutation = useMutation({
        mutationKey: 'updateSubRegionsDistribution',
        mutationFn: handleUpdateSubRegionsDistribution,
        onMutate: () => {
            setIsLoading(true);
        },
        onError: () => {
            console.error('onError');
            setIsLoading(false);
        },
    });

    const onSubmit = () => {
        try {
            updateSubRegionsDistributionMutation.mutate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCheckbox = (
        e: React.ChangeEvent<HTMLInputElement>,
        sub_region: string,
    ) => {
        // If the sub_region is unchecked, add it to the list of unchecked sub_regions
        if (!e.target.checked) {
            setUnCheckedSubRegions([...unCheckedSubRegions, sub_region]);
        } else {
            // If the sub_region is checked, remove it from the list of unchecked sub_regions
            setUnCheckedSubRegions(
                unCheckedSubRegions.filter(
                    (sub_region) => sub_region !== sub_region,
                ),
            );
        }

        // If the sub_region has never been selected, add it to the list of selected sub_regions
        if (!fromDBSubRegions.includes(sub_region)) {
            setNewSelectedSubRegions([...newSelectedSubRegions, sub_region]);
        }

        // If the sub_region is checked, add it to the list of selected sub_regions
        const updatedSelectedSubRegions = e.target.checked
            ? [...selectedSubRegions, sub_region]
            : selectedSubRegions.filter((item) => item !== sub_region);

        setSelectedSubRegions(updatedSelectedSubRegions);
    };

    const handleSelectAllCurrentPage = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const listOfSubRegionsNames =
            tenSubRegions?.map((sub_region) => sub_region.name) || [];

        // If the user unchecks the select all checkbox button
        if (!e.target.checked) {
            // Add all the cities to unchecked list
            setUnCheckedSubRegions([
                ...unCheckedSubRegions,
                ...listOfSubRegionsNames,
            ]);

            // Remove all sub_regions from the list of new selected sub_regions
            setNewSelectedSubRegions(
                newSelectedSubRegions.filter(
                    (item) => !listOfSubRegionsNames.includes(item),
                ),
            );

            // Remove all sub_regions from the list of selected sub_regions
            setSelectedSubRegions(
                selectedSubRegions.filter(
                    (sub_region) => !listOfSubRegionsNames.includes(sub_region),
                ),
            );
        } else {
            // If the user checks the select all checkbox button
            // Remove all the sub_regions from the unchecked list
            setUnCheckedSubRegions(
                unCheckedSubRegions.filter(
                    (sub_region) => !listOfSubRegionsNames.includes(sub_region),
                ),
            );

            // Add all the sub_regions to the list of new selected sub_regions
            setNewSelectedSubRegions([
                ...newSelectedSubRegions,
                ...listOfSubRegionsNames,
            ]);

            // Add all the sub_regions to the list of selected sub_regions
            setSelectedSubRegions([
                ...selectedSubRegions,
                ...listOfSubRegionsNames,
            ]);
        }

        setSelectAllCurrentPage(e.target.checked);
    };

    // COMPROBAR COMO HACEMOS EL BORRADO Y LA INSERCIÓN DE PROVINCIAS EN EL ARRAY DE PROVINCIAS
    const handleSelectAllSubRegionsByRegion = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        let updatedSelectedSubRegions = [...selectedSubRegions];
        if (e.target.checked) {
            updatedSelectedSubRegions.push(
                ...(listOfAllSubRegionsByRegion?.map(
                    (sub_region) => sub_region.name,
                ) ?? []),
            );
        } else {
            updatedSelectedSubRegions = updatedSelectedSubRegions.filter(
                (selectedSubRegion) =>
                    !listOfAllSubRegionsByRegion
                        ?.map((sub_region) => sub_region.name)
                        .includes(selectedSubRegion),
            );
        }

        setSelectedSubRegions(updatedSelectedSubRegions);
        setSelectAllSubRegionsByRegion(e.target.checked);
        setSelectAllCurrentPage(e.target.checked);
    };

    return (
        <section className="flex flex-col items-start space-y-4 rounded-xl border border-beer-softBlondeBubble border-b-gray-200 bg-beer-foam p-4">
            {isLoading && (
                <Spinner size={'large'} color={'beer-blonde'} center absolute />
            )}

            <Button
                btnType="submit"
                onClick={handleSubmit(onSubmit)}
                class=""
                primary
                medium
            >
                {t('save')}
            </Button>

            <div
                className={`
                            flex flex-col items-start space-y-4 w-full
                            ${isLoading ? 'opacity-50 pointer-events-none' : ''}
                        `}
            >
                <address className="grid w-full grid-cols-2 gap-4">
                    <label
                        htmlFor="addressCountry"
                        className="text-sm text-gray-600"
                    >
                        {t('loc_country')}
                    </label>

                    {/* Display all countries  */}
                    <select
                        name="addressCountry"
                        id="addressCountry"
                        className=" w-full rounded-lg border-transparent bg-gray-100 px-4 py-2 text-base text-gray-700 focus:border-gray-500 focus:bg-white focus:ring-0"
                        onChange={(e) => handleAddressCountry(e)}
                        value={addressCountry}
                    >
                        <option key={'ES'} value={'ES'}>
                            Spain
                        </option>

                        {countryData.map((country: ICountry) => (
                            <option
                                key={country.isoCode}
                                value={country.isoCode}
                            >
                                {country.name}
                            </option>
                        ))}
                    </select>
                </address>

                <InputSearch
                    query={query}
                    setQuery={setQuery}
                    searchPlaceholder={'search_by_name'}
                />

                {/* Names of the countries selected by the distributor  */}
                {selectedSubRegions && selectedSubRegions.length > 0 && (
                    <div className="flex flex-row flex-wrap space-x-2 space-y-1">
                        {selectedSubRegions?.map(
                            (sub_region: string, index: number) => {
                                // We can delete from the list one country just by clicking on it
                                return (
                                    <DistributionChipCard
                                        name={sub_region}
                                        index={index}
                                        selectedNames={selectedSubRegions}
                                        setSelectedNames={setSelectedSubRegions}
                                    />
                                );
                            },
                        )}
                    </div>
                )}

                {/* List of sub_regions in the country  */}
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
                                                    handleSelectAllCurrentPage(
                                                        e,
                                                    );
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
                                        (sub_region: IState, index: number) => {
                                            const startIndex =
                                                currentPage * resultsPerPage;
                                            const globalIndex =
                                                startIndex + index;

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
                                                        globalIndex={
                                                            globalIndex
                                                        }
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
            </div>
        </section>
    );
}

interface SubRegionRowProps {
    sub_region: IState;
    globalIndex: number;
    selectedSubRegions: string[];
    handleCheckbox: (
        e: React.ChangeEvent<HTMLInputElement>,
        name: string,
    ) => void;
    register: UseFormRegister<any>;
}

const SubRegionRow = ({
    sub_region,
    globalIndex,
    handleCheckbox,
    register,
    selectedSubRegions,
}: SubRegionRowProps) => {
    const isChecked = (sub_region: IState) => {
        return selectedSubRegions.includes(sub_region.name);
    };

    return (
        <>
            <th
                scope="row"
                className="w-20 whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
            >
                <input
                    type="checkbox"
                    {...register(`sub_regions`)}
                    // {...register(`sub_regions.${globalIndex}.name`)}
                    // {...register(`sub_regions.${globalIndex}-${sub_region.name}.name`)}
                    id={`sub_regions.${globalIndex}.${sub_region.name}}`}
                    value={sub_region.name}
                    checked={isChecked(sub_region)}
                    onChange={(e) => {
                        handleCheckbox(e, sub_region.name);
                    }}
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                />
            </th>

            <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
                {sub_region.name}
            </td>
        </>
    );
};
