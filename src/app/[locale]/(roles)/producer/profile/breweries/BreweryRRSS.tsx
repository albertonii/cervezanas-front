import InputLabel from '@/app/[locale]/components/common/InputLabel';
import React from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { ModalAddBreweryFormData } from '@/lib/types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNodes } from '@fortawesome/free-solid-svg-icons';

interface Props {
    form: UseFormReturn<ModalAddBreweryFormData, any>;
}

const BreweryRRSS = ({ form }: Props) => {
    const t = useTranslations();

    return (
        <section
            id="account_brewery_rrss_data"
            className="relative border-2 rounded-lg border-gray-200 p-6 bg-white shadow-md"
        >
            <FontAwesomeIcon
                icon={faCircleNodes}
                title={'Brewery Social Networs Icon'}
                className="h-12 w-12 text-beer-blonde absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg"
            />

            <section className="mx-10">
                <span
                    id="account-brewery-rrss-data"
                    className="text-4xl font-['NexaRust-script']"
                >
                    {t('brewery_rrss_title')}
                </span>

                <div className="flex w-full flex-row space-x-3 ">
                    <InputLabel
                        form={form}
                        label={'rrss_ig'}
                        labelText={'rrss_ig_url_name'}
                        registerOptions={{}}
                        placeholder={'@BreweriesSpain'}
                        infoTooltip={t('tooltips.rrss_ig_info')}
                    />

                    <InputLabel
                        form={form}
                        label={'rrss_fb'}
                        labelText={'rrss_fb_url_name'}
                        registerOptions={{}}
                        placeholder={'@BreweriesSpain'}
                        infoTooltip={t('tooltips.rrss_fb_info')}
                    />
                </div>

                <div className="flex w-full flex-row space-x-3">
                    <InputLabel
                        form={form}
                        label={'rrss_linkedin'}
                        labelText={'rrss_linkedin_url_name'}
                        registerOptions={{}}
                        placeholder={'@BreweriesSpain'}
                        infoTooltip={t('tooltips.rrss_linkedin_info')}
                    />

                    <InputLabel
                        form={form}
                        label={'website'}
                        inputType={'url'}
                        registerOptions={{}}
                        placeholder={'https://www.breweries.com'}
                    />
                </div>
            </section>
        </section>
    );
};

export default BreweryRRSS;
