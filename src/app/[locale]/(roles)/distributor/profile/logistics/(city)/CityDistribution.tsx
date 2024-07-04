import useFetchCitiesOfState from '../useFetchCitiesOfState';
import useFetchStatesByCountry from '../useFetchStatesByCountry';
import PaginationFooter from '../../../../../components/common/PaginationFooter';
import Button from '../../../../../components/common/Button';
import Spinner from '../../../../../components/common/Spinner';
import InputSearch from '../../../../../components/common/InputSearch';
import DistributionChipCard from '../DistributionChipCard';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from 'react-query';
import { useForm, UseFormRegister } from 'react-hook-form';
import { slicePaginationResults } from '../../../../../../../utils/utils';
import {
    ICity,
    ICountry,
    IState,
} from '../../../../../../../lib/types/distribution_areas';
import { Country } from 'country-state-city';
import { useMessage } from '../../../../../components/message/useMessage';
import { IDistributionCost } from '../../../../../../../lib/types/types';
import { updateCityDistribution } from '../../../actions';

interface FormData {
    country: string;
    region: string;
    cities: ICity[];
}

type Props = {
    cities: string[];
    coverageAreaId: string;
    distributionCosts: IDistributionCost;
};

export default function CityDistribution({
    cities,
    coverageAreaId,
    distributionCosts,
}: Props) {
    const t = useTranslations();
    const { handleMessage } = useMessage();

    const [isLoading, setIsLoading] = useState(false);

    const [addressCountry, setAddressCountry] = useState<string>('ES');
    const [addressRegion, setAddressRegion] = useState<string>('C'); // A Coruña
    const [listOfRegions, setListOfRegions] = useState<IState[] | undefined>();
    const [listOfCities, setListOfCities] = useState<ICity[] | undefined>();
    const [regionIsEnable, setRegionIsEnable] = useState<boolean>(false);
    const [listOfAllCitiesBySubRegion, setlistOfAllCitiesBySubRegion] =
        useState<ICity[] | undefined>();

    const [unCheckedCities, setUnCheckedCities] = useState<string[]>([]);
    const [newSelectedCities, setNewSelectedCities] = useState<string[]>([]);
    const [selectedCities, setSelectedCities] = useState<string[]>(
        cities ?? [],
    );
    const [fromDBCities, setFromDBCities] = useState<string[]>(cities ?? []);

    const [selectAllCurrentPage, setSelectAllCurrentPage] = useState(false);
    // rastrear si todas las ciudades de la región están seleccionadas, independientemente de la paginación
    const [selectAllCitiesByRegion, setSelectAllCitiesByRegion] =
        useState(false);

    const [isRegionLoading, setIsRegionLoading] = useState(false);

    // const { refetch: getCountries } = useFetchAllCountries();

    const { refetch: getStates } = useFetchStatesByCountry(
        addressCountry ?? 'ES',
    );

    const { refetch: getCities } = useFetchCitiesOfState(
        addressCountry ?? 'ES',
        addressRegion ?? 'C', // A Coruña
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [counter, setCounter] = useState(0);
    const resultsPerPage = 10;

    const [query, setQuery] = useState('');

    const queryClient = useQueryClient();

    // const [countryData, setCountryData] = useState<ICountry[]>([]);

    const form = useForm<FormData>();

    const { handleSubmit, register } = form;

    useEffect(() => {
        console.log('unCheckedCities', unCheckedCities);
        console.log('newSelectedCities', newSelectedCities);
        console.log('selectedCities', selectedCities);
    }, [unCheckedCities, newSelectedCities, selectedCities]);

    // Get all the countries
    useEffect(() => {
        // const getAllCountries = async () => {
        //     return await getCountries().then((res) => {
        //         const { data, error } = res;

        //         if (error) {
        //             console.error(error);
        //             return;
        //         }
        //         setCountryData(data ?? []);
        //     });
        // };

        // getAllCountries();

        const country = Country.getCountryByCode('ES') as ICountry;

        setAddressCountry(country.iso2 ?? 'ES');
    }, []);

    // Get all the states of selected country and set the first one as default in select input
    useEffect(() => {
        if (!addressCountry) return;

        const getStatesByCountry = async () => {
            return await getStates().then((res) => {
                const { data: regionData, error } = res;

                if (error) {
                    console.error(error);
                    return;
                }
                if (!regionData || regionData?.length === 0) {
                    setRegionIsEnable(false);
                    return;
                }

                setListOfRegions(regionData ?? []);
                setRegionIsEnable(regionData.length > 0);
                setAddressRegion(regionData[0]?.iso2);
            });
        };

        getStatesByCountry();
    }, [addressCountry]);

    // Get all the cities of selected state
    useEffect(() => {
        if (!addressCountry || !addressRegion) return;

        const getCitiesByStateAndCountry = async () => {
            return await getCities().then((res) => {
                const { data: cityData, error } = res;

                if (error) {
                    console.error(error);
                    return;
                }

                if (!cityData || cityData?.length === 0) {
                    setListOfCities([]);
                    setCounter(0);
                    return;
                }

                const lOfCities = slicePaginationResults(
                    cityData,
                    currentPage,
                    resultsPerPage,
                );

                setListOfCities(lOfCities);
                setCounter(cityData?.length);

                setlistOfAllCitiesBySubRegion(cityData);

                // Update selectAllCurrentPage based on whether all cities on this page are selected
                setSelectAllCurrentPage(
                    lOfCities?.every((city) =>
                        selectedCities.includes(city.name),
                    ) ?? false,
                );
            });
        };

        getCitiesByStateAndCountry();

        // // Update selectAllCities based on whether all cities in the region are selected
        // setSelectAllCitiesByRegion(
        //   listOfAllCitiesBySubRegion?.every((city) =>
        //     selectedCities.includes(city.name)
        //   ) ?? false
        // );
    }, [addressRegion, currentPage, selectedCities]);

    const handleAddressRegion = (e: any) => {
        setIsRegionLoading(true);

        setTimeout(() => {
            setAddressRegion(e);
            setCurrentPage(1);
            setIsRegionLoading(false);
        }, 500);
    };

    const handleAddressCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAddressCountry(e.target.value);
        setListOfCities([]);
    };

    const handleUpdateCityDistribution = async (formValues: FormData) => {
        setIsLoading(true);

        const areaAndWeightId = distributionCosts?.area_and_weight_cost?.id;

        if (!areaAndWeightId) {
            handleMessage({
                type: 'error',
                message: t('errors.update_city_coverage_area'),
            });

            setIsLoading(false);
        } else {
            // Remove the cities from unCheckedCities that are not present in fromDBCities
            const filteredUnCheckedCities_ = unCheckedCities.filter((city) =>
                fromDBCities.includes(city),
            );

            // Eliminate duplicated cities
            const unCheckedCities_ = Array.from(
                new Set(filteredUnCheckedCities_),
            );
            const newSelectedCities_ = Array.from(new Set(newSelectedCities));
            const selectedCities_ = Array.from(new Set(selectedCities));

            const res = await updateCityDistribution(
                unCheckedCities_,
                newSelectedCities_,
                selectedCities_,
                coverageAreaId,
                areaAndWeightId,
            );

            if (
                !res ||
                (res.status !== 200 && res.status !== 201 && res.status !== 202)
            ) {
                handleMessage({
                    type: 'error',
                    message: t('errors.update_city_coverage_area'),
                });

                setIsLoading(false);
                return;
            }

            handleMessage({
                type: 'success',
                message: t('success.update_city_coverage_area'),
            });

            queryClient.invalidateQueries('distribution');

            setUnCheckedCities([]);
            setNewSelectedCities([]);
            setFromDBCities(selectedCities_);

            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    };

    const updateCityDistributionMutation = useMutation({
        mutationKey: 'updateCityDistribution',
        mutationFn: handleUpdateCityDistribution,
        onError: (error) => {
            console.error('Error', error);
        },
    });

    const onSubmit = (formValues: FormData) => {
        try {
            updateCityDistributionMutation.mutate(formValues);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCheckbox = (
        e: React.ChangeEvent<HTMLInputElement>,
        city: string,
    ) => {
        // If the city is unchecked, add it to the list of unchecked cities
        if (!e.target.checked) {
            setUnCheckedCities([...unCheckedCities, city]);
        } else {
            // If the city is checked, remove it from the list of unchecked cities
            setUnCheckedCities(unCheckedCities.filter((item) => item !== city));
        }

        // If the city has never been selected, add it to the list of new selected cities
        if (!fromDBCities.includes(city)) {
            setNewSelectedCities([...newSelectedCities, city]);
        }

        // If the city is checked, add it to the list of selected cities
        const updatedSelectedCities = e.target.checked
            ? [...selectedCities, city]
            : selectedCities.filter((item) => item !== city);

        setSelectedCities(updatedSelectedCities);
    };

    const handleSelectAllCurrentPage = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const listOfCityNames = listOfCities?.map((city) => city.name) || [];

        // If the user unchecks the select all checkbox
        if (!e.target.checked) {
            // Add all the cities to the list of unchecked cities
            setUnCheckedCities([...unCheckedCities, ...listOfCityNames]);

            // Remove all the cities from the list of new selected cities
            setNewSelectedCities(
                newSelectedCities.filter(
                    (checkedCity) => !listOfCityNames.includes(checkedCity),
                ),
            );

            // Remove all the cities from the list of selected cities
            setSelectedCities(
                selectedCities.filter(
                    (checkedCity) => !listOfCityNames.includes(checkedCity),
                ),
            );
        } else {
            // If the user checks the select all checbkox
            // Remove all the cities from the list of unchecked cities
            setUnCheckedCities(
                unCheckedCities.filter(
                    (checkedCity) => !listOfCityNames.includes(checkedCity),
                ),
            );

            // Add all the new cities to the list of new selected cities
            setNewSelectedCities([...newSelectedCities, ...listOfCityNames]);

            // Add all the cities to the list of selected cities
            setSelectedCities([...selectedCities, ...listOfCityNames]);
        }

        setSelectAllCurrentPage(e.target.checked);
    };

    // COMPROBAR COMO HACEMOS EL BORRADO Y LA INSERCIÓN DE CIUDADES EN EL ARRAY DE CIUDADES
    const handleSelectAllCitiesBySubRegion = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        let updatedSelectedCities = [...selectedCities];

        // If the user unchecks the select all checkbox
        if (!e.target.checked) {
            updatedSelectedCities = updatedSelectedCities.filter(
                (selectedCity) =>
                    !listOfAllCitiesBySubRegion
                        ?.map((city) => city.name)
                        .includes(selectedCity),
            );

            // Add all the cities to the list of unchecked cities
            setUnCheckedCities([...unCheckedCities, ...selectedCities]);

            // Remove all the cities from the list of new selected cities
            setNewSelectedCities(
                newSelectedCities.filter(
                    (checkedCity) => !selectedCities.includes(checkedCity),
                ),
            );

            // Remove all the cities from the list of selected cities
            setSelectedCities(updatedSelectedCities);
        } else {
            // If the user checks the select all checbkox
            // Remove all the cities from the list of unchecked cities
            setUnCheckedCities([]);

            // Add all the new cities to the list of new selected cities
            setNewSelectedCities([...newSelectedCities, ...selectedCities]);

            // Add all the cities to the list of selected cities
            setSelectedCities([...selectedCities]);

            updatedSelectedCities.push(
                ...(listOfAllCitiesBySubRegion?.map((city) => city.name) ?? []),
            );

            setSelectedCities(updatedSelectedCities);
        }

        setSelectAllCitiesByRegion(e.target.checked);
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
                <div className="grid w-full grid-cols-2 gap-4">
                    <address>
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

                            {/* {countryData &&
                                countryData.map((country: ICountry) => (
                                    <option
                                        key={country.iso2}
                                        value={country.iso2}
                                    >
                                        {country.name}
                                    </option>
                                ))} */}
                        </select>
                    </address>

                    <address>
                        {/* Display states of that country  */}
                        <label
                            htmlFor="addressRegion"
                            className="text-sm text-gray-600"
                        >
                            {t('loc_')}
                        </label>

                        <select
                            name="addressRegion"
                            id="addressRegion"
                            className={`w-full rounded-lg border-transparent bg-gray-100 px-4 py-2 text-base text-gray-700 focus:border-gray-500 focus:bg-white focus:ring-0`}
                            disabled={regionIsEnable === false}
                            onChange={(e) =>
                                handleAddressRegion(e.target.value)
                            }
                        >
                            {listOfRegions?.map((state: IState) => (
                                <option key={state.iso2} value={state.iso2}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                    </address>
                </div>

                <InputSearch
                    query={query}
                    setQuery={setQuery}
                    searchPlaceholder={'search_by_name'}
                />

                {/* Names of the cities selected by the distributor  */}
                {selectedCities && selectedCities.length > 0 && (
                    <div className="flex flex-row flex-wrap space-x-2 space-y-1">
                        {selectedCities?.map(
                            (sub_region: string, index: number) => {
                                // We can delete from the list one country just by clicking on it
                                return (
                                    <DistributionChipCard
                                        name={sub_region}
                                        index={index}
                                        selectedNames={selectedCities}
                                        setSelectedNames={setSelectedCities}
                                    />
                                );
                            },
                        )}
                    </div>
                )}

                {/* List of cities in the country  */}
                {isRegionLoading ? (
                    <div className="w-full">
                        <Spinner size={'medium'} color={'beer-blonde'} center />
                    </div>
                ) : (
                    <>
                        {listOfCities &&
                            listOfRegions &&
                            listOfCities.length > 0 &&
                            listOfRegions.length > 0 && (
                                <>
                                    <div className="w-full">
                                        <PaginationFooter
                                            counter={counter}
                                            resultsPerPage={resultsPerPage}
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                        />

                                        {/* <div className="">
                                            <label
                                                htmlFor="allCitiesBySubRegion"
                                                className="space-x-2 text-lg text-gray-600"
                                            >
                                                <input
                                                    id="allCitiesBySubRegion"
                                                    type="checkbox"
                                                    onChange={(e) => {
                                                        handleSelectAllCitiesBySubRegion(
                                                            e,
                                                        );
                                                    }}
                                                    checked={
                                                        selectAllCitiesByRegion
                                                    }
                                                    className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                                                />

                                                <span className="text-sm text-gray-600">
                                                    {t(
                                                        'select_all_cities_by_region',
                                                    )}
                                                </span>
                                            </label>
                                        </div> */}

                                        {/* Display selectable table with all cities in the country selected */}
                                        <label
                                            htmlFor="addressCity"
                                            className="text-sm text-gray-600"
                                        >
                                            {t('loc_city')}
                                        </label>

                                        <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400 bg-beer-foam  ">
                                            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            onChange={(e) => {
                                                                handleSelectAllCurrentPage(
                                                                    e,
                                                                );
                                                            }}
                                                            checked={
                                                                selectAllCurrentPage
                                                            }
                                                            className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                                                        />
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3"
                                                    >
                                                        {t('city')}
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {listOfCities?.map(
                                                    (
                                                        city: ICity,
                                                        index: number,
                                                    ) => {
                                                        const startIndex =
                                                            (currentPage - 1) *
                                                            resultsPerPage;
                                                        const globalIndex =
                                                            startIndex + index;

                                                        return (
                                                            <tr
                                                                key={
                                                                    city.name +
                                                                    currentPage
                                                                }
                                                                className=""
                                                            >
                                                                <>
                                                                    <CityRow
                                                                        city={
                                                                            city
                                                                        }
                                                                        globalIndex={
                                                                            globalIndex
                                                                        }
                                                                        selectedCities={
                                                                            selectedCities
                                                                        }
                                                                        handleCheckbox={
                                                                            handleCheckbox
                                                                        }
                                                                        register={
                                                                            register
                                                                        }
                                                                    />
                                                                </>
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
                                </>
                            )}
                    </>
                )}
            </div>
        </section>
    );
}

interface CityRowProps {
    city: ICity;
    globalIndex: number;
    selectedCities: string[];
    handleCheckbox: (
        e: React.ChangeEvent<HTMLInputElement>,
        name: string,
    ) => void;
    register: UseFormRegister<any>;
}

const CityRow = ({
    city,
    globalIndex,
    handleCheckbox,
    register,
    selectedCities,
}: CityRowProps) => {
    const isChecked = (city: ICity) => {
        return selectedCities.includes(city.name);
    };

    return (
        <>
            <th
                scope="row"
                className="w-20 whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
            >
                <input
                    type="checkbox"
                    {...register(`cities`)}
                    id={`cities.${globalIndex}.${city.name}}`}
                    value={city.name}
                    checked={isChecked(city)}
                    onChange={(e) => {
                        handleCheckbox(e, city.name);
                    }}
                    className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                />
            </th>

            <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
                {city.name}
            </td>
        </>
    );
};
