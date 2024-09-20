import RegionTable from './RegionTable';
import useSWRMutation from 'swr/mutation';
import CheckboxListRegions from './CheckboxListSubRegions';
import InputSearch from '@/app/[locale]/components/form/InputSearch';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { isSameRegion } from '@/utils/distribution';
import { useMutation, useQueryClient } from 'react-query';
import { DistributionDestinationType } from '@/lib/enums';
import { updateRegionDistribution } from '../../../actions';
import { JSONRegion } from '@/lib/types/distribution_areas';
import { Country, ICountry, IState } from 'country-state-city';
import { useAuth } from '../../../../../(auth)/Context/useAuth';
import { ICoverageArea, IDistributionCost } from '@/lib/types/types';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { filterSearchInputQuery, slicePaginationResults } from '@/utils/utils';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import Spinner from '@/app/[locale]/components/ui/Spinner';

const fetcher = (arg: any, ...args: any) =>
    fetch(arg, ...args).then((res) => res.json());

interface FormData {
    country: string;
    region: string;
    regions: IState[];
}

type Props = {
    distributionCosts: IDistributionCost;
    fromDB: ICoverageArea[];
};

export default function RegionDistribution({
    distributionCosts,
    fromDB,
}: Props) {
    const t = useTranslations();

    const { handleMessage } = useMessage();
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState(false);

    const [countryISOCode, setCountryISOCode] = useState<string>();
    const [translationISOCode, setTranslationISOCode] = useState<string>();
    const [regionFilename, setRegionFilename] = useState<string>();

    const [tenRegions, setTenRegions] = useState<JSONRegion[]>([]);

    const [listOfAllRegionsByCountry, setListOfAllRegionsByCountry] = useState<
        JSONRegion[] | undefined
    >([]);

    const [unCheckedRegions, setUnCheckedRegions] = useState<ICoverageArea[]>(
        [],
    );
    const [newSelectedRegions, setNewSelectedRegions] = useState<
        ICoverageArea[]
    >([]);
    const [selectedRegions, setSelectedRegions] = useState<ICoverageArea[]>(
        fromDB.filter(
            (item) =>
                item.administrative_division ===
                DistributionDestinationType.REGION,
        ) ?? [],
    );

    const [regionsFromDB, setRegionsFromDB] = useState<ICoverageArea[]>(
        fromDB.filter(
            (item) =>
                item.administrative_division ===
                DistributionDestinationType.REGION,
        ) ?? [],
    );

    const [selectAllCurrentPage, setSelectAllCurrentPage] = useState(false);

    const [selectAllRegions, setSelectAllRegionsByRegion] = useState(false); // rastrear si todas las ciudades de la región están seleccionadas, independientemente de la paginación

    const [currentPage, setCurrentPage] = useState(1);
    const [counter, setCounter] = useState(0);
    const resultsPerPage = 10;

    const [query, setQuery] = useState('');

    const queryClient = useQueryClient();

    const countryData = Country.getAllCountries();

    const form = useForm<FormData>();

    const { handleSubmit, register } = form;

    const {
        data: regionsData,
        trigger,
        error: apiCallError,
    } = useSWRMutation(
        `/api/country/regions?name=${translationISOCode}&fileName=${regionFilename}`,
        fetcher,
    );

    useEffect(() => {
        const country = Country.getCountryByCode('ES') as ICountry;
        setCountryISOCode(country.isoCode ?? '');
    }, []);

    useEffect(() => {
        if (!countryISOCode) return;

        switch (countryISOCode) {
            case 'ES':
                setRegionFilename('autonomous_communities');
                setTranslationISOCode('spain');
                break;
            case 'IT':
                setRegionFilename('regions');
                setTranslationISOCode('italy');
                break;

            case 'FR':
                setRegionFilename('regions');
                setTranslationISOCode('france');

            default:
                setRegionFilename('regions');
                setTranslationISOCode('spain');
        }
    }, [countryISOCode]);

    useEffect(() => {
        if (!regionFilename) return;
        trigger();
    }, [regionFilename]);

    useEffect(() => {
        if (!listOfAllRegionsByCountry) return;

        const lOfRegions = filterSearchInputQuery(
            listOfAllRegionsByCountry,
            query,
            currentPage,
            resultsPerPage,
        );
        setTenRegions(lOfRegions);
    }, [currentPage]);

    useEffect(() => {
        if (tenRegions.length > 0) {
            // Update selectAllCurrentPage based on whether all regions on this page are selected
            const allRegionsSelected = tenRegions.every((region: any) =>
                selectedRegions.some((item) => isSameRegion(item, region)),
            );

            setSelectAllCurrentPage(allRegionsSelected);
        }
    }, [tenRegions]);

    useEffect(() => {
        if (!listOfAllRegionsByCountry) return;

        const lAllRegions = filterSearchInputQuery(
            listOfAllRegionsByCountry,
            query,
            currentPage,
            resultsPerPage,
        );

        setTenRegions(lAllRegions);
    }, [query]);

    useEffect(() => {
        if (!regionsData) return;

        const lOfSubRegions = slicePaginationResults(
            regionsData,
            currentPage,
            resultsPerPage,
        );

        setListOfAllRegionsByCountry(regionsData ?? []);
        setCounter(regionsData?.length ?? 0);

        setTenRegions(lOfSubRegions);
    }, [regionsData]);

    const handleCountryISOCode = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCountryISOCode(e.target.value);
        setTenRegions([]);
    };

    const handleUpdateRegionDistribution = async () => {
        setIsLoading(true);

        const areaAndWeightId = distributionCosts?.area_and_weight_cost?.id;

        if (!areaAndWeightId) {
            handleMessage({
                type: 'error',
                message: 'errors.update_region_coverage_area',
            });

            setIsLoading(false);
        } else {
            // Eliminate duplicated regions
            const unCheckedRegions_ = Array.from(new Set(unCheckedRegions));
            const newSelectedRegions_ = Array.from(new Set(newSelectedRegions));
            const selectedRegions_ = Array.from(new Set(selectedRegions));

            const res = await updateRegionDistribution(
                unCheckedRegions_,
                newSelectedRegions_,
                selectedRegions_,
                areaAndWeightId,
            );

            if (
                !res ||
                (res.status !== 200 && res.status !== 201 && res.status !== 202)
            ) {
                handleMessage({
                    type: 'error',
                    message: 'errors.update_region_coverage_area',
                });

                setIsLoading(false);
                return;
            }

            handleMessage({
                type: 'success',
                message: 'success.update_region_coverage_area',
            });

            queryClient.invalidateQueries('distributionCosts');

            setUnCheckedRegions([]);
            setNewSelectedRegions([]);
            setRegionsFromDB(selectedRegions_);

            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    };

    const updateRegionsDistributionMutation = useMutation({
        mutationKey: 'updateRegionsDistribution',
        mutationFn: handleUpdateRegionDistribution,
        onMutate: () => {
            console.info('onMutate');
            setIsLoading(true);
        },

        onError: () => {
            console.error('onError');
            setIsLoading(false);
        },
    });

    const onSubmit = () => {
        try {
            updateRegionsDistributionMutation.mutate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCheckbox = (
        e: React.ChangeEvent<HTMLInputElement>,
        region: JSONRegion,
    ) => {
        // Convertir region a ICoverageArea
        const region_: ICoverageArea = {
            country: region.country,
            country_iso_code: region.country_iso_code,
            region: region.name,
            distributor_id: user.id,
            administrative_division: DistributionDestinationType.REGION,
        };

        // If region is unchecked, add it to the list of regions to be removed
        if (!e.target.checked) {
            // 1. Si existe en el array de BBDD lo añadimos a la lista de regiones a deseleccionar
            if (regionsFromDB.some((item) => isSameRegion(item, region_))) {
                setUnCheckedRegions([...unCheckedRegions, region_]);
            }

            // 2. Si existe en el array de regiones seleccionadas lo eliminamos
            setNewSelectedRegions(
                newSelectedRegions.filter(
                    (item) =>
                        item.country !== region.country ||
                        item.region !== region.name,
                ),
            );

            // 3. Si existe en el array de regiones seleccionadas lo eliminamos
            setSelectedRegions(
                selectedRegions.filter(
                    (item) =>
                        item.country !== region.country ||
                        item.region !== region.name,
                ),
            );
        } else {
            // 1. Si NO existe en el array de BBDD lo añadimos a la lista de regiones a seleccionar
            if (!regionsFromDB.some((item) => isSameRegion(item, region_))) {
                setNewSelectedRegions([...newSelectedRegions, region_]);
            }

            // 2. Si existe en el array unCheckedRegions lo eliminamos
            setUnCheckedRegions(
                unCheckedRegions.filter(
                    (item) =>
                        item.country !== region.country ||
                        item.region !== region.name,
                ),
            );

            // 3. Si NO existe en el array de regiones seleccionadas lo añadimos
            setSelectedRegions([...selectedRegions, region_]);
        }

        // 4. Actualizamos array fromDBRegions con las regiones seleccionadas
        setRegionsFromDB(selectedRegions);
    };

    const handleSelectAllCurrentPage = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        // Convertir JSONRegion a ICoverageArea
        const tenRegions_: ICoverageArea[] =
            tenRegions?.map((region) => ({
                country: region.country,
                country_iso_code: region.country_iso_code,
                region: region.name,
                distributor_id: user.id,
                administrative_division: DistributionDestinationType.REGION,
            })) || [];

        // If checkbox is checked, add all regions on the current page to the list of regions to be selected
        if (e.target.checked) {
            const updatedSelectedRegions = Array.from(
                new Set([...selectedRegions, ...tenRegions_]),
            );

            // 1. Añadir a la lista de regiones seleccionadas y quitar duplicados
            setSelectedRegions(updatedSelectedRegions);

            // 2. Eliminar elementos unCheckedRegions que estén en la lista de regiones seleccionadas
            setUnCheckedRegions(
                unCheckedRegions.filter(
                    (region) =>
                        !updatedSelectedRegions.some((item) =>
                            isSameRegion(item, region),
                        ),
                ),
            );

            // 3. Añadir elementos a newSelectedRegions que no estén en la lista de regiones seleccionadas
            // 3.1 Comprobar que no existan previamente en newSelectedRegions
            const newSelectedRegions_ = tenRegions_.filter(
                (region) =>
                    !newSelectedRegions.some((item) =>
                        isSameRegion(item, region),
                    ),
            );

            setNewSelectedRegions([
                ...newSelectedRegions,
                ...newSelectedRegions_,
            ]);
        } else {
            // If checkbox is unchecked, remove all regions on the current page from the list of regions to be selected
            // 1. Eliminar de la lista de regiones seleccionadas
            setSelectedRegions(
                selectedRegions.filter(
                    (region) =>
                        !tenRegions_.some((item) => isSameRegion(item, region)),
                ),
            );

            // 2. Añadir a la lista de regiones a deseleccionar
            // 2.1 Solo añadimos array unCheckedRegions si existe en fromDBRegions
            setUnCheckedRegions([
                ...unCheckedRegions,
                ...tenRegions_.filter((region) =>
                    regionsFromDB.some((item) => isSameRegion(item, region)),
                ),
            ]);

            // 3. Eliminar de newSelectedRegions
            setNewSelectedRegions(
                newSelectedRegions.filter(
                    (region) =>
                        !tenRegions_.some((item) => isSameRegion(item, region)),
                ),
            );
        }

        // 4. Actualizamos checkbox toggle de la página actual
        setSelectAllCurrentPage(e.target.checked);
    };

    // const handleSelectAllRegionsByRegion = (
    //     e: React.ChangeEvent<HTMLInputElement>,
    // ) => {
    //     let updatedSelectedRegions = [...selectedRegions];
    //     if (e.target.checked) {
    //         updatedSelectedRegions.push(
    //             ...(listOfAllRegionsByRegion?.map((region) => region.name) ??
    //                 []),
    //         );
    //     } else {
    //         updatedSelectedRegions = updatedSelectedRegions.filter(
    //             (selectedCity) =>
    //                 !listOfAllRegionsByRegion
    //                     ?.map((region) => region.name)
    //                     .includes(selectedCity),
    //         );
    //     }

    //     setSelectedRegions(updatedSelectedRegions);
    //     setSelectAllRegionsByRegion(e.target.checked);
    //     setSelectAllCurrentPage(e.target.checked);
    // };

    return (
        <section className="flex flex-col items-start space-y-4 rounded-xl border border-beer-softBlondeBubble border-b-gray-200 bg-beer-foam p-4">
            {isLoading && (
                <Spinner
                    size={'large'}
                    color={'beer-blonde'}
                    absolutePosition="center"
                    absolute
                />
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
                            ${isLoading && 'opacity-50 pointer-events-none'}
                        `}
            >
                <RegionTable regions={selectedRegions} />

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
                            {t('countries.spain')}
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

                <CheckboxListRegions
                    tenRegions={tenRegions}
                    counter={counter}
                    resultsPerPage={resultsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    selectedRegions={selectedRegions}
                    handleCheckbox={handleCheckbox}
                    register={register}
                    handleSelectAllCurrentPage={handleSelectAllCurrentPage}
                    selectAllCurrentPage={selectAllCurrentPage}
                />
            </div>
        </section>
    );
}
