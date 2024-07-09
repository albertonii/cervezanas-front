import SubRegionTable from './SubRegionTable';
import Button from '../../../../../components/common/Button';
import useFetchStatesByCountry from '../useFetchStatesByCountry';
import PaginationFooter from '../../../../../components/common/PaginationFooter';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from 'react-query';
import { useForm, UseFormRegister } from 'react-hook-form';
import { Country, ICountry, IState } from 'country-state-city';
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
import {
    IRegionCoverageAreas,
    ISubRegionCoverageAreas,
    JSONRegion,
    JSONSubRegion,
} from '../../../../../../../lib/types/distribution_areas';
import useSWRMutation from 'swr/mutation';
import { useAuth } from '../../../../../(auth)/Context/useAuth';

interface FormData {
    country: string;
    coverage_area_id: string;
    region: string;
    sub_regions: IState[];
}

type Props = {
    // sub_regions: string[];
    coverageAreaId: string;
    distributionCosts: IDistributionCost;
    new_sub_regions: ISubRegionCoverageAreas[];
};

const fetcher = (arg: any, ...args: any) =>
    fetch(arg, ...args).then((res) => res.json());

export default function SubRegionDistribution({
    // sub_regions,
    coverageAreaId,
    distributionCosts,
    new_sub_regions,
}: Props) {
    console.log(new_sub_regions);
    const t = useTranslations();

    const { handleMessage } = useMessage();
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState(false);

    const [countryISOCode, setCountryISOCode] = useState<string>();
    const [translationISOCode, setTranslationISOCode] = useState<string>();
    const [subRegionFilename, setSubRegionFilename] = useState<string>();

    const [tenSubRegions, setTenSubRegions] = useState<JSONSubRegion[]>([]);

    const [subRegions, setSubRegions] = useState<JSONSubRegion[]>([]);

    const [listOfAllSubRegionsByRegion, setListOfAllSubRegionsByRegion] =
        useState<JSONSubRegion[]>([]);

    const [unCheckedSubRegions, setUnCheckedSubRegions] = useState<
        ISubRegionCoverageAreas[]
    >([]);

    const [newSelectedSubRegions, setNewSelectedSubRegions] = useState<
        ISubRegionCoverageAreas[]
    >([]);

    const [selectedSubRegions, setSelectedSubRegions] = useState<
        ISubRegionCoverageAreas[]
    >([]);

    const [regionsFromDB, setFromDBSubRegions] = useState<
        ISubRegionCoverageAreas[]
    >(new_sub_regions ?? []);

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

    const {
        data: subRegionsData,
        trigger,
        error: apiCallError,
    } = useSWRMutation(
        `/api/country/sub_regions?name=${translationISOCode}&fileName=${subRegionFilename}`,
        fetcher,
    );

    // const { refetch } = useFetchStatesByCountry(countryISOCode ?? 'ES');

    useEffect(() => {
        if (!countryISOCode) return;

        switch (countryISOCode) {
            case 'ES':
                setSubRegionFilename('provinces');
                break;
            case 'IT':
                setSubRegionFilename('provinces');
                break;
            case 'FR':
                setSubRegionFilename('departments');
                break;
            default:
                setSubRegionFilename('provinces');
        }
    }, [countryISOCode]);

    useEffect(() => {
        if (!subRegionFilename) return;
        trigger();
    }, [subRegionFilename]);

    useEffect(() => {
        const country = Country.getCountryByCode('ES') as ICountry;
        setCountryISOCode(country.isoCode ?? '');
    }, []);

    useEffect(() => {
        switch (countryISOCode) {
            case 'ES':
                setTranslationISOCode('spain');
                break;
            case 'IT':
                setTranslationISOCode('italy');
                break;
            case 'FR':
                setTranslationISOCode('france');
                break;
            case 'PT':
                setTranslationISOCode('portugal');
                break;
            default:
                setTranslationISOCode('es');
        }
    }, [countryISOCode]);

    // useEffect(() => {
    //     if (!countryISOCode) return;

    //     const getSubRegionData = async () => {
    //         return await refetch().then((res) => {
    //             const { data: sub_regionData, error } = res;

    //             if (error || !sub_regionData) {
    //                 console.error(error);
    //                 return;
    //             }

    //             const lOfSubRegions = slicePaginationResults(
    //                 sub_regionData,
    //                 currentPage,
    //                 resultsPerPage,
    //             );

    //             setListOfAllSubRegionsByRegion(sub_regionData ?? []);
    //             setCounter(sub_regionData?.length ?? 0);

    //             setTenSubRegions(lOfSubRegions);
    //         });
    //     };

    //     // const sub_regionData = State.getStatesOfCountry(countryISOCode);
    //     getSubRegionData().then();
    // }, [countryISOCode]);

    useEffect(() => {
        if (!listOfAllSubRegionsByRegion) return;

        const lOfSubRegions = filterSearchInputQuery(
            listOfAllSubRegionsByRegion,
            query,
            currentPage,
            resultsPerPage,
        );

        setTenSubRegions(lOfSubRegions);

        if (lOfSubRegions.length > 0) {
            // Update selectAllCurrentPage based on whether all sub_regions on this page are selected
            setSelectAllCurrentPage(
                lOfSubRegions?.every((sub_region) =>
                    selectedSubRegions.includes(sub_region.name),
                ) ?? false,
            );
        }
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

    useEffect(() => {
        if (!subRegionsData) return;

        setSubRegions(subRegionsData);

        const lOfSubRegions = slicePaginationResults(
            subRegionsData,
            currentPage,
            resultsPerPage,
        );

        setListOfAllSubRegionsByRegion(subRegionsData ?? []);
        setCounter(subRegionsData?.length ?? 0);

        setTenSubRegions(lOfSubRegions);
    }, [subRegionsData]);

    useEffect(() => {
        console.log('Unchecked subregions', unCheckedSubRegions);
        console.log('New selected subregions', newSelectedSubRegions);
        console.log('SELECTED', selectedSubRegions);
        console.log('FROM DB', regionsFromDB);
    }, [
        unCheckedSubRegions,
        newSelectedSubRegions,
        selectedSubRegions,
        regionsFromDB,
    ]);

    const handleCountryISOCode = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCountryISOCode(e.target.value);
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
                (sub_region) => regionsFromDB.includes(sub_region),
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
        sub_region: JSONSubRegion,
    ) => {
        // Convertir sub_region a ISubRegionCoverageAreas
        const subRegion_: ISubRegionCoverageAreas = {
            country: sub_region.country,
            country_iso_code: sub_region.country_iso_code,
            region: sub_region.region,
            name: sub_region.name,
            distributor_id: user.id,
        };

        // If the sub_region is unchecked, add it to the list of unchecked sub_regions
        if (!e.target.checked) {
            setUnCheckedSubRegions([...unCheckedSubRegions, subRegion_]);

            // Remove the sub_region from the list of selected sub_regions
            setSelectedSubRegions(
                selectedSubRegions.filter((item) => {
                    return (
                        item.region !== subRegion_.region ||
                        item.country !== subRegion_.country ||
                        item.name !== subRegion_.name
                    );
                }),
            );

            // Remove the sub_region from the list of new selected sub_regions
            setNewSelectedSubRegions(
                newSelectedSubRegions.filter((item) => {
                    return (
                        item.region !== subRegion_.region ||
                        item.country !== subRegion_.country ||
                        item.name !== subRegion_.name
                    );
                }),
            );
        } else {
            // If the sub_region is checked, remove it from the list of unchecked sub_regions
            setUnCheckedSubRegions(
                unCheckedSubRegions.filter((item) => item !== subRegion_),
            );

            // Check If the sub_region has never been selected, add it to the list of selected sub_regions
            const subRegionExists = selectedSubRegions.find(
                (item) =>
                    item.name === subRegion_.name &&
                    item.region === subRegion_.region &&
                    item.country === subRegion_.country,
            );

            // Add the sub_region to the list of selected sub_regions
            if (!subRegionExists) {
                setSelectedSubRegions([...selectedSubRegions, subRegion_]);
            }

            // Check if the sub_region has never been selected, add it to the list of new selected sub_regions
            const newSelectedSubRegionExists = newSelectedSubRegions.find(
                (item) =>
                    item.name === subRegion_.name &&
                    item.region === subRegion_.region &&
                    item.country === subRegion_.country,
            );

            // Add the sub_region to the list of new selected sub_regions
            if (!newSelectedSubRegionExists) {
                setNewSelectedSubRegions([
                    ...newSelectedSubRegions,
                    subRegion_,
                ]);
            }
        }

        // Check if the subRegions from DB are already in the list of selected sub_regions
        // If the sub_region has never been selected, add it to the list of selected sub_regions
        regionsFromDB.map((region: ISubRegionCoverageAreas) => {
            if (!selectedSubRegions.includes(region)) {
                setSelectedSubRegions([...selectedSubRegions, region]);
            }
        });
    };

    const handleSelectAllCurrentPage = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        // If the checkbox is checked, add all the sub_regions on the current page to the list of selected sub_regions
        if (e.target.checked) {
            // Convertir JSONSubRegion a ISubRegionCoverageAreas
            const tenSubRegions_: ISubRegionCoverageAreas[] = tenSubRegions.map(
                (sub_region: JSONSubRegion) => {
                    return {
                        country: sub_region.country,
                        country_iso_code: sub_region.country_iso_code,
                        region: sub_region.region,
                        name: sub_region.name,
                        distributor_id: user.id,
                    };
                },
            );

            setNewSelectedSubRegions([
                ...newSelectedSubRegions,
                ...tenSubRegions_,
            ]);

            // Add all the sub_regions on the current page to the list of selected sub_regions
            const updatedSelectedSubRegions = [
                ...selectedSubRegions,
                ...tenSubRegions_,
            ];

            setSelectedSubRegions(updatedSelectedSubRegions);

            // Eliminar de la lista de uncheckedSubRegions los sub_regions que ya están en la lista de selectedSubRegions
            const filteredUnCheckedSubRegions = unCheckedSubRegions.filter(
                (sub_region) => selectedSubRegions.includes(sub_region),
            );

            setUnCheckedSubRegions(filteredUnCheckedSubRegions);
        } else {
            // Convertir JSONSubRegion a ISubRegionCoverageAreas
            const tenSubRegions_: ISubRegionCoverageAreas[] = tenSubRegions.map(
                (sub_region: JSONSubRegion) => {
                    return {
                        country: sub_region.country,
                        country_iso_code: sub_region.country_iso_code,
                        region: sub_region.region,
                        name: sub_region.name,
                        distributor_id: user.id,
                    };
                },
            );

            // If the checkbox is unchecked, remove all the sub_regions on the current page from the list of selected sub_regions
            const updatedSelectedSubRegions = selectedSubRegions.filter(
                (selectedSubRegion) =>
                    !tenSubRegions_.some(
                        (sub_region) =>
                            sub_region.name === selectedSubRegion.name &&
                            sub_region.region === selectedSubRegion.region &&
                            sub_region.country === selectedSubRegion.country,
                    ),
            );
            setSelectedSubRegions(updatedSelectedSubRegions);

            // Add all the sub_regions on the current page to the list of unchecked sub_regions
            const updatedUnCheckedSubRegions = [
                ...unCheckedSubRegions,
                ...tenSubRegions_,
            ];

            // Eliminate duplicated sub_regions
            setUnCheckedSubRegions(
                Array.from(new Set(updatedUnCheckedSubRegions)),
            );

            // Remove the sub_regions on the current page from the list of new selected sub_regions
            const updatedNewSelectedSubRegions = newSelectedSubRegions.filter(
                (newSelectedSubRegion) =>
                    !tenSubRegions_.some(
                        (sub_region) =>
                            sub_region.name === newSelectedSubRegion.name &&
                            sub_region.region === newSelectedSubRegion.region &&
                            sub_region.country === newSelectedSubRegion.country,
                    ),
            );

            setNewSelectedSubRegions(updatedNewSelectedSubRegions);
        }

        setSelectAllCurrentPage(e.target.checked);
    };

    // COMPROBAR COMO HACEMOS EL BORRADO Y LA INSERCIÓN DE PROVINCIAS EN EL ARRAY DE PROVINCIAS
    // const handleSelectAllSubRegionsByRegion = (
    //     e: React.ChangeEvent<HTMLInputElement>,
    // ) => {
    //     let updatedSelectedSubRegions = [...selectedSubRegions];
    //     if (e.target.checked) {
    //         updatedSelectedSubRegions.push(
    //             ...(listOfAllSubRegionsByRegion?.map(
    //                 (sub_region) => sub_region.name,
    //             ) ?? []),
    //         );
    //     } else {
    //         updatedSelectedSubRegions = updatedSelectedSubRegions.filter(
    //             (selectedSubRegion) =>
    //                 !listOfAllSubRegionsByRegion
    //                     ?.map((sub_region) => sub_region.name)
    //                     .includes(selectedSubRegion),
    //         );
    //     }

    //     setSelectedSubRegions(updatedSelectedSubRegions);
    //     setSelectAllSubRegionsByRegion(e.target.checked);
    //     setSelectAllCurrentPage(e.target.checked);
    // };

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
                        htmlFor="countryISOCode"
                        className="text-sm text-gray-600"
                    >
                        {t('loc_country')}
                    </label>

                    {/* Display all countries  */}
                    <select
                        name="countryISOCode"
                        id="countryISOCode"
                        className=" w-full rounded-lg border-transparent bg-gray-100 px-4 py-2 text-base text-gray-700 focus:border-gray-500 focus:bg-white focus:ring-0"
                        onChange={(e) => handleCountryISOCode(e)}
                        value={countryISOCode}
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

                <SubRegionTable subRegions={newSelectedSubRegions} />

                <InputSearch
                    query={query}
                    setQuery={setQuery}
                    searchPlaceholder={'search_by_name'}
                />

                {/* Names of the countries selected by the distributor  */}
                {/* {selectedSubRegions && selectedSubRegions.length > 0 && (
                    <div className="flex flex-row flex-wrap space-x-2 space-y-1">
                        {selectedSubRegions?.map(
                            (sub_region: string, index: number) => {
                                // We can delete from the list one sub region just by clicking on it
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
                )} */}

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
                                        (
                                            sub_region: JSONSubRegion,
                                            index: number,
                                        ) => {
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
    sub_region: JSONSubRegion;
    globalIndex: number;
    selectedSubRegions: ISubRegionCoverageAreas[];
    handleCheckbox: (
        e: React.ChangeEvent<HTMLInputElement>,
        name: JSONSubRegion,
    ) => void;
    register: UseFormRegister<any>;
}

const SubRegionRow = ({
    sub_region,
    globalIndex,
    selectedSubRegions,
    handleCheckbox,
    register,
}: SubRegionRowProps) => {
    const isChecked = (sub_region: JSONSubRegion) => {
        return selectedSubRegions.some(
            (item) =>
                item.name === sub_region.name &&
                item.region === sub_region.region &&
                item.country === sub_region.country,
        );
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
                    id={`sub_regions.${globalIndex}.${sub_region.name}}`}
                    value={sub_region.name}
                    checked={isChecked(sub_region)}
                    onChange={(e) => {
                        handleCheckbox(e, sub_region);
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
