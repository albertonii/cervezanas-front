import Loading from '../../../../../loading';
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
import { updateProvinceDistribution } from '../../../actions';
import { IDistributionCost } from '../../../../../../../lib/types/types';
import { useMessage } from '../../../../../components/message/useMessage';

interface FormData {
    country: string;
    region: string;
    provinces: IState[];
}

type Props = {
    provinces: string[];
    coverageAreaId: string;
    distributionCosts: IDistributionCost;
};

export default function ProvinceDistribution({
    provinces,
    coverageAreaId,
    distributionCosts,
}: Props) {
    const t = useTranslations();

    const { handleMessage } = useMessage();

    const [isLoading, setIsLoading] = useState(false);

    const [addressCountry, setAddressCountry] = useState<string>();
    const [tenProvinces, setTenProvinces] = useState<IState[] | undefined>([]);
    const [listOfAllProvincesByRegion, setListOfAllProvincesByRegion] =
        useState<IState[] | undefined>([]);

    const [unCheckedProvinces, setUnCheckedProvinces] = useState<string[]>([]);
    const [newSelectedProvinces, setNewSelectedProvinces] = useState<string[]>(
        [],
    );
    const [selectedProvinces, setSelectedProvinces] =
        useState<string[]>(provinces);
    const [selectAllCurrentPage, setSelectAllCurrentPage] = useState(false);

    const [selectAllProvincesByRegion, setSelectAllProvincesByRegion] =
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

        const getProvinceData = async () => {
            return await refetch().then((res) => {
                const { data: provinceData, error } = res;

                if (error || !provinceData) {
                    console.error(error);
                    return;
                }

                const lOfProvinces = slicePaginationResults(
                    provinceData,
                    currentPage,
                    resultsPerPage,
                );

                setListOfAllProvincesByRegion(provinceData ?? []);
                setCounter(provinceData?.length ?? 0);

                setTenProvinces(lOfProvinces);
            });
        };

        // const provinceData = State.getStatesOfCountry(addressCountry);
        getProvinceData().then();
    }, [addressCountry]);

    useEffect(() => {
        if (!listOfAllProvincesByRegion) return;

        const lOfProvinces = filterSearchInputQuery(
            listOfAllProvincesByRegion,
            query,
            currentPage,
            resultsPerPage,
        );
        setTenProvinces(lOfProvinces);

        // Update selectAllCurrentPage based on whether all provinces on this page are selected
        setSelectAllCurrentPage(
            lOfProvinces?.every((province) =>
                selectedProvinces.includes(province.name),
            ) ?? false,
        );
    }, [currentPage]);

    useEffect(() => {
        if (!listOfAllProvincesByRegion) return;

        const lAllProvinces = filterSearchInputQuery(
            listOfAllProvincesByRegion,
            query,
            currentPage,
            resultsPerPage,
        );

        setTenProvinces(lAllProvinces);
    }, [query]);

    const handleAddressCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAddressCountry(e.target.value);
        setTenProvinces([]);
    };

    const handleUpdatePronvicesDistribution = async () => {
        setIsLoading(true);

        const areaAndWeightId = distributionCosts?.area_and_weight_cost?.id;

        if (!areaAndWeightId) {
            handleMessage({
                type: 'error',
                message: t('errors.update_province_coverage_area'),
            });

            setIsLoading(false);
        } else {
            // Eliminate duplicated provinces
            const unCheckedProvinces_ = Array.from(new Set(unCheckedProvinces));
            const newSelectedProvinces_ = Array.from(
                new Set(newSelectedProvinces),
            );
            const selectedProvinces_ = Array.from(new Set(selectedProvinces));

            const res = await updateProvinceDistribution(
                unCheckedProvinces_,
                newSelectedProvinces_,
                selectedProvinces_,
                coverageAreaId,
                areaAndWeightId,
            );

            if (!res || res.status !== 200) {
                handleMessage({
                    type: 'error',
                    message: t('errors.update_province_coverage_area'),
                });

                setIsLoading(false);
                return;
            }

            handleMessage({
                type: 'success',
                message: t('success.update_province_coverage_area'),
            });

            queryClient.invalidateQueries('distribution');

            setUnCheckedProvinces([]);
            setNewSelectedProvinces([]);

            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    };

    const updateProvincesDistributionMutation = useMutation({
        mutationKey: 'updateProvincesDistribution',
        mutationFn: handleUpdatePronvicesDistribution,
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
            updateProvincesDistributionMutation.mutate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCheckbox = (
        e: React.ChangeEvent<HTMLInputElement>,
        province: string,
    ) => {
        // If the province is unchecked, add it to the list of unchecked provinces
        if (!e.target.checked) {
            setUnCheckedProvinces([...unCheckedProvinces, province]);
        } else {
            // If the province is checked, remove it from the list of unchecked provinces
            setUnCheckedProvinces(
                unCheckedProvinces.filter((province) => province !== province),
            );
        }

        // If the province has never been selected, add it to the list of selected provinces
        if (!provinces.includes(province)) {
            setNewSelectedProvinces([...newSelectedProvinces, province]);
        } else {
            // If the province has been selected, remove it from the list of selected provinces
            setNewSelectedProvinces(
                newSelectedProvinces.filter((item) => item !== province),
            );
        }

        // If the province is checked, add it to the list of selected provinces
        const updatedSelectedProvinces = e.target.checked
            ? [...selectedProvinces, province]
            : selectedProvinces.filter((item) => item !== province);

        setSelectedProvinces(updatedSelectedProvinces);
    };

    const handleSelectAllCurrentPage = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const listOfProvincesNames =
            tenProvinces?.map((province) => province.name) || [];

        const updatedSelectedProvinces = e.target.checked
            ? [...selectedProvinces, ...listOfProvincesNames]
            : selectedProvinces.filter(
                  (checkedProvince) =>
                      !listOfProvincesNames.includes(checkedProvince),
              );

        // Add to the list of new selected provinces all the provinces that are not already selected and are on the current page of the table
        const newSelectedProvinces = listOfProvincesNames.filter(
            (item) => !selectedProvinces.includes(item),
        );

        console.log(newSelectedProvinces);

        setNewSelectedProvinces(newSelectedProvinces);

        // If the user unchecks the select all checkbox, remove all the provinces that are on the current page of the table from the list of selected provinces
        if (!e.target.checked) {
            setUnCheckedProvinces([
                ...unCheckedProvinces,
                ...listOfProvincesNames,
            ]);
        }

        setSelectedProvinces(updatedSelectedProvinces);
        setSelectAllCurrentPage(e.target.checked);
    };

    // COMPROBAR COMO HACEMOS EL BORRADO Y LA INSERCIÓN DE PROVINCIAS EN EL ARRAY DE PROVINCIAS
    const handleSelectAllProvincesByRegion = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        let updatedSelectedProvinces = [...selectedProvinces];
        if (e.target.checked) {
            updatedSelectedProvinces.push(
                ...(listOfAllProvincesByRegion?.map(
                    (province) => province.name,
                ) ?? []),
            );
        } else {
            updatedSelectedProvinces = updatedSelectedProvinces.filter(
                (selectedProvince) =>
                    !listOfAllProvincesByRegion
                        ?.map((province) => province.name)
                        .includes(selectedProvince),
            );
        }

        setSelectedProvinces(updatedSelectedProvinces);
        setSelectAllProvincesByRegion(e.target.checked);
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
                            flex flex-col items-start space-y-4
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
                {selectedProvinces && selectedProvinces.length > 0 && (
                    <div className="flex flex-row flex-wrap space-x-2 space-y-1">
                        {selectedProvinces?.map(
                            (province: string, index: number) => {
                                // We can delete from the list one country just by clicking on it
                                return (
                                    <DistributionChipCard
                                        name={province}
                                        index={index}
                                        selectedNames={selectedProvinces}
                                        setSelectedNames={setSelectedProvinces}
                                    />
                                );
                            },
                        )}
                    </div>
                )}

                {/* List of provinces in the country  */}
                {tenProvinces && tenProvinces.length > 0 && (
                    <>
                        <div className="">
                            <label
                                htmlFor="allProvincesByRegion"
                                className="space-x-2 text-lg text-gray-600"
                            >
                                <input
                                    id="allProvincesByRegion"
                                    type="checkbox"
                                    onChange={(e) => {
                                        handleSelectAllProvincesByRegion(e);
                                    }}
                                    checked={selectAllProvincesByRegion}
                                    className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                                />

                                <span className="text-sm text-gray-600">
                                    {t('select_all_provinces_by_region')}
                                </span>
                            </label>
                        </div>

                        <div className="w-full">
                            {/* Display selectable table with all provinces in the country selected */}
                            <label
                                htmlFor="addressProvince"
                                className="text-sm text-gray-600"
                            >
                                {t('loc_province')}
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
                                            {t('province')}
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {tenProvinces?.map(
                                        (province: IState, index: number) => {
                                            const startIndex =
                                                currentPage * resultsPerPage;
                                            const globalIndex =
                                                startIndex + index;

                                            return (
                                                <tr
                                                    key={
                                                        province.name +
                                                        currentPage
                                                    }
                                                    className=""
                                                >
                                                    <ProvinceRow
                                                        province={province}
                                                        globalIndex={
                                                            globalIndex
                                                        }
                                                        selectedProvinces={
                                                            selectedProvinces
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
                    </>
                )}
            </div>
        </section>
    );
}

interface ProvinceRowProps {
    province: IState;
    globalIndex: number;
    selectedProvinces: string[];
    handleCheckbox: (
        e: React.ChangeEvent<HTMLInputElement>,
        name: string,
    ) => void;
    register: UseFormRegister<any>;
}

const ProvinceRow = ({
    province,
    globalIndex,
    handleCheckbox,
    register,
    selectedProvinces,
}: ProvinceRowProps) => {
    const isChecked = (province: IState) => {
        return selectedProvinces.includes(province.name);
    };

    return (
        <>
            <th
                scope="row"
                className="w-20 whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
            >
                <input
                    type="checkbox"
                    {...register(`provinces`)}
                    // {...register(`provinces.${globalIndex}.name`)}
                    // {...register(`provinces.${globalIndex}-${province.name}.name`)}
                    id={`provinces.${globalIndex}.${province.name}}`}
                    value={province.name}
                    checked={isChecked(province)}
                    onChange={(e) => {
                        handleCheckbox(e, province.name);
                    }}
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                />
            </th>

            <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
                {province.name}
            </td>
        </>
    );
};
