import useFetchAllCountries from "../useFetchAllCountries";
import PaginationFooter from "../../../../../components/common/PaginationFooter";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "react-query";
import { useForm, UseFormRegister } from "react-hook-form";
import { ICountry } from "country-state-city/lib/interface";
import { Button } from "../../../../../components/common/Button";
import InputSearch from "../../../../../components/common/InputSearch";
import { filterSearchInputQuery } from "../../../../../../../utils/utils";

// interface ICountry {
//   id: string;
//   name: string;
//   isoCode: string;
// }

type Props = {
  countries: string[];
  coverageAreaId: string;
};

export default function EuropeDistribution({ coverageAreaId }: Props) {
  const t = useTranslations();

  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [listOfCountries, setListOfCountries] = useState<ICountry[]>([]);
  const [tenCountries, setTenCountries] = useState<ICountry[]>([]);

  const [selectAllCurrentPage, setSelectAllCurrentPage] = useState(false);

  const [selectAllCountries, setSelectAllCountries] = useState(false); // rastrear si todaslas ciudades de la región están seleccionadas, independientemente de la paginación

  const [currentPage, setCurrentPage] = useState(1);
  const [counter, setCounter] = useState(0);
  const resultsPerPage = 20;

  const [query, setQuery] = useState("");

  const queryClient = useQueryClient();

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

    const lOfCountries = filterSearchInputQuery(
      listOfCountries,
      query,
      currentPage,
      resultsPerPage
    );
    setTenCountries(lOfCountries);

    // Update selectAllCurrentPage based on whether all countries on this page are selected
    setSelectAllCurrentPage(
      lOfCountries?.every((country) =>
        selectedCountries.includes(country.name)
      ) ?? false
    );
  }, [currentPage]);

  useEffect(() => {
    if (!listOfCountries) return;

    const lAllCountries = filterSearchInputQuery(
      listOfCountries,
      query,
      currentPage,
      resultsPerPage
    );

    setTenCountries(lAllCountries);
  }, [query]);

  const handleUpdateInternationalDistribution = async () => {
    // const { error } = await supabase
    //   .from("coverage_areas")
    //   .update({ countries: selectedCountries })
    //   .eq("id", coverageAreaId);
    // if (error) {
    //   console.log(error);
    //   return;
    // }
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
    const lOfCountries = listOfCountries?.map((country) => country.name) || [];

    const updatedSelectedCountries = e.target.checked
      ? [...selectedCountries, ...lOfCountries]
      : selectedCountries.filter(
          (checkedCountry) => !lOfCountries.includes(checkedCountry)
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

      <div className="flex flex-col items-start space-y-4">
        <div className="grid w-full grid-cols-2 gap-4">
          <div>
            <label htmlFor="addressCountry" className="text-sm text-gray-600">
              {t("loc_country")}
            </label>
          </div>
        </div>

        <InputSearch
          query={query}
          setQuery={setQuery}
          searchPlaceholder={"search_by_name"}
        />

        {/* List of countries in the country  */}
        {tenCountries && tenCountries.length > 0 && (
          <>
            <div className="">
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
                  {t("select_all_countries")}
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
