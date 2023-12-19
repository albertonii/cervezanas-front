import useFetchAllCountries from "../useFetchAllCountries";
import { useForm, UseFormRegister } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { ICountry } from "country-state-city/lib/interface";
import { filterSearchInputQuery } from "../../../../../../../utils/utils";
import { useAuth } from "../../../../../Auth/useAuth";
import { Button } from "../../../../../components/common/Button";
import { useMessage } from "../../../../../components/message/useMessage";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import InputSearch from "../../../../../components/common/InputSearch";
import PaginationFooter from "../../../../../components/common/PaginationFooter";

type Props = {
  countries: string[];
  coverageAreaId: string;
};

export default function InternationalDistributionPlaces({
  countries,
  coverageAreaId,
}: Props) {
  const t = useTranslations();

  const submitSuccessMessage = t("messages.submit_success");
  const submitErrorMessage = t("messages.submit_error");

  const { handleMessage } = useMessage();

  const { supabase } = useAuth();

  const [selectAllCurrentPage, setSelectAllCurrentPage] = useState(false);

  const [selectAllCountries, setSelectAllCountries] = useState(false); // rastrear si todaslas ciudades de la región están seleccionadas, independientemente de la paginación

  const [currentPage, setCurrentPage] = useState(1);
  const [counter, setCounter] = useState(0);
  const resultsPerPage = 20;

  const [query, setQuery] = useState("");

  const queryClient = useQueryClient();

  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    countries ?? []
  );
  const [listOfCountries, setListOfCountries] = useState<ICountry[]>([]);
  const [tenCountries, setTenCountries] = useState<ICountry[]>([]);

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
        setTenCountries(lOfCountries);
      });
    };

    getCountries();
  }, []);

  useEffect(() => {
    if (!listOfCountries) return;
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const lOfCountries = listOfCountries?.slice(startIndex, endIndex);
    setTenCountries(lOfCountries);

    // Update selectAllCurrentPage based on whether all countries on this page are selected
    setSelectAllCurrentPage(
      lOfCountries?.every((country) =>
        selectedCountries.includes(country.name)
      ) ?? false
    );
  }, [currentPage]);

  useEffect(() => {
    const lOfCountries = filterSearchInputQuery(
      listOfCountries,
      query,
      currentPage,
      resultsPerPage
    );

    setTenCountries(lOfCountries);
  }, [query]);

  const handleUpdateInternationalDistribution = async () => {
    const { error } = await supabase
      .from("coverage_areas")
      .update({ international: selectedCountries })
      .eq("id", coverageAreaId);
    if (error) {
      console.log(error);

      handleMessage({
        type: "error",
        message: submitErrorMessage,
      });

      return;
    }

    handleMessage({
      type: "success",
      message: submitSuccessMessage,
    });
  };

  const updateInternationalDistributionMutation = useMutation({
    mutationKey: "updateInternationalDistribution",
    mutationFn: handleUpdateInternationalDistribution,
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

  const onSubmit = () => {
    try {
      updateInternationalDistributionMutation.mutate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckbox = (
    e: React.ChangeEvent<HTMLInputElement>,
    country: string
  ) => {
    const updatedSelectedCountries = e.target.checked
      ? [...selectedCountries, country]
      : selectedCountries.filter((item) => item !== country);

    setSelectedCountries(updatedSelectedCountries);
  };

  const handleSelectAllCurrentPage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const tenCountries_aux = tenCountries?.map((country) => country.name) || [];

    const updatedSelectedCountries = e.target.checked
      ? [...selectedCountries, ...tenCountries_aux]
      : selectedCountries.filter(
          (checkedCountry) => !tenCountries_aux.includes(checkedCountry)
        );

    setSelectedCountries(updatedSelectedCountries);
    setSelectAllCurrentPage(e.target.checked);
  };

  const handleSelectAllCountries = (e: React.ChangeEvent<HTMLInputElement>) => {
    let updatedSelectedCountries = [...selectedCountries];
    if (e.target.checked) {
      updatedSelectedCountries.push(
        ...(listOfCountries?.map((country) => country.name) ?? [])
      );
    } else {
      updatedSelectedCountries = updatedSelectedCountries.filter(
        (selectedCountry) =>
          !listOfCountries
            ?.map((country) => country.name)
            .includes(selectedCountry)
      );
    }

    setSelectedCountries(updatedSelectedCountries);
    setSelectAllCountries(e.target.checked);
    setSelectAllCurrentPage(e.target.checked);
  };

  return (
    <section className="flex flex-col items-start space-y-4">
      <Button
        btnType="submit"
        onClick={handleSubmit(onSubmit)}
        class=""
        primary
        medium
      >
        {t("save")}
      </Button>

      <label htmlFor="addressCountry" className="text-xl text-gray-600">
        {t("loc_country")}
      </label>

      <InputSearch
        query={query}
        setQuery={setQuery}
        searchPlaceholder={"search_by_name"}
      />

      {/* Names of the countries selected by the distributor  */}
      {selectedCountries && selectedCountries.length > 0 && (
        <div className="w-full">
          {/* Minimal and elegant Display the names of the countries  */}
          <div className="flex flex-row flex-wrap space-x-2 space-y-1">
            {selectedCountries?.map((country: string, index: number) => {
              // We can delete from the list one country just by clicking on it
              return (
                <span
                  key={country + index}
                  className="flex rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-600 hover:bg-gray-200"
                >
                  {country}

                  <figure
                    className="ml-2 hover:cursor-pointer "
                    onClick={() => {
                      setSelectedCountries(
                        selectedCountries.filter(
                          (selectedCountry) => selectedCountry !== country
                        )
                      );
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="hover:text-bold h-4 w-4 text-gray-600 transition-all hover:scale-150 hover:text-red-700"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.707 10l4.147-4.146a.5.5 0 10-.708-.708L10 9.293 5.854 5.146a.5.5 0 10-.708.708L9.293 10l-4.147 4.146a.5.5 0 00.708.708L10 10.707l4.146 4.147a.5.5 0 00.708-.708L10.707 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </figure>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* List of countries in the country  */}
      {tenCountries && tenCountries.length > 0 && (
        <>
          <div>
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
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
              />

              <span className="text-sm text-gray-600">
                {t("select_all_countries_by_region")}
              </span>
            </label>
          </div>

          <div className="w-full">
            {/* Display selectable table with all countries in the country selected */}
            <label htmlFor="addressCountry" className="text-sm text-gray-600">
              {t("loc_country")}
            </label>

            <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400 ">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        handleSelectAllCurrentPage(e);
                      }}
                      checked={selectAllCurrentPage}
                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                    />
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t("country")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {tenCountries?.map((country: any, index: number) => {
                  const startIndex = currentPage * resultsPerPage;
                  const globalIndex = startIndex + index;

                  return (
                    <tr
                      key={country.name + currentPage}
                      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <CountryRow
                        country={country}
                        globalIndex={globalIndex}
                        selectedCountries={selectedCountries}
                        handleCheckbox={handleCheckbox}
                        register={register}
                      />
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
          </div>
        </>
      )}
    </section>
  );
}

interface CountryRowProps {
  country: ICountry;
  globalIndex: number;
  selectedCountries: string[];
  handleCheckbox: (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
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
    return selectedCountries.includes(country.name);
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

      <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
        {country.name}
      </td>
    </>
  );
};
