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
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useTranslations } from "next-intl";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "5px",
};

interface Props {
  handleAddress: ComponentProps<any>;
}

export default function CPGoogleMap({ handleAddress }: Props) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAKy3WmKXNpusaPjszA5IZA-jABYT5lHss",
    // googleMapsApiKey: process.env.NEXT_PLUBIC_GOOGLE_MAPS_API_KEY ?? "",

    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map handleAddress={handleAddress} />;
}

function Map({ handleAddress }: Props) {
  const center = useMemo(() => ({ lat: 40.41, lng: -3.7 }), []);
  const [selected, setSelected] = useState(null);

  const [map, setMap] = useState<google.maps.Map>();

  return (
    <div className="space-y-4">
      <div className="places-container">
        {map && (
          <PlacesAutocomplete
            setSelected={setSelected}
            map={map}
            handleAddress={handleAddress}
          />
        )}
      </div>

      <div className="">
        <GoogleMap
          zoom={12}
          center={center}
          mapContainerClassName="map-container"
          mapContainerStyle={containerStyle}
          onLoad={(map) => setMap(map)}
        >
          {selected && <Marker position={selected} />}
        </GoogleMap>
      </div>
    </div>
  );
}

interface PlacesProps {
  setSelected: ComponentProps<any>;
  map: google.maps.Map;
  handleAddress: ComponentProps<any>;
}

const PlacesAutocomplete = ({
  setSelected,
  map,
  handleAddress,
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
        className="combobox-input rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 text-lg focus:border-beer-blonde focus:outline-none "
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
