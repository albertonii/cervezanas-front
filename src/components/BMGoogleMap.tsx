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
import { useTranslation } from "react-i18next";
import { IConsumptionPoints, ICPFixed } from "../lib/types";
import { formatDate } from "../utils";

const containerStyle = {
  width: "100%",
  height: "70vh",
  borderRadius: "5px",
};

interface Props {
  handleAddress: ComponentProps<any>;
  cps: IConsumptionPoints[];
}

const getCurrentPosition = async () => {
  if (!navigator.geolocation) {
    return null;
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

export default function BMGoogleMap({ handleAddress, cps }: Props) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map handleAddress={handleAddress} cps={cps} />;
}

function Map({ handleAddress, cps }: Props) {
  const { t } = useTranslation();

  // const [fixedMarkers, setFixedMarkers] = useState<google.maps.Marker[]>([]);
  const [map, setMap] = useState<google.maps.Map>();

  const onMarkerFixClick = (marker: google.maps.Marker, fixed: ICPFixed) => {
    const content = `<div class="flex flex-col items-center space-y-4">
          <div class="flex flex-row space-x-2">
            <p class="text-md">Fecha inicio: ${formatDate(fixed.start_date)}</p>
            <p class="text-md">Fecha fin: ${formatDate(fixed.end_date)}</p>
          </div>

          <h1 class="text-xl font-bold">${marker.getTitle()}</h1>
          <p class="text-sm">${fixed.cp_description}</p>
          <p class="text-sm">Dirección: ${fixed.address}</p>
          <p class="text-sm">¿Necesario reserva?: ${
            fixed.is_booking_required ? t("yes") : t("no")
          }</p>
         

          <div class="flex flex-col items-center">
            <div class="text-lg font-semibold"> 
            Contacto de la persona encargada
            </div>

            <div class="flex flex-row space-x-2">
              <p class="text-sm">Nombre: ${fixed.organizer_name} ${
      fixed.organizer_lastname
    }</p> 
              <p class="text-sm">Teléfono: ${fixed.organizer_phone}</p>
              <p class="text-sm">Email: ${fixed.organizer_email}</p>
            </div>
          </div>
        </div>`;

    const infowindow = new google.maps.InfoWindow({
      content,
    });

    infowindow.open(map, marker);
  };

  // Loop through CPs and add CP fixed markers in first component render
  useEffect(() => {
    getCurrentPosition().then((position: any) => {
      const { latitude, longitude } = position.coords;
      const center = { lat: latitude, lng: longitude };

      setMap((prev) => {
        if (prev) {
          prev.setCenter(center);
        }
        return prev;
      });
    });

    cps.map((cp) => {
      cp.cp_fixed.map(async (fixed) => {
        const { lat, lng } = fixed.geoArgs[0].geometry.location;
        const marker: google.maps.Marker = new google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: fixed.cp_name,
          icon: "/icons/fixed_place_48.png",
          clickable: true,
        });

        marker.addListener("click", () => onMarkerFixClick(marker, fixed));
        marker.setMap(map ?? null);
      });
    });
  }, []);

  const center = useMemo(() => ({ lat: 40.41, lng: -3.7 }), []);
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-4 relative">
      <div className="places-container absolute top-0 left-1/2 transform -translate-x-1/2 z-10 mt-2">
        {map && (
          <PlacesAutocomplete
            setSelected={setSelected}
            map={map}
            handleAddress={handleAddress}
          />
        )}
      </div>

      <GoogleMap
        zoom={10}
        center={center}
        mapContainerClassName="map-container"
        mapContainerStyle={containerStyle}
        onLoad={(map) => setMap(map)}
      >
        {selected && <Marker position={selected} />}
      </GoogleMap>
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
  const { t } = useTranslation();

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
        className="combobox-input bg-beer-softFoam border-beer-softBlondeBubble border-2 focus:border-beer-blonde focus:outline-none rounded-md px-2 py-1 text-lg "
        placeholder={t("search_an_address")}
      />

      <ComboboxPopover portal={false} className="absolute max-w-[404px] z-50">
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
