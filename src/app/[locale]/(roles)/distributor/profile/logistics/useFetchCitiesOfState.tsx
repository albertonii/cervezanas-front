"use client";

import { ICity } from "country-state-city";
import { useQuery } from "react-query";

const headers = new Headers();
headers.append(
  "X-CSCAPI-KEY",
  process.env.NEXT_PUBLIC_COUNTRY_STATE_CITY_API_KEY ?? ""
);

const requestOptions = {
  method: "GET",
  headers: headers,
};

const fetchCitiesOfState = async (country: string, state: string) => {
  const res = await fetch(
    `https://api.countrystatecity.in/v1/countries/${country}/states/${state}/cities`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      const cities: ICity[] = JSON.parse(result);
      return cities.sort((a: ICity, b: ICity) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente
    })
    .catch((error) => console.error("error", error));
  return res;
};

interface Props {
  state: string;
}

const useFetchCitiesOfState = ({ country, state }: Props) => {
  return useQuery({
    queryKey: ["citiesOfState", country, state],
    queryFn: () => fetchCitiesOfState(country, state),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchCitiesOfState;
