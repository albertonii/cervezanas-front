import PaginationFooter from "../../../../../components/common/PaginationFooter";
import useFetchAllCountries from "../useFetchAllCountries";
import React, { useEffect, useState } from "react";
import { useForm, UseFormRegister } from "react-hook-form";
import { useSupabase } from "../../../../../../../context/SupabaseProvider";
import { useMutation, useQueryClient } from "react-query";
import { Button } from "../../../../../components/common";
import { useTranslations } from "next-intl";

interface ICountry {
  id: string;
  name: string;
  iso2: string;
}

type Props = {
  countries: string[];
  coverageAreaId: string;
};

interface FormData {
  country: string;
  region: string;
  countrys: ICountry[];
}

export default function InternationalDistribution({
  countries,
  coverageAreaId,
}: Props) {
  const t = useTranslations();

  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [listOfCountries, setListOfCountries] = useState<ICountry[]>([]);
  const [tenCountries, setTenCountries] = useState<ICountry[]>([]);

  const [selectAllCurrentPage, setSelectAllCurrentPage] = useState(false);

  const [selectAllCountries, setSelectAllCountries] = useState(false); // rastrear si todaslas ciudades de la región están seleccionadas, independientemente de la paginación

  const [currentPage, setCurrentPage] = useState(1);
  const [counter, setCounter] = useState(0);
  const resultsPerPage = 10;

  const { supabase } = useSupabase();
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
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const lOfCountries = listOfCountries?.slice(startIndex, endIndex);
    setTenCountries(lOfCountries);

    // Update selectAllCurrentPage based on whether all countrys on this page are selected
    setSelectAllCurrentPage(
      lOfCountries?.every((country) =>
        selectedCountries.includes(country.name)
      ) ?? false
    );
  }, [currentPage]);

  const handleUpdateInternationalDistribution = async () => {
    // const { error } = await supabase
    //   .from("coverage_areas")
    //   .update({ countrys: selectedCountrys })
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
    const tenCountries_aux = tenCountries?.map((country) => country.name) || [];

    const updatedSelectedCountrys = e.target.checked
      ? [...selectedCountries, ...tenCountries_aux]
      : selectedCountries.filter(
          (checkedCountry) => !tenCountries_aux.includes(checkedCountry)
        );

    setSelectedCountries(updatedSelectedCountrys);
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

        {/* List of countrys in the country  */}
        {tenCountries && tenCountries.length > 0 && (
          <>
            <div className="">
              <label
                htmlFor="allCountries"
                className="space-x-2 text-lg text-gray-600"
              >
                <input
                  id="allCountrysByRegion"
                  type="checkbox"
                  onChange={(e) => {
                    handleSelectAllCountries(e);
                  }}
                  checked={selectAllCountries}
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                />

                <span className="text-sm text-gray-600">
                  {t("select_all_countrys_by_region")}
                </span>
              </label>
            </div>

            <div className="w-full">
              {/* Display selectable table with all countrys in the country selected */}
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
