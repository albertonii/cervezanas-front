import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import Autocomplete, { usePlacesWidget } from 'react-google-autocomplete';

export function AutocompletePlaces() {
    const t = useTranslations();

    const gMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    // useExternalScripts({
    //   url: `https://maps.googleapis.com/maps/api/js?key=${gMapsApiKey}&libraries=places&callback=initMap`,
    // });

    const inputRef = useRef(null);

    useEffect(() => {
        if (!inputRef.current) return;
    }, [inputRef.current]);

    return (
        <article className="">
            <Autocomplete
                style={{ width: '250px' }}
                ref={inputRef}
                apiKey={gMapsApiKey}
                onPlaceSelected={(selected, a, c) => {}}
                options={{
                    types: ['geocode', 'establishment'],
                    // componentRestrictions: { country },
                }}
            />
        </article>
    );
}
