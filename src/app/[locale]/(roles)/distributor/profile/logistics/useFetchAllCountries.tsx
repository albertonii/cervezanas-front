"use client";

import { ICountry } from "country-state-city/lib/interface";
import { useQuery } from "react-query";

// interface ICountry {
//   id: string;
//   name: string;
//   isoCode: string;
// }

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

const fetchAllCountries = async () => {
  const res = await fetch(
    `https://api.countrystatecity.in/v1/countries`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      const states: ICountry[] = JSON.parse(result);
      return states.sort((a: ICountry, b: ICountry) =>
        a.name.localeCompare(b.name)
      ); // Ordenar alfabéticamente
    })
    .catch((error) => console.error("error", error));
  return res;
};

const useFetchAllCountries = () => {
  return useQuery({
    queryKey: ["allCountries"],
    queryFn: () => fetchAllCountries(),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchAllCountries;
