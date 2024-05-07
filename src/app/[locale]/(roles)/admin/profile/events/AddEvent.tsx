'use client';

import InputLabel from '../../../../components/common/InputLabel';
import InputTextarea from '../../../../components/common/InputTextarea';
import ModalWithForm from '../../../../components/modals/ModalWithForm';
import React, { useEffect, useState } from 'react';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import {
    ICPFixed,
    ICPF_events,
    ICPMobile,
    ICPM_events,
} from '../../../../../../lib/types/types';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { useMutation, useQueryClient } from 'react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SearchCheckboxCPMobiles } from '../../../../components/common/SearchCheckboxCPMobiles';
import { SearchCheckboxCPFixeds } from '../../../../components/common/SearchCheckboxCPFixed';
import { useMessage } from '../../../../components/message/useMessage';
import {
    ROUTE_EVENTS,
    ROUTE_PRODUCER,
    ROUTE_PROFILE,
} from '../../../../../../config';
import { sendPushNotification } from '../../../../../../lib/actions';

export type ModalAddEventFormData = {
    is_activated: boolean;
    name: string;
    description: string;
    start_date: Date;
    end_date: Date;
    logo_url?: string;
    promotional_url?: string;
    cps_mobile?: any[];
    cps_fixed?: any[];
};

const schema: ZodType<ModalAddEventFormData> = z.object({
    is_activated: z.boolean(),
    name: z.string().nonempty({ message: 'errors.input_required' }),
    description: z.string().nonempty({ message: 'errors.input_required' }),
    start_date: z.date(),
    end_date: z.date(),
    logo_url: z.string().optional(),
    promotional_url: z.string().optional(),
    cps_mobile: z.any(),
    cps_fixed: z.any(),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    cpsMobile: ICPMobile[];
    cpsFixed: ICPFixed[];
}

export default function AddEvent({ cpsMobile, cpsFixed }: Props) {
    const t = useTranslations();
    const { user, supabase } = useAuth();
    const { handleMessage } = useMessage();

    const [showModal, setShowModal] = useState<boolean>(false);

    const queryClient = useQueryClient();

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {},
    });

    const {
        handleSubmit,
        reset,
        formState: { errors },
        register,
    } = form;

    const handleInsertEvent = async (form: ValidationSchema) => {
        const {
            is_activated,
            name,
            description,
            start_date,
            end_date,
            cps_mobile,
            cps_fixed,
        } = form;

        const formatStartDate = new Date(start_date).toISOString();
        const formatEndDate = new Date(end_date).toISOString();

        // Create event
        const { data: event, error: eventError } = await supabase
            .from('events')
            .insert({
                is_activated,
                is_cervezanas_event: true,
                name,
                description,
                start_date: formatStartDate,
                end_date: formatEndDate,
                owner_id: user?.id,
                address: '',
                logo_url: '',
                promotional_url: '',
                status: '',
                geoArgs: {
                    type: 'Point',
                    coordinates: [0, 0],
                },
            })
            .select()
            .single();

        if (eventError) {
            throw eventError;
        }
        if (!cps_mobile) {
            return;
        }
        if (!event) {
            return;
        }

        const { id: eventId } = event;

        if (cps_mobile) {
            // Get CP checked from the list
            const cpsMobileFiltered = cps_mobile.filter((cp) => cp.cp_id);

            // Loop trough all the selected CPs and insert them into the event
            // Because is the admin role we need to insert the CPs into the table with is_cervezanas_event flag
            cpsMobileFiltered.map(async (cp: ICPM_events) => {
                if (!cp.owner_id) {
                    handleMessage({
                        type: 'error',
                        message: t('error_inserting_cp_event_no_cp_owner_id'),
                    });
                    return;
                }

                const { error: cpError } = await supabase
                    .from('cpm_events')
                    .insert({
                        cp_id: cp.cp_id,
                        event_id: eventId,
                        owner_id: cp.owner_id,
                        is_cervezanas_event: true,
                        is_active: true,
                    });

                if (cpError) {
                    throw cpError;
                }

                // Notify to producer that the CP was added to the event
                const newCPLinkedToCervezanasEventMessage = `El PC ${cp.cp_mobile?.cp_name} se ha registrado en el evento ${event.name}. Puedes configurarlo en el apartado de eventos, dentro del perfil.`;
                const producerLink = `${ROUTE_PRODUCER}${ROUTE_PROFILE}${ROUTE_EVENTS}`;

                sendPushNotification(
                    cp.owner_id,
                    newCPLinkedToCervezanasEventMessage,
                    producerLink,
                );
            });
        }

        if (cps_fixed) {
            // Get CP checked from the list
            const cpsFixedFiltered = cps_fixed.filter((cp) => cp.cp_id);

            // Loop trough all the selected CPs and insert them into the event
            // Because is the admin role we need to insert the CPs into the table with is_cervezanas_event flag
            cpsFixedFiltered.map(async (cp: ICPF_events) => {
                const { error: cpError } = await supabase
                    .from('cpf_events')
                    .insert({
                        cp_id: cp.cp_id,
                        event_id: eventId,
                        is_active: false,
                        owner_id: cp.owner_id,
                        is_cervezanas_event: true,
                    });

                if (cpError) {
                    throw cpError;
                }

                // Notify to producer that the CP was added to the event
                const newCPLinkedToCervezanasEventMessage = `El PC ${cp.cp_fixed?.cp_name} se ha registrado en el evento ${event.name}. Puedes configurarlo en el apartado de eventos, dentro del perfil.`;
                const producerLink = `${ROUTE_PRODUCER}${ROUTE_PROFILE}${ROUTE_EVENTS}`;

                sendPushNotification(
                    cp.owner_id,
                    newCPLinkedToCervezanasEventMessage,
                    producerLink,
                );
            });
        }

        setTimeout(() => {
            queryClient.invalidateQueries('events');
            setShowModal(false);
            reset();
        }, 500);
    };

    const insertEventMutation = useMutation({
        mutationKey: 'insertEvent',
        mutationFn: handleInsertEvent,
        onError: (error) => {
            console.error(error);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: ModalAddEventFormData,
    ) => {
        try {
            insertEventMutation.mutate(formValues);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ModalWithForm
            showBtn={true}
            showModal={showModal}
            setShowModal={setShowModal}
            title={'add_new_event'}
            btnTitle={'new_event'}
            description={''}
            icon={faAdd}
            btnSize={'large'}
            classIcon={'w-6 h-6'}
            classContainer={''}
            handler={handleSubmit(onSubmit)}
            form={form}
        >
            <form>
                {/* Event Information  */}
                <fieldset className="space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                    {/* Is Activated  */}
                    <div className="flex w-full flex-col items-end">
                        <label
                            className="relative inline-flex cursor-pointer items-center"
                            htmlFor="is_activated"
                        >
                            <input
                                id="is_activated"
                                type="checkbox"
                                className="peer sr-only"
                                {...register('is_activated', {
                                    required: true,
                                })}
                                defaultChecked={true}
                            />

                            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-beer-blonde peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beer-softFoam dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-beer-blonde"></div>

                            <span className="ml-3 text-lg font-medium text-gray-900 dark:text-gray-300">
                                {t('is_activated')}
                            </span>
                        </label>

                        <span className="mt-2 text-sm font-medium text-gray-400 dark:text-gray-300">
                            {t('is_activated_description')}
                        </span>
                    </div>

                    <legend className="m-2 text-2xl">{t('events_info')}</legend>

                    {/* Event name  */}
                    <InputLabel
                        form={form}
                        label={'name'}
                        registerOptions={{
                            required: true,
                        }}
                    />

                    {/* Event description  */}
                    <InputTextarea
                        form={form}
                        label={'description'}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder="Bienvenido al BBF, el festival de cerveza artesanal más grande de Barcelona. Te esperamos el 14, 15 y 16 de mayo en el Deportivo Lomas Altas. ¡No te lo pierdas!"
                    />

                    {/* Start date and end date  */}
                    <div className="flex flex-row space-x-2">
                        <InputLabel
                            form={form}
                            label={'start_date'}
                            registerOptions={{
                                required: true,
                                valueAsDate: true,
                            }}
                            inputType="date"
                        />

                        <InputLabel
                            form={form}
                            label={'end_date'}
                            registerOptions={{
                                required: true,
                                valueAsDate: true,
                            }}
                            inputType="date"
                        />
                    </div>
                </fieldset>

                {/* Logo and publicitary img */}
                <fieldset className="mt-12 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                    <legend className="text-2xl">
                        {t('event_advertising')}
                    </legend>

                    {/* Logo */}

                    {/* AD Img  */}
                </fieldset>

                {/* List of Mobil Consumption Points  */}
                <fieldset className="mt-12 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                    <legend className="text-2xl">
                        {t('cp_mobile_associated')}
                    </legend>

                    <SearchCheckboxCPMobiles
                        cpsMobile={cpsMobile}
                        form={form}
                    />
                </fieldset>

                {/* List of Fixed Consumption Points  */}
                <fieldset className="mt-12 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                    <legend className="text-2xl">
                        {t('cp_fixed_associated')}
                    </legend>

                    <SearchCheckboxCPFixeds cpsFixed={cpsFixed} form={form} />
                </fieldset>
            </form>
        </ModalWithForm>
    );
}
