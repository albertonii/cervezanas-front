"use client";

import React, { ComponentProps, useEffect, useState } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import "@reach/combobox/styles.css";

import usePlacesAutocomplete, {
  GeocodeResult,
  getGeocode,
  getLatLng,
  LatLng,
} from "use-places-autocomplete";
import { useTranslations } from "next-intl";

const containerStyle = {
  height: "400px",
  borderRadius: "5px",
};

interface Props {
  defaultLocation?: string;
  defaultGeoArgs?: GeocodeResult[];
  handleAddress: ComponentProps<any>;
}

export default function CPGoogleMap({
  defaultLocation,
  defaultGeoArgs,
  handleAddress,
}: Props) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <Map
      defaultLocation={defaultLocation}
      defaultGeoArgs={defaultGeoArgs}
      handleAddress={handleAddress}
    />
  );
}

function Map({ defaultGeoArgs, defaultLocation, handleAddress }: Props) {
  const geometry: google.maps.GeocoderGeometry | undefined =
    defaultGeoArgs?.[0]?.geometry;

  const location: any = geometry?.location;

  const latLng: LatLng = {
    lat: location?.lat ?? 40.41,
    lng: location?.lng ?? -3.7,
  };

  const center = {
    lat: latLng.lat,
    lng: latLng.lng,
  };

  const [selected, setSelected] = useState(defaultLocation ?? null);

  const [map, setMap] = useState<google.maps.Map>();

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  return (
    <div className="space-y-4">
      <div className="places-container">
        {map && (
          <PlacesAutocomplete
            setSelected={setSelected}
            map={map}
            handleAddress={handleAddress}
            defaultLocation={defaultLocation}
          />
        )}
      </div>

      <div className="">
        <GoogleMap
          zoom={10}
          mapContainerClassName="map-container"
          mapContainerStyle={containerStyle}
          onLoad={onLoad}
        >
          {/* TODO: {selected && <Marker position={selected} />} */}
        </GoogleMap>
      </div>
    </div>
  );
}

interface PlacesProps {
  setSelected: ComponentProps<any>;
  map: google.maps.Map;
  handleAddress: ComponentProps<any>;
  defaultLocation?: string;
}

const PlacesAutocomplete = ({
  setSelected,
  map,
  handleAddress,
  defaultLocation,
}: PlacesProps) => {
  const t = useTranslations();

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  useEffect(() => {
    if (defaultLocation) setValue(defaultLocation);
  }, [defaultLocation]);

  const handleSelect = async (address: any) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = getLatLng(results[0]);

    map.panTo({ lat, lng });
    setSelected({ lat, lng });
  };

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);
  };

  return (
    <Combobox onSelect={handleSelect} aria-label="choose">
      <ComboboxInput
        value={value}
        onChange={handleChangeValue}
        disabled={!ready}
        className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
        placeholder={t("search_an_address")}
      />

      <ComboboxPopover portal={false} className="absolute z-50 max-w-[404px]">
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption
                key={place_id}
                value={description}
                onClick={() => handleAddress(description)}
              />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};
