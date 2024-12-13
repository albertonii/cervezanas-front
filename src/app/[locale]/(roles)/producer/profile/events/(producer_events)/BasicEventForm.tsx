import Title from '@/app/[locale]/components/ui/Title';
import InputLabel from '@/app/[locale]/components/form/InputLabel';
import SelectInput from '@/app/[locale]/components/form/SelectInput';
import InputTextarea from '@/app/[locale]/components/form/InputTextarea';
import React from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { EVENT_CATEGORIES } from '@/lib/enums';

interface Props {
    form: UseFormReturn<any, any>;
}

export default function BasicEventForm({ form }: Props) {
    const t = useTranslations('event');

    const { setValue } = form;

    return (
        <>
            {/* Event Information  */}
            <fieldset className="space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                <legend>
                    <Title size="large">{t('events_info')}</Title>
                </legend>

                <div className="flex flex-row gap-4">
                    {/* Event name  */}
                    <InputLabel
                        form={form}
                        label={'name'}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder={t('introduce_event_name')}
                    />

                    <SelectInput
                        form={form}
                        labelTooltip={'tooltips.categories'}
                        options={EVENT_CATEGORIES}
                        label={'category'}
                        registerOptions={{
                            required: true,
                        }}
                        onChange={(event) =>
                            setValue('category', event.target.value)
                        }
                        translateLabelTxt="event"
                    />
                </div>

                {/* Event description  */}
                <InputTextarea
                    form={form}
                    label={'description'}
                    registerOptions={{
                        required: true,
                    }}
                    placeholder={`${t('introduce_event_description')}`}
                />

                {/* Start date and end date  */}
                <div className="flex flex-row space-x-2">
                    <InputLabel
                        form={form}
                        label={'start_date'}
                        registerOptions={{
                            required: true,
                        }}
                        inputType="date"
                    />

                    <InputLabel
                        form={form}
                        label={'end_date'}
                        registerOptions={{
                            required: true,
                        }}
                        inputType="date"
                    />
                </div>
            </fieldset>

            {/* Logo and publicitary img */}
            {/* <fieldset className="mt-4 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                <legend className="text-2xl">{t('event_advertising')}</legend>

            </fieldset> */}
        </>
    );
}
