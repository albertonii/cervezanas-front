import Loading from '../../../../../loading';
import PaginationFooter from '../../../../../components/common/PaginationFooter';
import Button from '../../../../../components/common/Button';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from 'react-query';
import { useForm, UseFormRegister } from 'react-hook-form';
import { Country, ICountry, IState } from 'country-state-city';
import { useAuth } from '../../../../../(auth)/Context/useAuth';
import {
    filterSearchInputQuery,
    slicePaginationResults,
} from '../../../../../../../utils/utils';
import InputSearch from '../../../../../components/common/InputSearch';
import useFetchSpanishRegions from '../useFetchSpanishRegions';
import DistributionChipCard from '../DistributionChipCard';

type Props = {
    regions: string[];
    coverageAreaId: string;
};

interface FormData {
    country: string;
    region: string;
    regions: IState[];
}

export default function RegionDistribution({ regions, coverageAreaId }: Props) {
    const t = useTranslations();

    const [isLoading, setIsLoading] = useState(false);

    const [addressCountry, setAddressCountry] = useState<string>();
    const [tenRegions, setTenRegions] = useState<
        { id: string; name: string }[] | undefined
    >([]);
    const [listOfAllRegionsByRegion, setListOfAllRegions] = useState<
        { id: string; name: string }[] | undefined
    >([]);

    const [selectedRegions, setSelectedRegions] = useState<string[]>(regions);
    const [selectAllCurrentPage, setSelectAllCurrentPage] = useState(false);

    const [selectAllRegions, setSelectAllRegionsByRegion] = useState(false); // rastrear si todas las ciudades de la región están seleccionadas, independientemente de la paginación

    const [currentPage, setCurrentPage] = useState(1);
    const [counter, setCounter] = useState(0);
    const resultsPerPage = 10;

    const { supabase } = useAuth();

    const [query, setQuery] = useState('');

    const queryClient = useQueryClient();

    // const countryData = Country.getAllCountries();
    const countryData = ['Spain'];

    const form = useForm<FormData>();

    const { handleSubmit, register } = form;

    const { refetch } = useFetchSpanishRegions();

    useEffect(() => {
        const country = Country.getCountryByCode('ES') as ICountry;
        setAddressCountry(country.isoCode ?? '');
    }, []);

    useEffect(() => {
        if (!addressCountry) return;

        const getRegionData = async () => {
            return await refetch().then((res) => {
                const { data: regionData, error } = res;

                if (error || !regionData) {
                    console.error(error);
                    return;
                }

                const lOfRegions = slicePaginationResults(
                    regionData,
                    currentPage,
                    resultsPerPage,
                );

                setListOfAllRegions(regionData ?? []);
                setCounter(regionData?.length ?? 0);

                setTenRegions(lOfRegions);
            });
        };

        // const regionData = State.getStatesOfCountry(addressCountry);
        getRegionData().then();
    }, [addressCountry]);

    useEffect(() => {
        if (!listOfAllRegionsByRegion) return;

        const lOfRegions = filterSearchInputQuery(
            listOfAllRegionsByRegion,
            query,
            currentPage,
            resultsPerPage,
        );
        setTenRegions(lOfRegions);

        // Update selectAllCurrentPage based on whether all regions on this page are selected
        setSelectAllCurrentPage(
            lOfRegions?.every((region) =>
                selectedRegions.includes(region.name),
            ) ?? false,
        );
    }, [currentPage]);

    useEffect(() => {
        if (!listOfAllRegionsByRegion) return;

        const lAllRegions = filterSearchInputQuery(
            listOfAllRegionsByRegion,
            query,
            currentPage,
            resultsPerPage,
        );

        setTenRegions(lAllRegions);
    }, [query]);

    const handleAddressCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAddressCountry(e.target.value);
        setTenRegions([]);
    };

    const handleUpdatePronvicesDistribution = async () => {
        const { error } = await supabase
            .from('coverage_areas')
            .update({ regions: selectedRegions })
            .eq('id', coverageAreaId);

        if (error) {
            console.error(error);
            return;
        }

        queryClient.invalidateQueries('distribution');
        setIsLoading(false);
    };

    const updateRegionsDistributionMutation = useMutation({
        mutationKey: 'updateRegionsDistribution',
        mutationFn: handleUpdatePronvicesDistribution,
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
        region: string,
    ) => {
        const updatedSelectedRegions = e.target.checked
            ? [...selectedRegions, region]
            : selectedRegions.filter((item) => item !== region);

        setSelectedRegions(updatedSelectedRegions);
    };

    const handleSelectAllCurrentPage = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const listOfCityNames = tenRegions?.map((region) => region.name) || [];

        const updatedSelectedRegions = e.target.checked
            ? [...selectedRegions, ...listOfCityNames]
            : selectedRegions.filter(
                  (checkedCity) => !listOfCityNames.includes(checkedCity),
              );

        setSelectedRegions(updatedSelectedRegions);
        setSelectAllCurrentPage(e.target.checked);
    };

    const handleSelectAllRegionsByRegion = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        let updatedSelectedRegions = [...selectedRegions];
        if (e.target.checked) {
            updatedSelectedRegions.push(
                ...(listOfAllRegionsByRegion?.map((region) => region.name) ??
                    []),
            );
        } else {
            updatedSelectedRegions = updatedSelectedRegions.filter(
                (selectedCity) =>
                    !listOfAllRegionsByRegion
                        ?.map((region) => region.name)
                        .includes(selectedCity),
            );
        }

        setSelectedRegions(updatedSelectedRegions);
        setSelectAllRegionsByRegion(e.target.checked);
        setSelectAllCurrentPage(e.target.checked);
    };

    return (
        <section className="flex flex-col items-start space-y-4 rounded-xl border border-beer-softBlondeBubble border-b-gray-200 bg-beer-foam p-4">
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <Button
                        btnType="submit"
                        onClick={handleSubmit(onSubmit)}
                        class=""
                        primary
                        medium
                    >
                        {t('save')}
                    </Button>

                    <div className="flex flex-col items-start space-y-4">
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
                                {countryData.map((country: string) => (
                                    <option>{country}</option>
                                ))}
                            </select>
                        </address>

                        <InputSearch
                            query={query}
                            setQuery={setQuery}
                            searchPlaceholder={'search_by_name'}
                        />

                        {/* Names of the regions selected by the distributor  */}
                        {setSelectedRegions && setSelectedRegions.length > 0 && (
                            <div className="flex flex-row flex-wrap space-x-2 space-y-1">
                                {selectedRegions?.map(
                                    (region: string, index: number) => {
                                        // We can delete from the list one country just by clicking on it
                                        return (
                                            <DistributionChipCard
                                                name={region}
                                                index={index}
                                                selectedNames={selectedRegions}
                                                setSelectedNames={
                                                    setSelectedRegions
                                                }
                                            />
                                        );
                                    },
                                )}
                            </div>
                        )}

                        {/* List of regions in the country  */}
                        {tenRegions && tenRegions.length > 0 && (
                            <>
                                <div className="">
                                    <label
                                        htmlFor="allRegionsByRegion"
                                        className="space-x-2 text-lg text-gray-600"
                                    >
                                        <input
                                            id="allRegionsByRegion"
                                            type="checkbox"
                                            onChange={(e) => {
                                                handleSelectAllRegionsByRegion(
                                                    e,
                                                );
                                            }}
                                            checked={selectAllRegions}
                                            className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                                        />

                                        <span className="text-sm text-gray-600">
                                            {t('select_all_regions')}
                                        </span>
                                    </label>
                                </div>

                                <div className="w-full">
                                    {/* Display selectable table with all regions in the country selected */}
                                    <label
                                        htmlFor="addressCity"
                                        className="text-sm text-gray-600"
                                    >
                                        {t('loc_region')}
                                    </label>

                                    <table className="bg-beer-foam w-full text-center text-sm text-gray-500 dark:text-gray-400 ">
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
                                                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                                                    />
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    {t('region')}
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {tenRegions?.map(
                                                (
                                                    region: {
                                                        id: string;
                                                        name: string;
                                                    },
                                                    index: number,
                                                ) => {
                                                    const startIndex =
                                                        currentPage *
                                                        resultsPerPage;
                                                    const globalIndex =
                                                        startIndex + index;

                                                    return (
                                                        <tr
                                                            key={
                                                                region.name +
                                                                currentPage
                                                            }
                                                            className=""
                                                        >
                                                            <RegionRow
                                                                region={region}
                                                                globalIndex={
                                                                    globalIndex
                                                                }
                                                                selectedRegions={
                                                                    selectedRegions
                                                                }
                                                                handleCheckbox={
                                                                    handleCheckbox
                                                                }
                                                                register={
                                                                    register
                                                                }
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
                            </>
                        )}
                    </div>
                </>
            )}
        </section>
    );
}

interface RegionRowProps {
    region: { id: string; name: string };
    globalIndex: number;
    selectedRegions: string[];
    handleCheckbox: (
        e: React.ChangeEvent<HTMLInputElement>,
        name: string,
    ) => void;
    register: UseFormRegister<any>;
}

const RegionRow = ({
    region,
    globalIndex,
    handleCheckbox,
    register,
    selectedRegions,
}: RegionRowProps) => {
    const isChecked = (region: { id: string; name: string }) => {
        return selectedRegions.includes(region.name);
    };

    return (
        <>
            <th
                scope="row"
                className="w-20 whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
            >
                <input
                    type="checkbox"
                    {...register(`regions`)}
                    // {...register(`regions.${globalIndex}.name`)}
                    // {...register(`regions.${globalIndex}-${region.name}.name`)}
                    id={`regions.${globalIndex}.${region.name}}`}
                    value={region.name}
                    checked={isChecked(region)}
                    onChange={(e) => {
                        handleCheckbox(e, region.name);
                    }}
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                />
            </th>

            <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
                {region.name}
            </td>
        </>
    );
};
