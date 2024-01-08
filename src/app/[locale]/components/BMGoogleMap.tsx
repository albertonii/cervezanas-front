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
import { IConsumptionPoints, ICPFixed, ICPMobile } from "../../../lib/types";
import { formatDateString } from "../../../utils/formatDate";

const containerStyle = {
  width: "100%",
  height: "70vh",
  borderRadius: "5px",
};

interface Props {
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

export default function BMGoogleMap({ cps }: Props) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map cps={cps} />;
}

function Map({ cps }: Props) {
  const t = useTranslations();

  // const [fixedMarkers, setFixedMarkers] = useState<google.maps.Marker[]>([]);
  const [map, setMap] = useState<google.maps.Map>();

  const onMarkerFixClick = (marker: google.maps.Marker, fixed: ICPFixed) => {
    const content = `<div class="flex flex-col items-center space-y-4">
          <div class="flex flex-row space-x-2">
            <p class="text-md">Fecha inicio: ${formatDateString(
              fixed.start_date
            )}</p>
            <p class="text-md">Fecha fin: ${formatDateString(
              fixed.end_date
            )}</p>
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

  const onMarkerMobileClick = (
    marker: google.maps.Marker,
    mobile: ICPMobile
  ) => {
    const content = `<div class="flex flex-col items-center space-y-4">
          <div class="flex flex-row space-x-2">
            <p class="text-md">Fecha inicio: ${formatDateString(
              mobile.start_date
            )}</p>
            <p class="text-md">Fecha fin: ${formatDateString(
              mobile.end_date
            )}</p>
          </div>

          <h1 class="text-xl font-bold">${marker.getTitle()}</h1>
          <p class="text-sm">${mobile.cp_description}</p>
          <p class="text-sm">Dirección: ${mobile.address}</p>
          <p class="text-sm">¿Necesario reserva?: ${
            mobile.is_booking_required ? t("yes") : t("no")
          }</p>
         

          <div class="flex flex-col items-center">
            <div class="text-lg font-semibold"> 
            Contacto de la persona encargada
            </div>

            <div class="flex flex-row space-x-2">
              <p class="text-sm">Nombre: ${mobile.organizer_name} ${
      mobile.organizer_lastname
    }</p> 
              <p class="text-sm">Teléfono: ${mobile.organizer_phone}</p>
              <p class="text-sm">Email: ${mobile.organizer_email}</p>
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
    if (map) {
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
        cp.cp_fixed?.map(async (fixed) => {
          if (!fixed.geoArgs) return;
          const { lat, lng } = fixed.geoArgs[0].geometry.location;
          const marker: google.maps.Marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: fixed.cp_name,
            icon: "/icons/fixed_place_48.png",
            clickable: true,
          });
          marker.addListener("click", () => onMarkerFixClick(marker, fixed));
          marker.setMap(map);
        });

        cp.cp_mobile?.map(async (mobile) => {
          if (!mobile.geoArgs) return;

          const { lat, lng } = mobile.geoArgs[0].geometry.location;
          const marker: google.maps.Marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: mobile.cp_name,
            icon: "/icons/mobile_place_48.png",
            clickable: true,
          });

          marker.addListener("click", () =>
            onMarkerMobileClick(marker, mobile)
          );
          marker.setMap(map);
        });
      });
    }
  }, [map]);

  const center = useMemo(() => ({ lat: 40.41, lng: -3.7 }), []);
  const [selected, setSelected] = useState(null);

  return (
    <div className="relative space-y-4">
      <div className="places-container absolute left-1/2 top-0 z-10 mt-2 -translate-x-1/2 transform">
        {map && (
          <AutocompletePlaces
            setSelected={setSelected}
            map={map}
            // handleAddress={handleAddress}
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
}

const AutocompletePlaces = ({ setSelected, map }: PlacesProps) => {
  const t = useTranslations();

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

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
        className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
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
