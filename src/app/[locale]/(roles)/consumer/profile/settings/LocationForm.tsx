'use client';

import InputLabel from '@/app/[locale]/components/common/InputLabel';
import Button from '@/app/[locale]/components/common/Button';
import Spinner from '@/app/[locale]/components/common/Spinner';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { isEmpty } from '@/utils/utils';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { IProfileLocation } from '@/lib//types/types';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { DisplayInputError } from '@/app/[locale]/components/common/DisplayInputError';

interface FormProps {
    addressName: string;
    addressLastname: string;
    addressDoc: string;
    addressCompany: string;
    addressPhone: string;
    address1: string;
    address2: string;
    addressPC: number;
    addressCity: string;
    addressCountry: string;
    addressSubRegion: string;
}

interface Props {
    profile_location: IProfileLocation;
}

export function LocationForm({ profile_location }: Props) {
    const t = useTranslations();
    const { user, supabase } = useAuth();

    const [loading, setLoading] = useState(false);

    const {
        id: profile_location_id,
        name,
        lastname,
        document_id,
        company,
        phone,
        postalcode,
        country,
        region,
        sub_region,
        city,
        address_1,
        address_2,
    } = profile_location ?? {};

    const form = useForm<FormProps>({
        mode: 'onSubmit',
        defaultValues: {
            addressName: name,
            addressLastname: lastname,
            addressDoc: document_id,
            addressCompany: company,
            addressPhone: phone,
            address1: address_1,
            address2: address_2,
            addressPC: postalcode,
            addressCity: city,
        },
    });

    const {
        formState: { errors },
        handleSubmit,
    } = form;

    const [addressCountry, setAddressCountry] = useState(country);
    const [addressSubRegion, setAddressSubRegion] = useState(sub_region);
    const [addressRegion, setAddressRegion] = useState(region);

    const selectCountry = (val: string) => {
        setAddressCountry(val);
    };

    const selectSubRegion = (val: string) => {
        setAddressSubRegion(val);
    };

    const onSubmit = async (formValues: FormProps) => {
        setLoading(true);

        const {
            addressName,
            addressLastname,
            addressDoc,
            addressCompany,
            addressPhone,
            address1,
            address2,
            addressPC,
            addressCity,
        } = formValues;

        setTimeout(async () => {
            if (!isEmpty(profile_location_id) || profile_location_id === '') {
                const { error } = await supabase
                    .from('profile_location')
                    .insert([
                        {
                            name: addressName,
                            lastname: addressLastname,
                            document_id: addressDoc,
                            company: addressCompany,
                            phone: addressPhone,
                            address_1: address1,
                            address_2: address2,
                            postalcode: addressPC,
                            country: addressCountry,
                            region: addressRegion,
                            sub_region: addressSubRegion,
                            city: addressCity,
                            owner_id: user?.id,
                        },
                    ]);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('profile_location')
                    .update({
                        name: addressName,
                        lastname: addressLastname,
                        document_id: addressDoc,
                        company: addressCompany,
                        phone: addressPhone,
                        address_1: address1,
                        address_2: address2,
                        postalcode: addressPC,
                        country: addressCountry,
                        region: addressRegion,
                        sub_region: addressSubRegion,
                        city: addressCity,
                    })
                    .eq('id', profile_location_id);

                if (error) throw error;
            }

            setLoading(false);
        }, 700);
    };

    return (
        <section
            id="location_data"
            className="mb-4 space-y-3 bg-white px-6 py-4 border-2 rounded-md border-beer-blonde shadow-2xl"
        >
            <h2 id="location-data-title" className="text-2xl">
                {t('location')}
            </h2>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative space-y-2"
            >
                <div className="flex w-full flex-row space-x-3 ">
                    <InputLabel
                        form={form}
                        label={'addressName'}
                        labelText={t('loc_name')}
                        registerOptions={{
                            required: true,
                        }}
                    />

                    <InputLabel
                        form={form}
                        label={'addressLastname'}
                        labelText={t('lastname')}
                        registerOptions={{
                            required: true,
                        }}
                    />
                </div>

                <div className="flex w-full flex-row space-x-3">
                    <InputLabel
                        form={form}
                        label={'addressDoc'}
                        labelText={t('document_id')}
                        registerOptions={{
                            required: true,
                        }}
                    />

                    <InputLabel
                        form={form}
                        label={'addressCompany'}
                        labelText={t('loc_company')}
                        registerOptions={{
                            required: true,
                        }}
                    />

                    <InputLabel
                        form={form}
                        label={'addressPhone'}
                        labelText={t('loc_phone')}
                        registerOptions={{
                            required: true,
                        }}
                    />
                </div>

                <InputLabel
                    form={form}
                    label={'address1'}
                    labelText={t('loc_location')}
                    registerOptions={{
                        required: true,
                    }}
                    placeholder="Calle España 123"
                />

                <InputLabel
                    form={form}
                    label={'address2'}
                    labelText={t('loc_location')}
                    registerOptions={{
                        required: true,
                    }}
                    placeholder=" - "
                />

                <div className="flex flex-row space-x-3">
                    <InputLabel
                        form={form}
                        label={'addressPC'}
                        labelText={t('loc_pc')}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder="27018"
                        inputType="number"
                    />

                    <InputLabel
                        form={form}
                        label={'addressCity'}
                        labelText={t('loc_city')}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder="Madrid"
                    />
                </div>

                <address className="flex flex-row items-end space-x-3">
                    <div className="w-full">
                        <label
                            htmlFor="addressCountry"
                            className="text-sm text-gray-600"
                        >
                            {t('loc_country')}
                        </label>

                        <CountryDropdown
                            classes="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                            value={addressCountry}
                            onChange={(val) => selectCountry(val)}
                        />

                        {errors.addressCountry && (
                            <DisplayInputError
                                message={errors.addressCountry.message}
                            />
                        )}
                    </div>

                    <div className="w-full">
                        <label
                            htmlFor="addressSubRegion"
                            className="text-sm text-gray-600"
                        >
                            {t('loc_sub_region')}
                        </label>

                        <RegionDropdown
                            classes="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                            country={addressCountry}
                            value={addressSubRegion}
                            onChange={(val) => selectSubRegion(val)}
                        />

                        {errors.addressSubRegion && (
                            <DisplayInputError
                                message={errors.addressSubRegion.message}
                            />
                        )}
                    </div>
                </address>

                {loading && (
                    <Spinner
                        color="beer-blonde"
                        size={'xLarge'}
                        absolute
                        center
                    />
                )}

                <Button primary medium btnType={'submit'} disabled={loading}>
                    {t('save')}
                </Button>
            </form>
        </section>
    );
}
