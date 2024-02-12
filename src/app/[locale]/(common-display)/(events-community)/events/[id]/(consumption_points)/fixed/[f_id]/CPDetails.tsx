import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ICPFixed } from '../../../../../../../../../lib/types';
import { formatDateString } from '../../../../../../../../../utils/formatDate';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

interface Props {
    cpFixed: ICPFixed;
}

export default function CPDetails({ cpFixed }: Props) {
    const t = useTranslations();

    return (
        <>
            <article>
                <header>
                    <h1 className="mb-2 text-2xl font-bold">
                        {cpFixed.cp_name}
                    </h1>
                    <h2 className="mb-4 text-lg text-gray-500">
                        {cpFixed.cp_description}
                    </h2>
                </header>

                <div className="mb-4">
                    {/* Start and End date */}
                    <span className="text-gray-500">
                        {t('start_date')}:{' '}
                        {formatDateString(cpFixed.start_date)}
                    </span>
                    <span className="ml-4 text-gray-500">
                        {t('end_date')}: {formatDateString(cpFixed.end_date)}
                    </span>
                </div>

                {/* Organizer information */}
                <footer className="mb-4">
                    <span className="text-gray-500">
                        {t('organizer')}: {cpFixed.organizer_name}{' '}
                        {cpFixed.organizer_lastname}
                    </span>
                    <span className="ml-4 text-gray-500">
                        {t('email')}: {cpFixed.organizer_email}
                    </span>
                    <span className="ml-4 text-gray-500">
                        {t('phone')}: {cpFixed.organizer_phone}
                    </span>
                </footer>
            </article>

            {/* Google maps location  */}
            <GoogleMapLocation cp={cpFixed} />
        </>
    );
}

interface GoogleMapLocationProps {
    cp: ICPFixed;
}

const GoogleMapLocation = ({ cp }: GoogleMapLocationProps) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
        libraries: ['places'],
    });

    if (!isLoaded) return <div>Loading...</div>;
    return <Map cp={cp} />;
};

const containerStyle = {
    width: '100%',
    height: '40vh',
    borderRadius: '5px',
};

interface MapsProps {
    cp: ICPFixed;
}

function Map({ cp }: MapsProps) {
    const t = useTranslations();

    const [map, setMap] = useState<google.maps.Map>();

    const onMarkerFixClick = (marker: google.maps.Marker, mobile: ICPFixed) => {
        const content = `<div class="flex flex-col items-center space-y-4">
          <div class="flex flex-row space-x-2">
            <p class="text-md">Fecha inicio: ${formatDateString(
                mobile.start_date,
            )}</p>
            <p class="text-md">Fecha fin: ${formatDateString(
                mobile.end_date,
            )}</p>
          </div>

          <h1 class="text-xl font-bold">${marker.getTitle()}</h1>
          <p class="text-sm">${mobile.cp_description}</p>
          <p class="text-sm">Dirección: ${mobile.address}</p>
          <p class="text-sm">¿Necesario reserva?: ${
              mobile.is_booking_required ? t('yes') : t('no')
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
            if (!cp.geoArgs) return;
            const { lat, lng } = cp.geoArgs[0].geometry.location;
            const marker: google.maps.Marker = new google.maps.Marker({
                position: { lat, lng },
                map: map,
                title: cp.cp_name,
                icon: '/icons/mobile_place_48.png',
                clickable: true,
            });

            marker.addListener('click', () => onMarkerFixClick(marker, cp));
            marker.setMap(map);
            map.setCenter({ lat, lng });
        }
    }, [map]);

    const centerLat = cp.geoArgs ? cp.geoArgs[0]?.geometry.location.lat : 0;
    const centerLng = cp.geoArgs ? cp.geoArgs[0]?.geometry.location.lng : 0;
    const center = useMemo(() => ({ lat: centerLat, lng: centerLng }), []);

    return (
        <div className="relative space-y-4">
            <GoogleMap
                zoom={10}
                center={center}
                mapContainerClassName="map-container"
                mapContainerStyle={containerStyle}
                onLoad={(map) => {
                    setMap(map);
                }}
            >
                {/* Child components, such as markers, info windows, etc. */}
                <Marker position={center} />
            </GoogleMap>
        </div>
    );
}
