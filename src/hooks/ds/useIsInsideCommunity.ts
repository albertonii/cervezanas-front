"use client";

import { useQuery } from "react-query";
import { API_METHODS, DS_API } from "../../constants";

const isInsideCommunity = async (
  community: string,
  lat: string,
  lng: string
) => {
  const ds_url = DS_API.DS_URL + DS_API.DS_COMMUNITIES + community;
  const data = fetch(`${ds_url}/inside?lat=${lat}&lng=${lng}`, {
    method: API_METHODS.GET,
  }).then((res) => console.log(res));

  return data;
};

const useIsInsideCommunity = (community: string, lat: string, lng: string) => {
  return useQuery({
    queryKey: ["isInsideCommunity", community, lat, lng],
    queryFn: () => isInsideCommunity(community, lat, lng),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useIsInsideCommunity;
