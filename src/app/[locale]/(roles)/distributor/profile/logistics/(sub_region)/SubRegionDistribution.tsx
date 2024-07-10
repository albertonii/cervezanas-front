import SubRegionTable from './SubRegionTable';
import Button from '../../../../../components/common/Button';
import useFetchStatesByCountry from '../useFetchStatesByCountry';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
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
    ISubRegionCoverageAreas,
    JSONSubRegion,
} from '../../../../../../../lib/types/distribution_areas';
import useSWRMutation from 'swr/mutation';
import { useAuth } from '../../../../../(auth)/Context/useAuth';
import CheckboxListSubRegions from './CheckboxListSubRegions';
import { isSameSubRegion } from '../../../../../../../utils/distribution';

interface FormData {
    country: string;
    coverage_area_id: string;
    region: string;
    sub_regions: IState[];
}

type Props = {
    // sub_regions: string[];
    distributionCosts: IDistributionCost;
    fromDB: ISubRegionCoverageAreas[];
};

const fetcher = (arg: any, ...args: any) =>
    fetch(arg, ...args).then((res) => res.json());

export default function SubRegionDistribution({
    // sub_regions,
    distributionCosts,
    fromDB,
}: Props) {
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
    >(fromDB ?? []);

    const [subRegionsFromDB, setFromDBSubRegions] = useState<
        ISubRegionCoverageAreas[]
    >(fromDB ?? []);

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
        console.log('FROM DB', subRegionsFromDB);
    }, [
        unCheckedSubRegions,
        newSelectedSubRegions,
        selectedSubRegions,
        subRegionsFromDB,
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
            // Eliminate duplicated sub_regions
            const unCheckedSubRegions_ = Array.from(
                new Set(unCheckedSubRegions),
            );
            const newSelectedSubRegions_ = Array.from(
                new Set(newSelectedSubRegions),
            );
            const selectedSubRegions_ = Array.from(new Set(selectedSubRegions));

            const res = await updateSubRegionDistribution(
                unCheckedSubRegions_,
                newSelectedSubRegions_,
                selectedSubRegions_,
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

    const handleCheckbox = async (
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
            // 1. Si existe en el array de BD, añadirlo al array de uncheckedSubRegions
            if (
                subRegionsFromDB.some((item) =>
                    isSameSubRegion(item, subRegion_),
                )
            ) {
                setUnCheckedSubRegions([...unCheckedSubRegions, subRegion_]);
            }

            // 2. Si el elemento existe en el array de newSelectedSubRegions, eliminarlo
            setNewSelectedSubRegions(
                newSelectedSubRegions.filter((item) => {
                    return (
                        item.region !== subRegion_.region ||
                        item.country !== subRegion_.country ||
                        item.name !== subRegion_.name
                    );
                }),
            );

            // 3. Eliminar el elemento del array de selectedSubRegions
            setSelectedSubRegions(
                selectedSubRegions.filter((item) => {
                    return (
                        item.region !== subRegion_.region ||
                        item.country !== subRegion_.country ||
                        item.name !== subRegion_.name
                    );
                }),
            );
        } else {
            // 1. Si el elemento NO existe en el array de BBDD entonces lo añadimos en newSelectedSubRegions
            const subRegionExistsInDB = subRegionsFromDB.find((item) =>
                isSameSubRegion(item, subRegion_),
            );

            if (!subRegionExistsInDB) {
                setNewSelectedSubRegions([
                    ...newSelectedSubRegions,
                    subRegion_,
                ]);
            }

            // 2. Si el elemento existe en el array de unCheckedSubRegions, eliminarlo
            setUnCheckedSubRegions(
                unCheckedSubRegions.filter((item) => {
                    return (
                        item.region !== subRegion_.region ||
                        item.country !== subRegion_.country ||
                        item.name !== subRegion_.name
                    );
                }),
            );

            // 3. Si el elemento no existe en el array de selectedSubRegions, añadirlo
            if (
                !selectedSubRegions.some((item) =>
                    isSameSubRegion(item, subRegion_),
                )
            ) {
                setSelectedSubRegions([...selectedSubRegions, subRegion_]);
            }
        }

        // 4. Actualizamos el array fromDBSubRegions con los elementos nuevos que están seleccionados del array de selectedSubRegions
        setFromDBSubRegions(selectedSubRegions);
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
                <SubRegionTable subRegions={selectedSubRegions} />

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

                <CheckboxListSubRegions
                    tenSubRegions={tenSubRegions}
                    counter={counter}
                    resultsPerPage={resultsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    selectedSubRegions={selectedSubRegions}
                    handleCheckbox={handleCheckbox}
                    register={register}
                />
            </div>
        </section>
    );
}
