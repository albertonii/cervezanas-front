// components/Map.tsx
import React, {
    useEffect,
    useMemo,
    useState,
    useCallback,
    forwardRef,
} from 'react';
import { useTranslations } from 'next-intl';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import ConsumptionPointInfoWindow from './ConsumptionPointInfoWindow.';

interface MapsProps {
    cps: IConsumptionPointEvent[];
}

const containerStyle = {
    width: '100%',
    height: '30vh',
    borderRadius: '8px',
};

const EventMap = forwardRef<google.maps.Map, MapsProps>(({ cps }, ref) => {
    const t = useTranslations();
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(
        null,
    );

    const [selectedCP, setSelectedCP] =
        useState<IConsumptionPointEvent | null>();

    // Establecer el mapa en el ref pasado por props
    useEffect(() => {
        if (mapInstance && ref) {
            (ref as React.MutableRefObject<google.maps.Map | null>).current =
                mapInstance;
        }
    }, [mapInstance, ref]);

    // Calcular el centro del mapa basado en los puntos de consumo
    const center = useMemo(() => {
        if (cps.length === 0) return { lat: 0, lng: 0 };
        const latitudes = cps.map(
            (cp) => cp.cp?.geoArgs[0]?.geometry.location.lat || 0,
        );
        const longitudes = cps.map(
            (cp) => cp.cp?.geoArgs[0]?.geometry.location.lng || 0,
        );
        const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
        const avgLng =
            longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
        return { lat: avgLat, lng: avgLng };
    }, [cps]);

    // Ajustar los límites del mapa para incluir todos los marcadores
    const fitBounds = useCallback(() => {
        if (mapInstance && cps.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            cps.forEach((cp) => {
                const lat = cp.cp?.geoArgs[0]?.geometry.location.lat;
                const lng = cp.cp?.geoArgs[0]?.geometry.location.lng;
                if (lat && lng) {
                    bounds.extend(new google.maps.LatLng(lat, lng));
                }
            });
            mapInstance.fitBounds(bounds);
        }
    }, [mapInstance, cps]);

    useEffect(() => {
        fitBounds();
    }, [fitBounds]);

    // Función para manejar el clic en un marcador
    const handleMarkerClick = (cp: IConsumptionPointEvent) => {
        setSelectedCP(cp);
    };

    // Función para cerrar el InfoWindow
    const handleCloseInfoWindow = () => {
        setSelectedCP(null);
    };

    return (
        <div className="relative space-y-4 m-4">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={(map) => setMapInstance(map)}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                }}
            >
                {cps.map((cp) => {
                    const lat = cp.cp?.geoArgs[0]?.geometry.location.lat;
                    const lng = cp.cp?.geoArgs[0]?.geometry.location.lng;
                    if (lat === undefined || lng === undefined) return null;

                    return (
                        <Marker
                            key={cp.id}
                            position={{ lat, lng }}
                            title={cp.cp?.cp_name}
                            icon={{
                                url: '/icons/mobile_place_48.png',
                                scaledSize: new google.maps.Size(32, 32),
                            }}
                            onClick={() => handleMarkerClick(cp)}
                        />
                    );
                })}

                {selectedCP && selectedCP.cp?.geoArgs && (
                    <ConsumptionPointInfoWindow
                        cp={selectedCP}
                        onClose={handleCloseInfoWindow}
                    />
                )}
            </GoogleMap>
        </div>
    );
});

export default EventMap;
