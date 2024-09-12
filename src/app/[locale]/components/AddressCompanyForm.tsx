import useSWRMutation from 'swr/mutation';
import InputLabel from './common/InputLabel';
import React, { ComponentProps, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DisplayInputError } from './common/DisplayInputError';
import { JSONSubRegion } from '@/lib//types/distribution_areas';

interface Props {
    form: ComponentProps<any>;
    addressNameId: string;
}

const fetcher = (arg: any, ...args: any) =>
    fetch(arg, ...args).then((res) => res.json());

export default function AddressCompanyForm({ form, addressNameId }: Props) {
    const t = useTranslations();

    const [selectedCountry, setSelectCountry] = useState<string>();
    const [subRegionType, setSubRegionType] = useState<string>();
    const [subRegions, setSubRegions] = useState<JSONSubRegion[]>([]);
    const [citiesInSubRegions, setCitiesInSubRegions] = useState<string[]>();

    const {
        data: subRegionsData,
        trigger,
        error: apiCallError,
    } = useSWRMutation(
        // `/api/country?name=${selectedCountry}&fileName=${subRegionType}`,
        `/api/country/provinces_and_cities?name=${selectedCountry}&fileName=${subRegionType}`,
        fetcher,
    );

    const {
        formState: { errors },
        register,
        setValue,
    } = form;

    useEffect(() => {
        setSelectCountry('spain');
    }, []);

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
        setValue(name, value);
    };

    return (
        <form className="w-full" id="company-form-id">
            {/* Address Information */}
            <fieldset className="mb-3 space-y-4 rounded bg-beer-foam">
                <address className="w-full space-y-2">
                    <h2 className="my-2 text-lg font-semibold tracking-wide text-gray-700">
                        {t(`${addressNameId}_data`)}
                    </h2>

                    <div className="flex gap-4">
                        <InputLabel
                            form={form}
                            label={'company_name'}
                            labelText={'loc_company_name'}
                            registerOptions={{
                                required: true,
                            }}
                        />
                    </div>

                    <div className="flex gap-4">
                        <InputLabel
                            form={form}
                            label={'document_id'}
                            labelText={'loc_company_document_id'}
                            registerOptions={{
                                required: true,
                            }}
                        />

                        <InputLabel
                            form={form}
                            label={'phone'}
                            registerOptions={{
                                required: true,
                            }}
                            inputType={'tel'}
                        />
                    </div>
                </address>

                <address className="w-full space-y-2">
                    <h2 className="my-2 text-lg font-semibold tracking-wide text-gray-700">
                        {t(`${addressNameId}_address`)}
                    </h2>

                    {/* <AutocompletePlaces /> */}

                    <InputLabel
                        form={form}
                        label={'address'}
                        registerOptions={{
                            required: true,
                        }}
                    />

                    {addressNameId === 'shipping' && (
                        <>
                            <InputLabel
                                form={form}
                                label={'address_extra'}
                                registerOptions={{
                                    required: false,
                                }}
                            />
                        </>
                    )}

                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <label
                                className="my-3 flex flex-col h-12 w-1/2 items-start space-y-2 text-sm text-gray-600 py-3"
                                htmlFor="country"
                            >
                                <span className="font-medium">
                                    {t('loc_country')}
                                </span>

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

                            <label
                                className="my-3 flex flex-col h-12 w-1/2 items-start space-y-2 text-sm text-gray-600 py-3"
                                htmlFor="sub_region"
                            >
                                <span className="font-medium">
                                    {t('loc_sub_region')}
                                </span>

                                <select
                                    className=" w-full rounded-lg border-transparent bg-gray-100 px-4 py-2 text-base text-gray-700 focus:border-gray-500 focus:bg-white focus:ring-0"
                                    {...register('sub_region', {
                                        required: true,
                                    })}
                                    disabled={
                                        !subRegions || subRegions.length === 0
                                    }
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

                        <div className="flex gap-4">
                            <InputLabel
                                form={form}
                                label={'zipcode'}
                                labelText={'loc_pc'}
                                registerOptions={{
                                    required: true,
                                }}
                                placeholder={`${t('loc_pc')}`}
                                disabled={
                                    !subRegions || subRegions.length === 0
                                }
                            />

                            <label
                                className="my-3 flex flex-col h-12 w-1/2 items-start space-y-2 text-sm text-gray-600 py-3"
                                htmlFor="city"
                            >
                                <span className="font-medium">
                                    {t('loc_city')}
                                </span>

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
                                                >
                                                    {city}
                                                </option>
                                            ),
                                        )}
                                </select>

                                {errors.city && (
                                    <DisplayInputError
                                        message={errors.city.message}
                                    />
                                )}
                            </label>
                        </div>
                    </div>
                </address>

                {/* <div className="flex items-end">
                    <div className="w-auto">
                        <InputLabel
                            form={form}
                            label={'is_default'}
                            registerOptions={{
                                required: true,
                            }}
                            inputType={'checkbox'}
                        />
                    </div>

                    <p className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {t(`${addressNameId}_checkbox`)}
                    </p>
                </div> */}
            </fieldset>
        </form>
    );
}
