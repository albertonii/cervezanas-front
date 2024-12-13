import React from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { ModalAddBreweryFormData } from '@/lib/types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import InputLabel from '@/app/[locale]/components/form/InputLabel';
import InputTextarea from '@/app/[locale]/components/form/InputTextarea';

interface Props {
    form: UseFormReturn<ModalAddBreweryFormData, any>;
}

const BreweryInfo = ({ form }: Props) => {
    const t = useTranslations();

    return (
        <section
            id="account_brewery_details_data"
            className="relative border-2 rounded-lg border-gray-200 py-6 px-2 sm:px-6 bg-white shadow-md"
        >
            <FontAwesomeIcon
                icon={faInfoCircle}
                title={'Brewery Social Networs Icon'}
                className="h-12 w-12 text-beer-blonde absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg"
            />

            <section className="mx-0 sm:mx-10  py-8 sm:py-0">
                <span
                    id="account-brewery-rrss-data"
                    className="text-4xl font-['NexaRust-script'] dark:text-white"
                >
                    {t('brewery.details_title')}
                </span>

                <div className="grid grid-cols-2 gap-4">
                    {/* Name & Year*/}
                    <InputLabel
                        form={form}
                        label={'name'}
                        labelText={'name'}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder={t('brewery.introduce_name')}
                        isRequired={true}
                    />

                    <InputLabel
                        form={form}
                        inputType="number"
                        label={'foundation_year'}
                        labelText={'brewery.foundation_year'}
                        registerOptions={{
                            required: true,
                            valueAsNumber: true,
                            min: 1900,
                        }}
                        placeholder={t('brewery.introduce_year')}
                        isRequired={true}
                    />
                </div>

                {/* Description & History */}
                <div className="grid grid-cols-2 gap-4">
                    <InputTextarea
                        form={form}
                        label={'description'}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder={t('brewery.description')}
                        isRequired={true}
                    />

                    <InputTextarea
                        form={form}
                        label={'history'}
                        labelText={'brewery.history'}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder={t('brewery.history_placeholder')}
                        isRequired={true}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* <InputLabel
                        form={form}
                        label={'logo'}
                        labelText={'logo'}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder={t('introduce_brewery_logo')}
                        isRequired={true}
                        type="file"
                    /> */}
                </div>
            </section>
        </section>
    );
};

export default BreweryInfo;
