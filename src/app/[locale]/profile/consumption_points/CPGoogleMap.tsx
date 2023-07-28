"use client";

import React, { ComponentProps, useEffect, useMemo, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

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
  const location = defaultGeoArgs?.[0]?.geometry?.location;
  const latLng = {
    lat: location ? location?.lat : 40.41,
    lng: location ? location?.lng : -3.7,
  };

  const center = useMemo(() => latLng, []);
  const [selected, setSelected] = useState(defaultLocation ?? null);

  const [map, setMap] = useState<google.maps.Map>();

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
          zoom={12}
          // TODO: center={center}
          mapContainerClassName="map-container"
          mapContainerStyle={containerStyle}
          onLoad={(map) => setMap(map)}
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

  useEffect(() => {
    handleAddress(value);
  }, [handleAddress, value]);

  const handleSelect = async (address: any) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = getLatLng(results[0]);

    map.panTo({ lat, lng });
    setSelected({ lat, lng });
  };

  return (
    <Combobox onSelect={handleSelect} aria-label="choose">
      <ComboboxInput
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
        disabled={!ready}
        className="combobox-input w-full rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 text-lg focus:border-beer-blonde focus:outline-none "
        placeholder={t("search_an_address")}
      />

      <ComboboxPopover portal={false} className="absolute z-50 max-w-[404px]">
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};
