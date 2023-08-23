import PaginationFooter from "../../../../../../../components/common/PaginationFooter";
import useFetchAllCountries from "../useFetchAllCountries";
import useFetchStatesByCountry from "../useFetchStatesByCountry";
import useFetchCitiesOfState from "../useFetchCitiesOfState";
import React, { useEffect, useState } from "react";
import { Country, State, City, IState, ICity } from "country-state-city";
import { useForm, UseFormRegister } from "react-hook-form";
import { useSupabase } from "../../../../../../../components/Context/SupabaseProvider";
import { useMutation, useQueryClient } from "react-query";
import { Button, Spinner } from "../../../../../../../components/common";
import { useTranslations } from "next-intl";

interface ICountry {
  id: string;
  name: string;
  iso2: string;
}

interface IRegion {
  id: string;
  name: string;
  iso2: string;
}

type Props = {
  cities: string[];
};

interface FormData {
  country: string;
  region: string;
  cities: ICity[];
}

export default function CityDistribution({ cities }: Props) {
  const t = useTranslations();

  const [addressCountry, setAddressCountry] = useState<string>();
  const [addressRegion, setAddressRegion] = useState<string>();
  const [listOfRegions, setListOfRegions] = useState<IState[] | undefined>();
  const [listOfCities, setListOfCities] = useState<ICity[] | undefined>();
  const [regionIsEnable, setRegionIsEnable] = useState<boolean>(false);
  const [listOfAllCitiesByRegion, setListOfAllCitiesByRegion] = useState<
    ICity[] | undefined
  >();

  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectAllCurrentPage, setSelectAllCurrentPage] = useState(false);
  // rastrear si todas las ciudades de la región están seleccionadas, independientemente de la paginación
  const [selectAllCitiesByRegion, setSelectAllCitiesByRegion] = useState(false);

  const [isRegionLoading, setIsRegionLoading] = useState(false);

  const { refetch: getCountries } = useFetchAllCountries();

  const { refetch: getStates } = useFetchStatesByCountry({
    countryIsoCode: addressCountry ?? "ES",
  });

  const { refetch: getCities } = useFetchCitiesOfState({
    country: addressCountry ?? "ES",
    state: addressRegion ?? "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [counter, setCounter] = useState(0);
  const resultsPerPage = 10;

  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  const [countryData, setCountryData] = useState<ICountry[]>([]);

  const form = useForm<FormData>();

  const { handleSubmit, register } = form;

  // Get all the countries
  useEffect(() => {
    const getAllCountries = async () => {
      return await getCountries().then((res) => {
        const { data, error } = res;

        if (error) {
          console.error(error);
          return;
        }
        setCountryData(data ?? []);
      });
    };

    getAllCountries();

    const country = Country.getCountryByCode("ES");
    setAddressCountry(country?.iso2 ?? "");
  }, []);

  // Get all the states of selected country and set the first one as default in select input
  useEffect(() => {
    if (!addressCountry) return;

    const getStatesByCountry = async () => {
      return await getStates(addressCountry).then((res) => {
        const { data: regionData, error } = res;

        if (error) {
          console.error(error);
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
      return await getCities(addressCountry, addressRegion).then((res) => {
        const { data: cityData, error } = res;

        if (error) {
          console.error(error);
          return;
        }

        const startIndex = (currentPage - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;

        const lOfCities = cityData?.slice(startIndex, endIndex);

        setListOfCities(lOfCities);
        setCounter(cityData?.length);

        setListOfAllCitiesByRegion(cityData);

        // Update selectAllCurrentPage based on whether all cities on this page are selected
        setSelectAllCurrentPage(
          lOfCities?.every((city) => selectedCities.includes(city.name)) ??
            false
        );
      });
    };

    getCitiesByStateAndCountry();

    // // Update selectAllCities based on whether all cities in the region are selected
    // setSelectAllCitiesByRegion(
    //   listOfAllCitiesByRegion?.every((city) =>
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

  const handleUpdateCityDistribution = async (form: FormData) => {
    const { country, region, cities } = form;

    // Filter cities
    const filteredCities = cities.filter((city) => city.name);

    // const { data, error } = await supabase
    //   .from("city_distribution")
    //   .select("*")
    //   .eq("country", country)
    //   .eq("region", region);

    // if (error) {
    //   console.log(error);
    //   return;
    // }
  };

  const updateCityDistributionMutation = useMutation({
    mutationKey: "updateCityDistribution",
    mutationFn: handleUpdateCityDistribution,
    onMutate: () => {
      console.info("onMutate");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["distribution"] });
      console.info("onSuccess");
    },
    onError: () => {
      console.error("onError");
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
    city: string
  ) => {
    const updatedSelectedCities = e.target.checked
      ? [...selectedCities, city]
      : selectedCities.filter((item) => item !== city);

    setSelectedCities(updatedSelectedCities);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const listOfCityNames = listOfCities?.map((city) => city.name) || [];

    const updatedSelectedCities = e.target.checked
      ? [...selectedCities, ...listOfCityNames]
      : selectedCities.filter(
          (checkedCity) => !listOfCityNames.includes(checkedCity)
        );

    setSelectedCities(updatedSelectedCities);
    setSelectAllCurrentPage(e.target.checked);
  };

  const handleSelectAllCitiesByRegion = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let updatedSelectedCities = [...selectedCities];
    if (e.target.checked) {
      updatedSelectedCities.push(
        ...(listOfAllCitiesByRegion?.map((city) => city.name) ?? [])
      );
    } else {
      updatedSelectedCities = updatedSelectedCities.filter(
        (selectedCity) =>
          !listOfAllCitiesByRegion
            ?.map((city) => city.name)
            .includes(selectedCity)
      );
    }

    setSelectedCities(updatedSelectedCities);
    setSelectAllCitiesByRegion(e.target.checked);
  };

  return (
    <section className="space-y-4">
      <Button
        btnType="submit"
        onClick={handleSubmit(onSubmit)}
        class=""
        primary
        medium
      >
        {t("save")}
      </Button>

      {/* List with all cities selected  */}
      {/* <div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">{t("selected_cities")}</span>
          <span className="text-sm text-gray-600">{selectedCities.length}</span>
        </div>

        <div className="space-x-2">
          {selectedCities.length > 0 &&
            selectedCities.map((city) => (
              <span key={city} className="text-sm text-gray-600">
                {city}
              </span>
            ))}
        </div>
      </div> */}

      <div className="flex flex-col items-start space-y-4">
        <div className="grid w-full grid-cols-2 gap-4">
          <div>
            <label htmlFor="addressCountry" className="text-sm text-gray-600">
              {t("loc_country")}
            </label>

            {/* Display all countries  */}
            <select
              name="addressCountry"
              id="addressCountry"
              className=" w-full rounded-lg border-transparent bg-gray-100 px-4 py-2 text-base text-gray-700 focus:border-gray-500 focus:bg-white focus:ring-0"
              onChange={(e) => handleAddressCountry(e)}
              value={addressCountry}
            >
              <option key={"ES"} value={"ES"}>
                Spain
              </option>

              {countryData &&
                countryData.map((country: ICountry) => (
                  <option key={country.iso2} value={country.iso2}>
                    {country.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            {/* Display states of that country  */}
            <label htmlFor="addressRegion" className="text-sm text-gray-600">
              {t("loc_state")}
            </label>

            <select
              name="addressRegion"
              id="addressRegion"
              className={`w-full rounded-lg border-transparent bg-gray-100 px-4 py-2 text-base text-gray-700 focus:border-gray-500 focus:bg-white focus:ring-0`}
              disabled={regionIsEnable === false}
              onChange={(e) => handleAddressRegion(e.target.value)}
            >
              {listOfRegions?.map((state: IState) => (
                <option key={state.iso2} value={state.iso2}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Map with all cities in the country selected */}
        {/* <div className="w-full">
          <label htmlFor="addressCity" className="text-sm text-gray-600">
            {t("loc_city")}
          </label>

          <div className="h-96 w-full sm:h-full">
            <CityMap cities={cities} />
          </div>
        </div> */}

        {/* List of cities in the country  */}
        {isRegionLoading ? (
          <div className="w-full">
            <Spinner size={"medium"} color={"beer-blonde"} center />
          </div>
        ) : (
          <>
            {listOfCities &&
              listOfRegions &&
              listOfCities.length > 0 &&
              listOfRegions.length > 0 && (
                <>
                  <div className="">
                    <label
                      htmlFor="allCitiesByRegion"
                      className="space-x-2 text-lg text-gray-600"
                    >
                      <input
                        id="allCitiesByRegion"
                        type="checkbox"
                        onChange={(e) => {
                          handleSelectAllCitiesByRegion(e);
                        }}
                        checked={selectAllCitiesByRegion}
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                      />

                      <span className="text-sm text-gray-600">
                        {t("select_all_cities_by_region")}
                      </span>
                    </label>
                  </div>

                  <div className="w-full">
                    {/* Display selectable table with all cities in the country selected */}
                    <label
                      htmlFor="addressCity"
                      className="text-sm text-gray-600"
                    >
                      {t("loc_city")}
                    </label>

                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 ">
                      <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                handleSelectAll(e);
                              }}
                              checked={selectAllCurrentPage}
                              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                            />
                          </th>
                          <th scope="col" className="px-6 py-3">
                            {t("city")}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {listOfCities?.map((city: ICity, index: number) => {
                          const startIndex = (currentPage - 1) * resultsPerPage;
                          const globalIndex = startIndex + index;

                          return (
                            <tr
                              key={city.name + currentPage}
                              className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                            >
                              <>
                                <CityRow
                                  city={city}
                                  globalIndex={globalIndex}
                                  selectedCities={selectedCities}
                                  handleCheckbox={handleCheckbox}
                                  register={register}
                                />
                              </>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <PaginationFooter
                      counter={counter}
                      resultsPerPage={resultsPerPage}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                    />

                    {/* 
                    {errors.addressCountry?.type === "required" && (
                      <DisplayInputError message="errors.input_required" />
                    )} 
                    */}
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
    name: string
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
          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
        />
      </th>

      <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
        {city.name}
      </td>
    </>
  );
};
