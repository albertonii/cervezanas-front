import PaginationFooter from "../../../../../../../components/common/PaginationFooter";
import React, { useEffect, useState } from "react";
import { Country, State, ICountry, IState } from "country-state-city";
import { useForm } from "react-hook-form";
import { useSupabase } from "../../../../../../../components/Context/SupabaseProvider";
import { useMutation, useQueryClient } from "react-query";
import { Button, Spinner } from "../../../../../../../components/common";
import { useTranslations } from "next-intl";
import useFetchStatesByCountry from "../useFetchStatesByCountry";

type Props = {
  provinces: string[];
};

interface FormData {
  country: string;
  region: string;
  provinces: IState[];
}

export default function ProvinceDistribution({ provinces }: Props) {
  const t = useTranslations();

  const [addressCountry, setAddressCountry] = useState<string>();
  const [listOfProvinces, setListOfProvinces] = useState<
    IState[] | undefined
  >();
  const [listOfAllProvincesByRegion, setListOfAllProvincesByRegion] = useState<
    IState[] | undefined
  >();

  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectAllCurrentPage, setSelectAllCurrentPage] = useState(false);
  // rastrear si todas las ciudades de la región están seleccionadas, independientemente de la paginación
  const [selectAllProvincesByRegion, setSelectAllProvincesByRegion] =
    useState(false);

  const [isRegionLoading, setIsRegionLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [counter, setCounter] = useState(0);
  const resultsPerPage = 10;

  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  const countryData = Country.getAllCountries();

  const form = useForm<FormData>();

  const { handleSubmit, register } = form;

  const { refetch } = useFetchStatesByCountry({
    countryIsoCode: addressCountry ?? "ES",
  });

  useEffect(() => {
    const country = Country.getCountryByCode("ES");
    setAddressCountry(country?.isoCode ?? "");
  }, []);

  useEffect(() => {
    if (!addressCountry) return;

    const getProvinceData = async () => {
      return await refetch().then((res) => {
        const { data, error } = res;

        if (error) {
          console.error(error);
          return;
        }

        const startIndex = (currentPage - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        const lOfProvinces = data?.slice(startIndex, endIndex);

        setListOfAllProvincesByRegion(data ?? []);
        setCounter(data?.length ?? 0);

        setListOfProvinces(lOfProvinces);
      });
    };

    // const provinceData = State.getStatesOfCountry(addressCountry);
    getProvinceData().then();
  }, [addressCountry]);

  useEffect(() => {
    if (!listOfAllProvincesByRegion) return;

    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;

    const lOfProvinces = listOfAllProvincesByRegion.slice(startIndex, endIndex);

    setListOfProvinces(lOfProvinces);

    // // Update selectAllCurrentPage based on whether all provinces on this page are selected
    // setSelectAllCurrentPage(
    //   lOfProvinces?.every((province) =>
    //     selectedProvinces.includes(province.name)
    //   ) ?? false
    // );
  }, [currentPage]);

  const handleAddressRegion = (e: any) => {
    setIsRegionLoading(true);

    setTimeout(() => {
      //   setAddressRegion(e);
      setCurrentPage(1);
      setIsRegionLoading(false);
    }, 500);
  };

  const handleAddressCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAddressCountry(e.target.value);
    setListOfProvinces([]);
  };

  const handleUpdateCityDistribution = async (form: FormData) => {
    const { country, region, provinces } = form;

    // Filter provinces
    const filteredProvinces = provinces.filter((province) => province.name);

    // const { data, error } = await supabase
    //   .from("province_distribution")
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
    province: string
  ) => {
    const updatedSelectedProvinces = e.target.checked
      ? [...selectedProvinces, province]
      : selectedProvinces.filter((item) => item !== province);

    setSelectedProvinces(updatedSelectedProvinces);
  };

  const isChecked = (province: IState) => {
    return selectedProvinces.includes(province.name);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const listOfCityNames =
      listOfProvinces?.map((province) => province.name) || [];

    const updatedSelectedProvinces = e.target.checked
      ? [...selectedProvinces, ...listOfCityNames]
      : selectedProvinces.filter(
          (checkedCity) => !listOfCityNames.includes(checkedCity)
        );

    setSelectedProvinces(updatedSelectedProvinces);
    setSelectAllCurrentPage(e.target.checked);
  };

  const handleSelectAllProvincesByRegion = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let updatedSelectedProvinces = [...selectedProvinces];
    if (e.target.checked) {
      updatedSelectedProvinces.push(
        ...(listOfAllProvincesByRegion?.map((province) => province.name) ?? [])
      );
    } else {
      updatedSelectedProvinces = updatedSelectedProvinces.filter(
        (selectedCity) =>
          !listOfAllProvincesByRegion
            ?.map((province) => province.name)
            .includes(selectedCity)
      );
    }

    setSelectedProvinces(updatedSelectedProvinces);
    setSelectAllProvincesByRegion(e.target.checked);
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

              {countryData.map((country: ICountry) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* List of provinces in the country  */}
        {isRegionLoading ? (
          <div className="w-full">
            <Spinner size={"medium"} color={"beer-blonde"} center />
          </div>
        ) : (
          <>
            {listOfProvinces && listOfProvinces.length > 0 && (
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
                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                    />

                    <span className="text-sm text-gray-600">
                      {t("select_all_provinces_by_region")}
                    </span>
                  </label>
                </div>

                <div className="w-full">
                  {/* Display selectable table with all provinces in the country selected */}
                  <label
                    htmlFor="addressCity"
                    className="text-sm text-gray-600"
                  >
                    {t("loc_province")}
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
                          {t("province")}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {listOfProvinces?.map(
                        (province: IState, index: number) => {
                          const startIndex = (currentPage - 1) * resultsPerPage;
                          const globalIndex = startIndex + index;

                          return (
                            <tr
                              key={province.name}
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
                                    {...register(
                                      `provinces.${globalIndex}.name`
                                    )}
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
                            </tr>
                          );
                        }
                      )}
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
