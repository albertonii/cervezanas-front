import InputLabel from '@/app/[locale]/components/common/InputLabel';
import InputTextarea from '@/app/[locale]/components/common/InputTextarea';
import React from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { ModalAddBreweryFormData } from '@/lib/types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

interface Props {
    form: UseFormReturn<ModalAddBreweryFormData, any>;
}

const BreweryInfo = ({ form }: Props) => {
    const t = useTranslations();

    return (
        <section
            id="account_brewery_details_data"
            className="relative border-2 rounded-lg border-gray-200 p-6 bg-white shadow-md"
        >
            <FontAwesomeIcon
                icon={faInfoCircle}
                title={'Brewery Social Networs Icon'}
                className="h-12 w-12 text-beer-blonde absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg"
            />

            <section className="mx-10">
                <span
                    id="account-brewery-rrss-data"
                    className="text-4xl font-['NexaRust-script']"
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
                        labelText={t('brewery.history')}
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
