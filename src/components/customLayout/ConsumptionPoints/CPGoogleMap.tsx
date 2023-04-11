import React, { ComponentProps, useMemo, useState } from "react";
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

const containerStyle = {
  width: "400px",
  height: "400px",
};

export default function CPGoogleMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}

function Map() {
  const center = useMemo(() => ({ lat: 40.41, lng: -3.7 }), []);
  const [selected, setSelected] = useState(null);

  return (
    <div className="w-full h-[40vh]">
      <div className="places-container">
        <PlacesAutocomplete setSelected={setSelected} />
      </div>

      <div className="w-100 h-100">
        <GoogleMap
          zoom={12}
          center={center}
          mapContainerClassName="map-container"
          mapContainerStyle={containerStyle}
        >
          {selected && <Marker position={selected} />}
        </GoogleMap>
      </div>
    </div>
  );
}

interface PlacesProps {
  setSelected: ComponentProps<any>;
}

const PlacesAutocomplete = ({ setSelected }: PlacesProps) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  console.log("status", status);
  console.log("data", data);
  console.log("ready", ready);
  console.log("value", value);

  // TODO: Data tiene las suggestions pero value que es numerico no deja cogerlo
  console.log(data[Number.parseInt(value)]);

  const handleSelect = async (address: any) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });
  };

  return (
    <Combobox onSelect={handleSelect} aria-label="choose">
      <ComboboxInput
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
        disabled={!ready}
        className="combobox-input"
        placeholder="Search an address"
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map((place_id: any, description: any) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};
