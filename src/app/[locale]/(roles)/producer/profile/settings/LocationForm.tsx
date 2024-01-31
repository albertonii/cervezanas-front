'use client';

import React, { useState } from 'react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { IProfileLocation } from '../../../../../../lib/types';
import { useAuth } from '../../../../Auth/useAuth';
import { Button } from '../../../../components/common/Button';
import { DisplayInputError } from '../../../../components/common/DisplayInputError';
import Spinner from '../../../../components/common/Spinner';
import InputLabel from '../../../../components/common/InputLabel';

interface FormProps {
    addressName: string;
    addressLastname: string;
    addressDoc: string;
    addressCompany: string;
    addressPhone: string;
    address1: string;
    address2: string;
    addressPC: number;
    addressTown: string;
    addressCountry: string;
    addressProvince: string;
}

interface Props {
    profile_location: IProfileLocation;
}
// TODO: Add Validation ZOD
export function LocationForm({ profile_location }: Props) {
    const t = useTranslations();
    const { supabase, user } = useAuth();

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
        province,
        town,
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
            addressTown: town,
        },
    });

    const {
        formState: { errors },
        handleSubmit,
    } = form;

    const [addressCountry, setAddressCountry] = useState(country);
    const [addressProvince, setAddressProvince] = useState(province);

    const selectCountry = (val: string) => {
        setAddressCountry(val);
    };

    const selectRegion = (val: string) => {
        setAddressProvince(val);
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
            addressTown,
        } = formValues;

        setTimeout(async () => {
            if (!profile_location_id || profile_location_id === '') {
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
                            town: addressTown,
                            country: addressCountry,
                            province: addressProvince,
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
                        town: addressTown,
                        country: addressCountry,
                        province: addressProvince,
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
            className="container mb-4 space-y-3 bg-white px-6 py-4"
        >
            <h2 id="location-data-title" className="text-2xl">
                {t('location')}
            </h2>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative space-y-2"
            >
                <address className="flex w-full flex-row space-x-3 ">
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
                </address>

                <address className="flex w-full flex-row space-x-3">
                    <InputLabel
                        form={form}
                        label={'addressDoc'}
                        labelText={t('document_id')}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder="00112233-R"
                    />

                    <InputLabel
                        form={form}
                        label={'addressCompany'}
                        labelText={t('loc_company')}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder="Empresa 2000 SL"
                    />

                    <InputLabel
                        form={form}
                        label={'addressPhone'}
                        labelText={t('loc_phone')}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder="+34 685 222 222"
                    />
                </address>

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

                <address className="flex flex-row space-x-3">
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
                        label={'addressTown'}
                        labelText={t('loc_town')}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder="Madrid"
                    />
                </address>

                <div className="flex flex-row items-end space-x-3">
                    <address className="w-full">
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
                    </address>

                    <address className="w-full">
                        <label
                            htmlFor="addressProvince"
                            className="text-sm text-gray-600"
                        >
                            {t('loc_province')}
                        </label>

                        <RegionDropdown
                            classes="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                            country={addressCountry}
                            value={addressProvince}
                            onChange={(val) => selectRegion(val)}
                        />

                        {errors.addressProvince && (
                            <DisplayInputError
                                message={errors.addressProvince.message}
                            />
                        )}
                    </address>
                </div>

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
