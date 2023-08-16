import CityMap from "./CityMap";
import PaginationFooter from "../../../../../../../components/common/PaginationFooter";
import React, { useEffect, useState } from "react";
import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from "country-state-city";
import { useForm } from "react-hook-form";
import { useSupabase } from "../../../../../../../components/Context/SupabaseProvider";
import { useMutation, useQueryClient } from "react-query";
import { Button, Spinner } from "../../../../../../../components/common";
import { useTranslations } from "next-intl";

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
  const [addressRegion, setAddressRegion] = useState<string>("");
  const [listOfRegions, setListOfRegions] = useState<IState[] | undefined>();
  const [listOfCities, setListOfCities] = useState<ICity[] | undefined>();
  const [regionIsEnable, setRegionIsEnable] = useState<boolean>(false);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  const [isRegionLoading, setIsRegionLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [counter, setCounter] = useState(0);
  const resultsPerPage = 10;

  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  const countryData = Country.getAllCountries();

  const form = useForm<FormData>();

  const { handleSubmit, register } = form;

  useEffect(() => {
    const regionData = State.getStatesOfCountry(addressCountry);
    setListOfRegions(regionData);
    setRegionIsEnable(regionData.length > 0);
  }, [addressCountry]);

  useEffect(() => {
    if (!addressCountry || !addressRegion) return;
    const cityData = City.getCitiesOfState(addressCountry, addressRegion);
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    setListOfCities(cityData.slice(startIndex, endIndex));
    setCounter(cityData.length);
  }, [addressRegion, currentPage]);

  // useEffect(() => {
  //   setListOfCities([]);
  // }, [currentPage]);

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
      console.log("onMutate");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["distribution"] });
      console.log("onSuccess");
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
    if (e.target.checked) {
      setSelectedCities([...selectedCities, city]);
    } else {
      setSelectedCities(selectedCities.filter((item) => item !== city));
    }
  };

  const isChecked = (city: ICity) => {
    return selectedCities?.includes(city.name);
  };

  return (
    <section>
      <Button
        btnType="submit"
        onClick={handleSubmit(onSubmit)}
        class=""
        primary
        medium
      >
        {t("save")}
      </Button>

      <div className="flex flex-col items-end space-x-3 space-y-4">
        <div className="grid w-full grid-cols-2 gap-4">
          <div>
            <label htmlFor="addressCountry" className="text-sm text-gray-600">
              {t("loc_country")}
            </label>

            {/* Display all countries  */}
            <select
              name="addressCountry"
              id="addressCountry"
              className="mt-2 w-full rounded-lg border-transparent bg-gray-100 px-4 py-2 text-base text-gray-700 focus:border-gray-500 focus:bg-white focus:ring-0"
              onChange={(e) => handleAddressCountry(e)}
            >
              <option key={"ES"} value={"ES"}>
                Spain
              </option>

              <span className="h-2" />

              {countryData.map((country: ICountry) => (
                <option key={country.isoCode} value={country.isoCode}>
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
              className={`mt-2 w-full rounded-lg border-transparent bg-gray-100 px-4 py-2 text-base text-gray-700 focus:border-gray-500 focus:bg-white focus:ring-0`}
              disabled={regionIsEnable === false}
              onChange={(e) => handleAddressRegion(e.target.value)}
            >
              {listOfRegions?.map((state: IState) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Map with all cities in the country selected */}
        <div className="w-full">
          <label htmlFor="addressCity" className="text-sm text-gray-600">
            {t("loc_city")}
          </label>

          <div className="h-96 w-full sm:h-full">
            <CityMap cities={cities} />
          </div>
        </div>

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
                            {t("select")}
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
                              key={city.name}
                              className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                            >
                              <>
                                <th
                                  scope="row"
                                  className="w-20 whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                                >
                                  <input
                                    id={
                                      `checkbox-item-${globalIndex}` as string
                                    }
                                    type="checkbox"
                                    {...register(`cities.${globalIndex}.name`)}
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
          )} */}
                  </div>
                </>
              )}
          </>
        )}
      </div>
    </section>
  );
}
