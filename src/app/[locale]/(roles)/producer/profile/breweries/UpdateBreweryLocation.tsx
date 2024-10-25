import useSWRMutation from 'swr/mutation';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { ModalUpdateBreweryFormData } from '@/lib/types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocation } from '@fortawesome/free-solid-svg-icons';
import { JSONSubRegion } from '@/lib/types/distribution_areas';
import InputLabel from '@/app/[locale]/components/form/InputLabel';
import { DisplayInputError } from '@/app/[locale]/components/ui/DisplayInputError';

interface Props {
    form: UseFormReturn<ModalUpdateBreweryFormData, any>;
}

const fetcher = (arg: any, ...args: any) =>
    fetch(arg, ...args).then((res) => res.json());

const UpdateBreweryLocation = ({ form }: Props) => {
    const t = useTranslations();

    const {
        setValue,
        register,
        formState: { errors },
    } = form;

    const [isInitialRender, setIsInitialRender] = useState(true);

    const [selectedCountry, setSelectCountry] = useState<string>();
    // form.getValues('country'),
    const [selectedSubRegion, setSelectedSubRegion] = useState<string>();
    // form.getValues('sub_region'),
    const [selectedCity, setSelectedCity] = useState<string>();
    // form.getValues('city'),
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
        setSelectCountry(form.getValues('country'));
        setSelectedSubRegion(form.getValues('sub_region'));
        setSelectedCity(form.getValues('city'));
    }, []);

    useEffect(() => {
        if (!selectedCountry) return;

        switch (selectedCountry) {
            case 'spain':
                // Default subregion to avoid error in form
                setValue('sub_region', form.getValues('sub_region'));
                setSubRegionType('provincesAndCities');
                break;
            case 'italy':
                setValue('sub_region', form.getValues('sub_region'));
                setSubRegionType('provinces');
                break;
            case 'france':
                setValue('sub_region', form.getValues('sub_region'));
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
        setIsInitialRender(false);
    }, [subRegionsData]);

    useEffect(() => {
        if (subRegions.length === 0) return;
        const subRegion: JSONSubRegion | undefined = subRegions.find(
            (subRegion_: JSONSubRegion) =>
                subRegion_.name === selectedSubRegion,
        );

        if (!subRegion) return;

        setCitiesInSubRegions(subRegion.cities);
    }, [subRegions]);

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

        setSelectedSubRegion(selectedSubRegion);
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

    if (isInitialRender) return <h1> Loading ...</h1>;

    return (
        <section
            id="account_brewery_location_data"
            className="relative border-2 rounded-lg border-gray-200 py-6 px-2 sm:px-6 bg-white shadow-md"
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
                    {t('brewery.location_title')}
                </span>

                <div className="grid grid-cols-2 gap-4 ">
                    <label htmlFor="country">
                        <span className="font-medium">{t('loc_country')}</span>
                        <span className="text-red-500"> *</span>

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
                        <span className="text-red-500"> *</span>

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
                                        selected={
                                            subRegion.name === selectedSubRegion
                                        }
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
                        <span className="text-red-500"> *</span>

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
                                        <option
                                            key={index}
                                            value={city}
                                            selected={selectedCity === city}
                                        >
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
                        isRequired={true}
                    />
                </div>
            </section>
        </section>
    );
};

export default UpdateBreweryLocation;
