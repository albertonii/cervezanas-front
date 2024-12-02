import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { formatDateString } from '@/utils/formatDate';
import {
    IConsumptionPointEvent,
    ICPMobile,
} from '@/lib/types/consumptionPoints';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

interface Props {
    cpEvent: IConsumptionPointEvent;
}

export default function CPDetails({ cpEvent }: Props) {
    const t = useTranslations();

    return (
        <>
            <article className="space-y-4 border rounded-md border-beer-blonde p-4 ">
                <header>
                    <Title size="large" color="beer-blonde">
                        {cpEvent.cp?.cp_name}
                    </Title>

                    <Label size="medium" color="gray">
                        {cpEvent.cp?.cp_description}
                    </Label>
                </header>

                <div className="mb-4 grid grid-cols-2">
                    <div>
                        <Label color="gray" size="small">
                            {t('start_date')}:{' '}
                        </Label>
                        <Label color="black" size="small">
                            {formatDateString(cpEvent.start_date)}
                        </Label>
                    </div>

                    <div>
                        <Label color="gray" size="small">
                            {t('end_date')}:
                        </Label>
                        <Label color="black" size="small">
                            {formatDateString(cpEvent.end_date)}
                        </Label>
                    </div>
                </div>

                {/* Organizer information */}
                <footer className="space-y-2">
                    <div className="grid grid-cols-2">
                        <Label color="gray" size="small">
                            {t('organizer')}:
                        </Label>
                        <Label color="black" size="small">
                            {cpEvent.cp?.organizer_name}{' '}
                            {cpEvent.cp?.organizer_lastname}{' '}
                        </Label>
                    </div>

                    <div className="grid grid-cols-2">
                        <Label color="gray" size="small">
                            {t('email')}:
                        </Label>
                        <Label color="black" size="small">
                            {cpEvent.cp?.organizer_email}
                        </Label>
                    </div>

                    <div className="grid grid-cols-2">
                        <Label color="gray" size="small">
                            {t('phone')}:
                        </Label>
                        <Label color="black" size="small">
                            {cpEvent.cp?.organizer_phone}
                        </Label>
                    </div>
                </footer>
            </article>

            {/* Google maps location  */}
            <GoogleMapLocation cp={cpEvent} />
        </>
    );
}

interface GoogleMapLocationProps {
    cp: IConsumptionPointEvent;
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
    cp: IConsumptionPointEvent;
}

function Map({ cp }: MapsProps) {
    const t = useTranslations();

    const [map, setMap] = useState<google.maps.Map>();

    const onMarkerFixClick = (
        marker: google.maps.Marker,
        cp: IConsumptionPointEvent,
    ) => {
        const content = `<div class="flex flex-col items-center space-y-4">
          <div class="flex flex-row space-x-2">
            <p class="text-md">Fecha inicio: ${formatDateString(
                cp.start_date,
            )}</p>
            <p class="text-md">Fecha fin: ${formatDateString(cp.end_date)}</p>
          </div>

          <h1 class="text-xl font-bold">${marker.getTitle()}</h1>
          <p class="text-sm">${cp.cp?.cp_description}</p>
          <p class="text-sm">Dirección: ${cp.cp?.address}</p>
          <p class="text-sm">¿Necesario reserva?: ${
              cp.cp?.is_booking_required ? t('yes') : t('no')
          }</p>
         

          <div class="flex flex-col items-center">
            <div class="text-lg font-semibold"> 
            Contacto de la persona encargada
            </div>

            <div class="flex flex-row space-x-2">
              <p class="text-sm">Nombre: ${cp.cp?.organizer_name} ${
            cp.cp?.organizer_lastname
        }</p> 
              <p class="text-sm">Teléfono: ${cp.cp?.organizer_phone}</p>
              <p class="text-sm">Email: ${cp.cp?.organizer_email}</p>
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
            if (!cp.cp?.geoArgs) return;
            const { lat, lng } = cp.cp?.geoArgs[0].geometry.location;
            const marker: google.maps.Marker = new google.maps.Marker({
                position: { lat, lng },
                map: map,
                title: cp.cp.cp_name,
                icon: '/icons/mobile_place_48.png',
                clickable: true,
            });

            marker.addListener('click', () => onMarkerFixClick(marker, cp));
            marker.setMap(map);
            map.setCenter({ lat, lng });
        }
    }, [map]);

    const centerLat = cp.cp?.geoArgs
        ? cp.cp?.geoArgs[0]?.geometry.location.lat
        : 0;
    const centerLng = cp.cp?.geoArgs
        ? cp.cp?.geoArgs[0]?.geometry.location.lng
        : 0;
    const center = useMemo(() => ({ lat: centerLat, lng: centerLng }), []);

    return (
        <div className="relative space-y-4 m-4">
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
