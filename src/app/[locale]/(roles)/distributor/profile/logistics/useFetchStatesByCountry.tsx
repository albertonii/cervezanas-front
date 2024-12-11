'use client';

import { useQuery } from 'react-query';
import { API_METHODS } from '@/constants';
import { IState } from '@/lib/types/distribution_areas';

const headers = new Headers();
headers.append(
    'X-CSCAPI-KEY',
    process.env.NEXT_PUBLIC_COUNTRY_STATE_CITY_API_KEY ?? '',
);

const requestOptions = {
    method: API_METHODS.GET,
    headers: headers,
    //   redirect: "follow",
};

const fetchStatesByCountry = async (countryIsoCode: string) => {
    const res = await fetch(
        `https://api.countrystatecity.in/v1/countries/${countryIsoCode}/states`,
        requestOptions,
    )
        .then((response) => response.text())
        .then((result) => {
            const states: IState[] = JSON.parse(result);
            return states.sort((a: IState, b: IState) =>
                a.name.localeCompare(b.name),
            ); // Ordenar alfabéticamente
        })
        .catch((error) => console.error('error', error));
    return res;
};

const useFetchStatesByCountry = (countryIsoCode: string) => {
    return useQuery({
        queryKey: 'statesByCountry',
        queryFn: () => fetchStatesByCountry(countryIsoCode),
        enabled: false,
        refetchOnWindowFocus: false,
    });
};

export default useFetchStatesByCountry;
