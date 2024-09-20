import React from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { ModalAddBreweryFormData } from '@/lib/types/types';
import { faFlaskVial } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InputTextarea from '@/app/[locale]/components/form/InputTextarea';
import ArrayInputLabel from '@/app/[locale]/components/ui/ArrayInputLabel';

interface Props {
    form: UseFormReturn<ModalAddBreweryFormData, any>;
}

const BreweryInfo = ({ form }: Props) => {
    const t = useTranslations();

    return (
        <section
            id="account_brewery_more_details_data"
            className="relative border-2 rounded-lg border-gray-200 p-6 bg-white shadow-md"
        >
            <FontAwesomeIcon
                icon={faFlaskVial}
                title={'Brewery More Details Icon'}
                className="h-12 w-12 text-beer-blonde absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg"
            />

            <section className="mx-10">
                <span
                    id="account-brewery-rrss-data"
                    className="text-4xl font-['NexaRust-script']"
                >
                    {t('brewery.extra_details_title')}
                </span>

                <div className="grid grid-cols-1 gap-4">
                    <ArrayInputLabel
                        form={form}
                        label={'types_of_beers_produced'}
                        labelText={'brewery.types_of_beers_produced'}
                        placeholder={
                            'brewery.special_processing_methods_placeholder'
                        }
                        extraInfo={t('add_types_of_beers_produced_placeholder')}
                    />

                    <ArrayInputLabel
                        form={form}
                        label={'special_processing_methods'}
                        labelText={'brewery.special_processing_methods'}
                        placeholder={
                            'brewery.special_processing_methods_placeholder'
                        }
                        extraInfo={t('add_special_processing_methods_info')}
                    />
                </div>

                {/* Guided Tours */}
                <div className="grid grid-cols-1 gap-4">
                    <InputTextarea
                        form={form}
                        label={'guided_tours'}
                        labelText={t('brewery.guided_tours')}
                        placeholder={t('brewery.guided_tours_placeholder')}
                    />
                </div>
            </section>
        </section>
    );
};

export default BreweryInfo;
