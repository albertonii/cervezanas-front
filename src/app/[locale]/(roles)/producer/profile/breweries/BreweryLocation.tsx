import InputLabel from '@/app/[locale]/components/common/InputLabel';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { ModalAddBreweryFormData } from '@/lib/types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocation } from '@fortawesome/free-solid-svg-icons';
import { DisplayInputError } from '@/app/[locale]/components/common/DisplayInputError';
import { JSONSubRegion } from '@/lib/types/distribution_areas';
import useSWRMutation from 'swr/mutation';

interface Props {
    form: UseFormReturn<ModalAddBreweryFormData, any>;
}

const fetcher = (arg: any, ...args: any) =>
    fetch(arg, ...args).then((res) => res.json());

const BreweryLocation = ({ form }: Props) => {
    const t = useTranslations();

    const {
        setValue,
        register,
        formState: { errors },
    } = form;

    const [selectedCountry, setSelectCountry] = useState<string>();
    const [selectedSubRegion, setSelectedSubRegion] = useState<string>();
    const [subRegionType, setSubRegionType] = useState<string>();
    const [subRegions, setSubRegions] = useState<JSONSubRegion[]>([]);
    const [citiesInSubRegions, setCitiesInSubRegions] = useState<string[]>();

    const {
        data: subRegionsData,
        trigger,
        error: apiCallError,
    } = useSWRMutation(
        `/api/country/provinces_and_cities?name=${selectedCountry}&fileName=${subRegionType}`,
        fetcher,
    );

    useEffect(() => {
        if (!selectedCountry) return;

        switch (selectedCountry) {
            case 'spain':
                // Default subregion to avoid error in form
                setValue('sub_region', 'Álava');
                setSubRegionType('provincesAndCities');
                break;
            case 'italy':
                setValue('sub_region', 'Agrigento');
                setSubRegionType('provinces');
                break;
            case 'france':
                setValue('sub_region', 'Ain');
                setSubRegionType('departments');
                break;
            default:
                setSubRegionType('provinces');
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (!subRegionType) return;
        trigger();
    }, [subRegionType]);

    useEffect(() => {
        if (!subRegionsData) return;
        setSubRegions(subRegionsData);
    }, [subRegionsData]);

    const handleSelectCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectCountry(e.target.value);
    };

    const handleSelectSubRegion = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSubRegion = e.target.value.toString();

        const subRegion: JSONSubRegion | undefined = subRegions.find(
            (subRegion_: JSONSubRegion) =>
                subRegion_.name === selectedSubRegion,
        );

        if (!subRegion) return;

        setCitiesInSubRegions(subRegion.cities);
        setValue('region', subRegion.region);
    };

    const handleOnInput = (
        e: React.FormEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.currentTarget;
        if (name === 'city') {
            setValue(name, value);
        }

        if (name === 'sub_region') {
            const subRegion: JSONSubRegion | undefined = subRegions.find(
                (subRegion_: JSONSubRegion) =>
                    subRegion_.name === selectedSubRegion,
            );

            if (!subRegion) return;

            setValue('region', subRegion.region);
            setValue(name, value);
        }
    };

    return (
        <section
            id="account_brewery_location_data"
            className="relative border-2 rounded-lg border-gray-200 p-6 bg-white shadow-md"
        >
            <FontAwesomeIcon
                icon={faMapLocation}
                title={'Brewery Location Icon'}
                className="h-12 w-12 text-beer-blonde absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg"
            />

            <section className="mx-10 my-4 space-y-4">
                <span
                    id="account-brewery-location-data"
                    className="text-4xl font-['NexaRust-script']"
                >
                    {t('brewery_location_title')}
                </span>

                <div className="grid grid-cols-2 gap-4 ">
                    <label htmlFor="country">
                        <span className="font-medium">{t('loc_country')}</span>

                        {/* Display all countries */}
                        <select
                            className=" w-full rounded-lg border-transparent bg-gray-100 px-4 py-2 text-base text-gray-700 focus:border-gray-500 focus:bg-white focus:ring-0"
                            {...register('country', { required: true })}
                            onChange={(e) => {
                                handleSelectCountry(e);
                            }}
                            onInput={(e) => {
                                handleOnInput(e);
                            }}
                        >
                            <option key={'ES'} value={'spain'} selected>
                                {t('countries.spain')}
                            </option>
                            <option key={'IT'} value={'italy'}>
                                {t('countries.italy')}
                            </option>
                            <option key={'FR'} value={'france'}>
                                {t('countries.france')}
                            </option>
                        </select>

                        {errors.country && (
                            <DisplayInputError
                                message={errors.country.message}
                            />
                        )}
                    </label>

                    <label htmlFor="sub_region">
                        <span className="font-medium">
                            {t('loc_sub_region')}
                        </span>

                        <select
                            className=" w-full rounded-lg border-transparent bg-gray-100 px-4 py-2 text-base text-gray-700 focus:border-gray-500 focus:bg-white focus:ring-0"
                            {...register('sub_region', {
                                required: true,
                            })}
                            disabled={!subRegions || subRegions.length === 0}
                            onChange={(e) => {
                                handleSelectSubRegion(e);
                            }}
                            onInput={(e) => {
                                handleOnInput(e);
                            }}
                        >
                            {subRegions &&
                                subRegions.map((subRegion: any) => (
                                    <option
                                        key={subRegion.id}
                                        value={subRegion.name}
                                    >
                                        {subRegion.name}
                                    </option>
                                ))}
                        </select>

                        {errors.sub_region && (
                            <DisplayInputError
                                message={errors.sub_region.message}
                            />
                        )}
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <label htmlFor="city">
                        <span className="font-medium">{t('loc_city')}</span>

                        <select
                            className=" w-full rounded-lg border-transparent bg-gray-100 px-4 py-2 text-base text-gray-700 focus:border-gray-500 focus:bg-white focus:ring-0"
                            {...register('city', { required: true })}
                            disabled={
                                !citiesInSubRegions ||
                                citiesInSubRegions.length === 0
                            }
                            onInput={handleOnInput}
                        >
                            {citiesInSubRegions &&
                                citiesInSubRegions.map(
                                    (city: string, index: number) => (
                                        <option key={index} value={city}>
                                            {city}
                                        </option>
                                    ),
                                )}
                        </select>

                        {errors.city && (
                            <DisplayInputError message={errors.city.message} />
                        )}
                    </label>

                    <InputLabel
                        form={form}
                        label={'address'}
                        registerOptions={{
                            required: true,
                        }}
                    />
                </div>
            </section>
        </section>
    );
};

export default BreweryLocation;
