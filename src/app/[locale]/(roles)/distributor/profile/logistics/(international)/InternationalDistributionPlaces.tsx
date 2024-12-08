import useFetchAllCountries from '../useFetchAllCountries';
import InputSearch from '@/app/[locale]/components/form/InputSearch';
import { useForm, UseFormRegister } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { ICountry } from 'country-state-city/lib/interface';
import { filterSearchInputQuery } from '@/utils/utils';
import { useAuth } from '../../../../../(auth)/Context/useAuth';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { useTranslations } from 'next-intl';
import DistributionChipCard from '../DistributionChipCard';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import PaginationFooter from '@/app/[locale]/components/ui/PaginationFooter';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import Label from '@/app/[locale]/components/ui/Label';
import Table from '@/app/[locale]/components/ui/table/Table';
import THead from '@/app/[locale]/components/ui/table/THead';
import TR from '@/app/[locale]/components/ui/table/TR';
import TH from '@/app/[locale]/components/ui/table/TH';
import TBody from '@/app/[locale]/components/ui/table/TBody';

type Props = {
    countries: string[];
    coverageAreaId: string;
};

export default function InternationalDistributionPlaces({
    countries,
    coverageAreaId,
}: Props) {
    const t = useTranslations();

    const submitSuccessMessage = t('messages.updated_successfully');
    const submitErrorMessage = t('messages.submit_error');

    const { handleMessage } = useMessage();

    const { supabase } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [selectAllCurrentPage, setSelectAllCurrentPage] = useState(false);

    const [selectAllCountries, setSelectAllCountries] = useState(false); // rastrear si todas las ciudades de la región están seleccionadas, independientemente de la paginación

    const [currentPage, setCurrentPage] = useState(1);
    const [counter, setCounter] = useState(0);
    const resultsPerPage = 10;

    const [query, setQuery] = useState('');

    const queryClient = useQueryClient();

    const [selectedCountries, setSelectedCountries] = useState<string[]>(
        countries ?? [],
    );
    const [listOfCountries, setListOfCountries] = useState<ICountry[]>([]);
    const [tableCountries, setTableCountries] = useState<ICountry[]>([]);

    const form = useForm<FormData>();

    const { handleSubmit, register } = form;

    const { refetch } = useFetchAllCountries();

    useEffect(() => {
        const getCountries = async () => {
            refetch().then((res) => {
                const countries: ICountry[] = res.data || [];
                setCounter(countries.length);

                setListOfCountries(countries);

                const startIndex = (currentPage - 1) * resultsPerPage;
                const endIndex = startIndex + resultsPerPage;

                const lOfCountries = countries?.slice(startIndex, endIndex);
                setTableCountries(lOfCountries);
            });
        };

        getCountries();
    }, []);

    useEffect(() => {
        if (!listOfCountries || listOfCountries.length === 0) return;
        const startIndex = (currentPage - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        const lOfCountries = listOfCountries?.slice(startIndex, endIndex);
        if (!lOfCountries || lOfCountries.length === 0) return;

        // Update selectAllCurrentPage based on whether all countries on this page are selected
        const allCountriesOnPageSelected = lOfCountries?.every((country) =>
            selectedCountries.includes(country.name),
        );

        setSelectAllCurrentPage(allCountriesOnPageSelected);
        setTableCountries(lOfCountries);
    }, [currentPage]);

    useEffect(() => {
        const lOfCountries = filterSearchInputQuery(
            listOfCountries,
            query,
            currentPage,
            resultsPerPage,
        );

        setTableCountries(lOfCountries);
    }, [query]);

    const handleUpdateInternationalDistribution = async () => {
        setIsLoading(true);

        // const { error } = await supabase
        //     .from('coverage_areas')
        //     .update({ international: selectedCountries })
        //     .eq('id', coverageAreaId);

        // if (error) {
        //     console.error(error);

        //     handleMessage({
        //         type: 'error',
        //         message: submitErrorMessage,
        //     });

        //     setIsLoading(false);

        //     return;
        // }

        handleMessage({
            type: 'success',
            message: submitSuccessMessage,
        });

        queryClient.invalidateQueries('distribution');

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    const updateInternationalDistributionMutation = useMutation({
        mutationKey: 'updateInternationalDistribution',
        mutationFn: handleUpdateInternationalDistribution,
        onMutate: () => {
            console.info('onMutate');
        },
        onSuccess: () => {
            console.info('onSuccess');
        },
        onError: () => {
            console.error('onError');
        },
    });

    const onSubmit = () => {
        try {
            updateInternationalDistributionMutation.mutate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCheckbox = (
        e: React.ChangeEvent<HTMLInputElement>,
        country: string,
    ) => {
        const updatedSelectedCountries = e.target.checked
            ? [...selectedCountries, country]
            : selectedCountries.filter((item) => item !== country);

        setSelectedCountries(updatedSelectedCountries);
    };

    const handleSelectAllCurrentPage = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const tableCountries_aux =
            tableCountries?.map((country) => country.name) || [];

        const updatedSelectedCountries = e.target.checked
            ? [...selectedCountries, ...tableCountries_aux]
            : selectedCountries.filter(
                  (checkedCountry) =>
                      !tableCountries_aux.includes(checkedCountry),
              );

        setSelectedCountries(updatedSelectedCountries);
        setSelectAllCurrentPage(e.target.checked);
    };

    const handleSelectAllCountries = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        let updatedSelectedCountries = [...selectedCountries];
        if (e.target.checked) {
            updatedSelectedCountries.push(
                ...(listOfCountries?.map((country) => country.name) ?? []),
            );
        } else {
            updatedSelectedCountries = updatedSelectedCountries.filter(
                (selectedCountry) =>
                    !listOfCountries
                        ?.map((country) => country.name)
                        .includes(selectedCountry),
            );
        }

        setSelectedCountries(updatedSelectedCountries);
        setSelectAllCountries(e.target.checked);
        setSelectAllCurrentPage(e.target.checked);
    };

    return (
        <section className="flex flex-col items-start space-y-4 rounded-xl border border-beer-softBlondeBubble border-b-gray-200 bg-beer-foam py-4 px-1 sm:px-4 max-w-full">
            {isLoading && (
                <Spinner
                    size={'large'}
                    color={'beer-blonde'}
                    absolutePosition="center"
                    absolute
                />
            )}

            <div
                className={`
                            flex flex-col items-start space-y-4 w-full
                            ${isLoading ? 'opacity-50 pointer-events-none' : ''}
                        `}
            >
                <Button
                    btnType="submit"
                    onClick={handleSubmit(onSubmit)}
                    class=""
                    primary
                    medium
                >
                    {t('save')}
                </Button>

                <InputSearch
                    query={query}
                    setQuery={setQuery}
                    searchPlaceholder={'search_by_name'}
                />

                {/* Names of the countries selected by the distributor  */}
                {selectedCountries && selectedCountries.length > 0 && (
                    <div className="flex flex-row flex-wrap space-x-2 space-y-1">
                        {selectedCountries?.map(
                            (country: string, index: number) => {
                                // We can delete from the list one country just by clicking on it
                                return (
                                    <DistributionChipCard
                                        name={country}
                                        index={index}
                                        selectedNames={selectedCountries}
                                        setSelectedNames={setSelectedCountries}
                                    />
                                );
                            },
                        )}
                    </div>
                )}

                {/* List of countries  */}
                {tableCountries && tableCountries.length > 0 && (
                    <>
                        {/* <address>
                            <label
                                htmlFor="allCountries"
                                className="space-x-2 text-lg text-gray-600"
                            >
                                <input
                                    id="allCountriesByRegion"
                                    type="checkbox"
                                    onChange={(e) => {
                                        handleSelectAllCountries(e);
                                    }}
                                    checked={selectAllCountries}
                                    className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                                />

                                <span className="text-sm text-gray-600">
                                    {t('select_all_countries')}
                                </span>
                            </label>
                        </address> */}

                        <address className="w-full">
                            {/* Display selectable table with all countries in the country selected */}
                            <Label htmlFor="addressCountry">
                                {t('loc_country')}
                            </Label>

                            <Table>
                                <THead>
                                    <TR>
                                        <TH scope="col">
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
                                        </TH>

                                        <TH scope="col">{t('country')}</TH>
                                    </TR>
                                </THead>

                                <TBody>
                                    {tableCountries?.map(
                                        (country: any, index: number) => {
                                            const startIndex =
                                                currentPage * resultsPerPage;
                                            const globalIndex =
                                                startIndex + index;

                                            return (
                                                <TR
                                                    key={
                                                        country.name +
                                                        currentPage
                                                    }
                                                >
                                                    <CountryRow
                                                        country={country}
                                                        globalIndex={
                                                            globalIndex
                                                        }
                                                        selectedCountries={
                                                            selectedCountries
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
                        </address>
                    </>
                )}
            </div>
        </section>
    );
}

interface CountryRowProps {
    country: ICountry;
    globalIndex: number;
    selectedCountries: string[];
    handleCheckbox: (
        e: React.ChangeEvent<HTMLInputElement>,
        name: string,
    ) => void;
    register: UseFormRegister<any>;
}

const CountryRow = ({
    country,
    globalIndex,
    handleCheckbox,
    register,
    selectedCountries,
}: CountryRowProps) => {
    const isChecked = (country: ICountry) => {
        const countryLowerCase = country.name.toLowerCase();
        return selectedCountries
            .map((c) => {
                return c.toLowerCase();
            })
            .includes(countryLowerCase);
    };

    return (
        <>
            <th
                scope="row"
                className="w-20 whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
            >
                <input
                    type="checkbox"
                    {...register(`countries`)}
                    id={`countries.${globalIndex}.${country.name}}`}
                    value={country.name}
                    checked={isChecked(country)}
                    onChange={(e) => {
                        handleCheckbox(e, country.name);
                    }}
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                />
            </th>

            <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft dark:text-beer-softBlonde dark:hover:text-beer-gold">
                {country.name}
            </td>
        </>
    );
};
