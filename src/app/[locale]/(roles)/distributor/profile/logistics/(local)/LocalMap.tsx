'use client';

import React, { ComponentProps, useEffect, useMemo, useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from '@reach/combobox';
import '@reach/combobox/styles.css';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from 'use-places-autocomplete';
import { useTranslations } from 'next-intl';
import { ILocal } from '../../../../../../../lib/types/types';

const containerStyle = {
    width: '100%',
    height: '70vh',
    borderRadius: '5px',
};

const getCurrentPosition = async () => {
    if (!navigator.geolocation) {
        return null;
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};

interface Props {
    locals: ILocal[];
}

export default function LocalMap({ locals }: Props) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
        libraries: ['places'],
    });

    if (!isLoaded) return <div>Loading...</div>;

    return <Map locals={locals} />;
}

interface MapProps {
    locals: ILocal[];
}

function Map({ locals }: MapProps) {
    const [isMapReady, setIsMapReady] = useState(false);

    // const [fixedMarkers, setFixedMarkers] = useState<google.maps.Marker[]>([]);
    const [map, setMap] = useState<google.maps.Map>();

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

                setIsMapReady(true);
            });
        }
    }, [map]);

    if (!isMapReady) return <div>Loading...</div>;

    const center = useMemo(() => ({ lat: 40.41, lng: -3.7 }), []);
    const [selected, setSelected] = useState(null);

    const featureLayer: google.maps.FeatureLayer = map!.getFeatureLayer(
        google.maps.FeatureType.LOCALITY,
    );

    const featureStyleOptions: google.maps.FeatureStyleOptions = {
        strokeColor: '#810FCB',
        strokeOpacity: 1.0,
        strokeWeight: 3.0,
        fillColor: '#810FCB',
        fillOpacity: 0.5,
    };

    // Apply the style to a single boundary.
    // featureLayer.style = (options: { feature: { placeId: string } }) => {
    //   if (options.feature.placeId == "ChIJ0zQtYiWsVHkRk8lRoB1RNPo") {
    //     // Hana, HI
    //     return featureStyleOptions;
    //   }
    // };

    return (
        <div className="relative space-y-4">
            <div className="places-container absolute left-1/2 top-0 z-10 mt-2 -translate-x-1/2 transform">
                {map && (
                    <PlacesAutocomplete
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
    // handleAddress: ComponentProps<any>;
}

const PlacesAutocomplete = ({
    setSelected,
    map,
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

    // useEffect(() => {
    //   handleAddress(value);
    // }, [handleAddress, value]);

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
                placeholder={t('search_an_address')}
            />

            <ComboboxPopover
                portal={false}
                className="absolute z-50 max-w-[404px]"
            >
                <ComboboxList>
                    {status === 'OK' &&
                        data.map(({ place_id, description }) => (
                            <ComboboxOption
                                key={place_id}
                                value={description}
                            />
                        ))}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    );
};
