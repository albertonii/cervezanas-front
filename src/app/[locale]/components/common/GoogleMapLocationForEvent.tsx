import EventMap from './EventMap';
import React, { forwardRef } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { IEvent } from '@/lib/types/eventOrders';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';

interface GoogleMapLocationProps {
    event: IEvent;
}

const containerStyle = {
    width: '100%',
    height: '60vh',
    borderRadius: '8px',
};

const libraries: 'places'[] = ['places'];

const GoogleMapLocationForEvent = forwardRef<
    google.maps.Map,
    GoogleMapLocationProps
>(({ event }, ref) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries,
    });

    const cps: IConsumptionPointEvent[] = event.cp_events;

    if (loadError)
        return <div className="text-red-500">Error al cargar el mapa.</div>;
    if (!isLoaded)
        return (
            <div className="flex justify-center items-center h-60">
                Cargando mapa...
            </div>
        );

    return <EventMap cps={cps} ref={ref} />;
});

export default GoogleMapLocationForEvent;
