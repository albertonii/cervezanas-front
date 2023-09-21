"use client";

import React, { ComponentProps, useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
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

const mapContainerStyle = {
  width: "100%",
  height: "70vh",
  borderRadius: "5px",
};

// const center = { lat: 20.764427, lng: -156.445007 }; // Hawaii (USA)
const center = { lat: 40.416775, lng: -3.70379 }; // Madrid (Spain)

const getCurrentPosition = async () => {
  if (!navigator.geolocation) {
    return null;
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

interface Props {
  cities: string[];
}

export default function CityMap({ cities }: Props) {
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [map, setMap] = useState<google.maps.Map | null>();

  /*
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"],
    mapIds: [process.env.NEXT_PUBLIC_MAP_ID ?? ""],
  });
  */

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    mapIds: [process.env.NEXT_PUBLIC_MAP_ID ?? ""],
  });

  useEffect(() => {
    if (isLoaded) {
      setIsMapLoading(false);
    }
  }, [isLoaded]);

  const colorFeatureLayer = (
    placeId: string,
    featureLayerName: google.maps.FeatureType
  ) => {
    if (!map) return;

    const featureLayer = map.getFeatureLayer(featureLayerName);

    // Define a style with Crafteur Orange fill and border.
    const featureStyleOptions: google.maps.FeatureStyleOptions = {
      strokeColor: "#ff7859",
      strokeOpacity: 1.0,
      strokeWeight: 3.0,
      fillColor: "#ff7859",
      fillOpacity: 1.0,
    };

    // Apply the style to a single boundary.
    /*
    featureLayer.style = (options: { feature: { placeId: string } }) => {
      if (options.feature.placeId == placeId) {
        return featureStyleOptions;
      }
    };
    */

    // // Apply the style to a single boundary.
    // // @ts-ignore
    // featureLayer.style = (options: { feature: { placeId: string } }) => {
    //   if (options.feature.placeId === "ChIJpZqwnQnQVHkR_2aNvwpr6mg") {
    //     return featureStyleOptions;
    //   }
    // };
  };

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    cities.map((city) => {
      // const place: google.maps.places.AddressComponent = {
      //   longText: city + ", España",
      //   shortText: city + ", España",
      //   types: ["locality"],
      // };

      const input: HTMLInputElement = document.getElementById(
        "pac-input"
      ) as HTMLInputElement;
      input.value = city + ", España";
      input.innerText = city + ", España";
      input.nodeValue = city + ", España";

      const autocomplete = new google.maps.places.Autocomplete(input, {
        fields: ["place_id", "geometry", "formatted_address", "name"],
      });

      // colorFeatureLayer(place, google.maps.FeatureType.LOCALITY);
    });

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (isMapLoading) return <div>Loading...</div>;

  return (
    <>
      <input id="pac-input" type="text" value="1234" />
      <GoogleMap
        zoom={6}
        center={center}
        mapContainerClassName=""
        mapContainerStyle={mapContainerStyle}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          fullscreenControl: false,
          streetViewControl: false,
          mapId: process.env.NEXT_PUBLIC_MAP_ID ?? "",
        }}
      >
        <></>
      </GoogleMap>
    </>
  );

  // return <Map cities={cities} />;
}

interface MapProps {
  cities: string[];
}

function Map({ cities }: MapProps) {
  // const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const [selected, setSelected] = useState(null);
  const [originalZoom, setOriginalZoom] = useState(8);

  const [mapCenter, setMapCenter] = useState(center);

  /*
  useEffect(() => {
    console.log(mapRef);
    if (mapRef.current) {
      const featureStyleOptions: google.maps.FeatureStyleOptions = {
        strokeColor: "#810FCB",
        strokeOpacity: 1.0,
        strokeWeight: 3.0,
        fillColor: "#810FCB",
        fillOpacity: 0.5,
      };

      const countryLayer = mapRef.current?.getFeatureLayer(
        google.maps.FeatureType.COUNTRY
      );

      // @ts-ignore
      countryLayer.style = featureStyleOptions;
    }
  }, [mapRef.current]);
  */

  /*
  useEffect(() => {
    if (mapRef.current) {
      const colorFeatureLayer = (
        placeId: string,
        featureLayerName: google.maps.FeatureType
      ) => {
        const featureLayer = mapRef.current?.getFeatureLayer(featureLayerName);

        // Define a style with Crafteur Orange fill and border.
        const featureStyleOptions: google.maps.FeatureStyleOptions = {
          strokeColor: "#ff7859",
          strokeOpacity: 1.0,
          strokeWeight: 3.0,
          fillColor: "#ff7859",
          fillOpacity: 1.0,
        };

        // Apply the style to a single boundary.
        // @ts-ignore
        featureLayer.style = (options: { feature: { placeId: string } }) => {
          console.log(placeId);
          if (options.feature.placeId == placeId) {
            return featureStyleOptions;
          }
        };
      };

      colorFeatureLayer(
        "ChIJgTwKgJcpQg0RaSKMYcHeNsQ",
        google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_1
      );

      colorFeatureLayer(
        "ChIJgTwKgJcpQg0RaSKMYcHeNsQ",
        google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_2
      );

      colorFeatureLayer(
        "ChIJgTwKgJcpQg0RaSKMYcHeNsQ",
        google.maps.FeatureType.POSTAL_CODE
      );

      colorFeatureLayer(
        "ChIJgTwKgJcpQg0RaSKMYcHeNsQ",
        google.maps.FeatureType.LOCALITY
      );

      colorFeatureLayer(
        "ChIJgTwKgJcpQg0RaSKMYcHeNsQ",
        google.maps.FeatureType.COUNTRY
      );

      getCurrentPosition().then((position: any) => {
        const { latitude, longitude } = position.coords;
        const center = { lat: latitude, lng: longitude };

        mapRef.current?.setCenter(center);
        // setMap((prev) => {
        //   if (prev) {
        //     prev.setCenter(center);
        //   }
        //   return prev;
        // });
      });
    }
  }, [mapRef]);
  */

  const handleSearch = (
    result: google.maps.places.PlaceResult,
    placeId: string
    // country: string
  ) => {
    const location = result.geometry?.location;
    if (location) {
      const newPosition = { lat: location.lat(), lng: location.lng() };

      // setSelectedState((prev: any) => {
      //   return [...prev, newPosition];
      // });
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(newPosition);

      // setOptionsStyles(styles);
      // if (markerRef.current) {
      //   const marker = markerRef.current;
      //   const currentPosition = marker.getPosition();
      //   // setOptionsStyles(styles);
      //   if (currentPosition) {
      //     bounds.extend(currentPosition);
      //   }

      //   marker.setPosition(newPosition);
      //   marker.setAnimation(google.maps.Animation.DROP);
      // } else {
      //   setSelectedPin(newPosition);
      //   // setOptionsStyles(styles);
      //   markerRef.current = new google.maps.Marker({
      //     position: newPosition,
      //     animation: google.maps.Animation.DROP,
      //     map: mapRef.current,
      //   });
      // }
      colorFeatureLayer(placeId, google.maps.FeatureType.LOCALITY);
      colorFeatureLayer(placeId, google.maps.FeatureType.COUNTRY);
      colorFeatureLayer(
        placeId,
        google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_1
      );

      // bounds.setOriginalZoom(8);
      setMapCenter(newPosition);
      mapRef.current?.fitBounds(bounds);

      setTimeout(() => {
        setOriginalZoom(8);
        zoomOut();
      }, 3000);
    }
  };

  const colorFeatureLayer = (
    placeId: string,
    featureLayerName: google.maps.FeatureType
  ) => {
    const featureLayer = mapRef.current?.getFeatureLayer(featureLayerName);
    // const featureLayerLocality = mapRef.current?.getFeatureLayer(
    //   google.maps.FeatureType.LOCALITY
    // );

    const featureStyleOptions: google.maps.FeatureStyleOptions = {
      strokeColor: "#810FCB",
      strokeOpacity: 1.0,
      strokeWeight: 3.0,
      fillColor: "#810FCB",
      fillOpacity: 0.5,
    };

    // Apply the style to a single boundary.
    /*
    featureLayer.style = (options: { feature: { placeId: string } }) => {
      if (options.feature.placeId == "ChIJpZqwnQnQVHkR_2aNvwpr6mg") {
        return featureStyleOptions;
      }
    };
    */

    // Apply the style to a single boundary.
    // featureLayer.style = (options: { feature: { placeId: string } }) => {
    //   if (options.feature.placeId == placeId) {
    //     // Hana, HI
    //     return featureStyleOptions;
    //   }
    // };
  };

  const zoomOut = () => {
    if (mapRef.current) {
      const zoom = mapRef.current.getZoom();
      mapRef.current.setZoom(zoom ?? 9 - 1);
    }
  };
  return <></>;
  /*
  return (
    <div className="relative space-y-4">
      <div className="places-container absolute left-1/2 top-0 z-10 mt-2 -translate-x-1/2 transform">
        {mapRef.current && (
          <PlacesAutocomplete
            setSelected={setSelected}
            map={mapRef.current}
            onSearch={handleSearch}
            // onSearch={() => {}}
          />
        )}
      </div>

      <GoogleMap
        zoom={originalZoom}
        center={mapCenter}
        mapContainerClassName=""
        mapContainerStyle={mapContainerStyle}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          fullscreenControl: false,
          streetViewControl: false,
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
        }}
      >
        {selected && <Marker position={selected} />}
      </GoogleMap>
    </div>
  );*/
}

interface PlacesProps {
  setSelected: ComponentProps<any>;
  map: google.maps.Map;
  onSearch: ComponentProps<any>;
  // handleAddress: ComponentProps<any>;
}

const PlacesAutocomplete = ({
  setSelected,
  map,
  onSearch,
}: // handleAddress,
PlacesProps) => {
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

    onSearch(
      results[0],
      results[0].place_id
      // results[0].address_components[4].short_name
    );
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
