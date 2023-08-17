"use client";

import { IState } from "country-state-city";
import { useQuery } from "react-query";

const headers = new Headers();
headers.append(
  "X-CSCAPI-KEY",
  process.env.NEXT_PUBLIC_COUNTRY_STATE_CITY_API_KEY ?? ""
);

const requestOptions = {
  method: "GET",
  headers: headers,
  //   redirect: "follow",
};

const fetchStatesByCountry = async (countryIsoCode: string) => {
  const res = await fetch(
    `https://api.countrystatecity.in/v1/countries/${countryIsoCode}/states`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      const states: IState[] = JSON.parse(result);
      return states.sort((a: IState, b: IState) =>
        a.name.localeCompare(b.name)
      ); // Ordenar alfabéticamente
    })
    .catch((error) => console.error("error", error));
  return res;
};

interface Props {
  countryIsoCode: string;
}

const useFetchStatesByCountry = ({ countryIsoCode }: Props) => {
  return useQuery({
    queryKey: ["statesByCountry"],
    queryFn: () => fetchStatesByCountry(countryIsoCode),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchStatesByCountry;
