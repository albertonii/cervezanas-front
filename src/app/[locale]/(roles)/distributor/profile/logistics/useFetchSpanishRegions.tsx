'use client';

import { useQuery } from 'react-query';
import { API_METHODS } from '../../../../../../constants';

const requestOptions = {
    method: API_METHODS.GET,
    //   redirect: "follow",
};

const fetchSpanishRegions = async () => {
    const res = await fetch(
        `https://distributionsystemapi.onrender.com/communities/json/spain`,
        requestOptions,
    )
        .then((response) => response.text())
        .then((result) => {
            const regions: { id: string; name: string }[] = JSON.parse(result);
            return regions;
        })
        .catch((error) => console.error('error', error));
    return res;
};

const useFetchSpanishRegions = () => {
    return useQuery({
        queryKey: ['spanishRegions'],
        queryFn: () => fetchSpanishRegions(),
        enabled: false,
        refetchOnWindowFocus: false,
    });
};

export default useFetchSpanishRegions;
