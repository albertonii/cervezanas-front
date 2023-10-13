"use client";

import { useQuery } from "react-query";

const isInsideCommunity = async (
  community: string,
  lat: string,
  lng: string
) => {
  const data = fetch(
    `https://distributionsystemapi-soyd-dev.fl0.io/communities/${community}/inside?lat=${lat}&lng=${lng}`,
    {
      method: "GET",
    }
  ).then((res) => console.log(res));

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
