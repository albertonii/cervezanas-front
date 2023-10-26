import Loading from "../../../../../loading";
import useFetchStatesByCountry from "../useFetchStatesByCountry";
import PaginationFooter from "../../../../../components/common/PaginationFooter";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "react-query";
import { useForm, UseFormRegister } from "react-hook-form";
import { Country, ICountry, IState } from "country-state-city";
import { Button } from "../../../../../components/common/Button";
import { useAuth } from "../../../../../Auth/useAuth";

type Props = {
  provinces: string[];
  coverageAreaId: string;
};

interface FormData {
  country: string;
  region: string;
  provinces: IState[];
}

export default function ProvinceDistribution({
  provinces,
  coverageAreaId,
}: Props) {
  const t = useTranslations();

  const [isLoading, setIsLoading] = useState(false);

  const [addressCountry, setAddressCountry] = useState<string>();
  const [tenProvinces, setTenProvinces] = useState<IState[] | undefined>([]);
  const [listOfAllProvincesByRegion, setListOfAllProvincesByRegion] = useState<
    IState[] | undefined
  >([]);

  const [selectedProvinces, setSelectedProvinces] =
    useState<string[]>(provinces);
  const [selectAllCurrentPage, setSelectAllCurrentPage] = useState(false);

  const [selectAllProvincesByRegion, setSelectAllProvincesByRegion] =
    useState(false); // rastrear si todaslas ciudades de la región están seleccionadas, independientemente de la paginación

  const [currentPage, setCurrentPage] = useState(1);
  const [counter, setCounter] = useState(0);
  const resultsPerPage = 10;

  const { supabase } = useAuth();
  const queryClient = useQueryClient();

  const countryData = Country.getAllCountries();

  const form = useForm<FormData>();

  const { handleSubmit, register } = form;

  const { refetch } = useFetchStatesByCountry(addressCountry ?? "ES");

  useEffect(() => {
    const country = Country.getCountryByCode("ES") as ICountry;
    setAddressCountry(country.isoCode ?? "");
  }, []);

  useEffect(() => {
    if (!addressCountry) return;

    const getProvinceData = async () => {
      return await refetch().then((res) => {
        const { data: provinceData, error } = res;

        if (error) {
          console.error(error);
          return;
        }

        const startIndex = (currentPage - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;

        const lOfProvinces = provinceData?.slice(startIndex, endIndex);

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

    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;

    const lOfProvinces = listOfAllProvincesByRegion?.slice(
      startIndex,
      endIndex
    );
    setTenProvinces(lOfProvinces);

    // Update selectAllCurrentPage based on whether all provinces on this page are selected
    setSelectAllCurrentPage(
      lOfProvinces?.every((province) =>
        selectedProvinces.includes(province.name)
      ) ?? false
    );
  }, [currentPage]);

  const handleAddressCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAddressCountry(e.target.value);
    setTenProvinces([]);
  };

  const handleUpdatePronvicesDistribution = async () => {
    const { error } = await supabase
      .from("coverage_areas")
      .update({ provinces: selectedProvinces })
      .eq("id", coverageAreaId);

    if (error) {
      console.error(error);
      return;
    }
  };

  const updateProvincesDistributionMutation = useMutation({
    mutationKey: "updateProvincesDistribution",
    mutationFn: handleUpdatePronvicesDistribution,
    onMutate: () => {
      console.info("onMutate");
      setIsLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["distribution"] });
      console.info("onSuccess");
      setIsLoading(false);
    },
    onError: () => {
      console.error("onError");
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
    province: string
  ) => {
    const updatedSelectedProvinces = e.target.checked
      ? [...selectedProvinces, province]
      : selectedProvinces.filter((item) => item !== province);

    setSelectedProvinces(updatedSelectedProvinces);
  };

  const handleSelectAllCurrentPage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const listOfCityNames =
      tenProvinces?.map((province) => province.name) || [];

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
    setSelectAllCurrentPage(e.target.checked);
  };

  return (
    <section className="space-y-4">
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
            {t("save")}
          </Button>

          <div className="flex flex-col items-start space-y-4">
            <div className="grid w-full grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="addressCountry"
                  className="text-sm text-gray-600"
                >
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
                          {t("province")}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {tenProvinces?.map((province: IState, index: number) => {
                        const startIndex = currentPage * resultsPerPage;
                        const globalIndex = startIndex + index;

                        return (
                          <tr
                            key={province.name + currentPage}
                            className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                          >
                            <ProvinceRow
                              province={province}
                              globalIndex={globalIndex}
                              selectedProvinces={selectedProvinces}
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
        </>
      )}
    </section>
  );
}

interface ProvinceRowProps {
  province: IState;
  globalIndex: number;
  selectedProvinces: string[];
  handleCheckbox: (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
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
