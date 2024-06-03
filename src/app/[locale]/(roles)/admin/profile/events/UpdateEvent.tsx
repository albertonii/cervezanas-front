'use client';

import React, { ComponentProps, useEffect } from 'react';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from 'react-query';
import {
    ICPFixed,
    ICPF_events,
    ICPMobile,
    ICPM_events,
    IEvent,
} from '../../../../../../lib/types/types';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import useFetchCPSMobileByEventsId from '../../../../../../hooks/useFetchCPsMobileByEventId';
import useFetchCPSFixedByEventsId from '../../../../../../hooks/useFetchCPsFixedByEventId';
import { formatDateDefaultInput } from '../../../../../../utils/formatDate';
import ModalWithForm from '../../../../components/modals/ModalWithForm';
import InputLabel from '../../../../components/common/InputLabel';
import InputTextarea from '../../../../components/common/InputTextarea';
import {
    ROUTE_EVENTS,
    ROUTE_PRODUCER,
    ROUTE_PROFILE,
} from '../../../../../../config';
import { sendPushNotification } from '../../../../../../lib/actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod';
import { SearchCheckboxCPMobiles } from './SearchCheckboxCPMobiles';
import { SearchCheckboxCPFixeds } from './SearchCheckboxCPFixed';
interface ModalUpdateFormData {
    is_activated: boolean;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    logo_url: string;
    promotional_url: string;
    cps_mobile?: ICPM_events[];
    cps_fixed?: ICPF_events[];
    removed_cps_mobile?: {
        id?: string;
    }[];
    removed_cps_fixed?: {
        id?: string;
    }[];
}

const schema: ZodType<ModalUpdateFormData> = z.object({
    is_activated: z.boolean(),
    name: z.string(),
    description: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    logo_url: z.string(),
    promotional_url: z.string(),
    cps_mobile: z.any(),
    cps_fixed: z.any(),
    removed_cps_mobile: z.array(
        z.object({
            id: z.string().optional(),
        }),
    ),
    removed_cps_fixed: z.array(
        z.object({
            id: z.string().optional(),
        }),
    ),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    selectedEvent: IEvent;
    isEditModal: boolean;
    handleEditModal: ComponentProps<any>;
    cpsMobile: ICPMobile[];
    cpsFixed: ICPFixed[];
}

export default function UpdateEventModal({
    selectedEvent,
    isEditModal,
    handleEditModal,
    cpsMobile,
    cpsFixed,
}: Props) {
    const t = useTranslations();
    const { supabase } = useAuth();

    const queryClient = useQueryClient();

    const {
        data: checkedCPMobiles,
        isLoading: isLoadingMobile,
        isFetching: isFetchingMobile,
        refetch: refetchMobile,
    } = useFetchCPSMobileByEventsId(selectedEvent.id);

    const {
        data: checkedCPFixed,
        isLoading: isLoadingFixed,
        isFetching: isFetchingFixed,
        refetch: refetchFixed,
    } = useFetchCPSFixedByEventsId(selectedEvent.id);

    useEffect(() => {
        refetchMobile();
        refetchFixed();
    }, []);

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            is_activated: selectedEvent.is_activated,
            name: selectedEvent.name,
            description: selectedEvent.description,
            start_date: formatDateDefaultInput(selectedEvent.start_date),
            end_date: formatDateDefaultInput(selectedEvent.end_date),
            logo_url: selectedEvent.logo_url ?? '',
            promotional_url: selectedEvent.promotional_url ?? '',
            removed_cps_mobile:
                checkedCPMobiles?.map((cp) => ({
                    id: cp.cp_id,
                })) ?? [],
            removed_cps_fixed:
                checkedCPFixed?.map((cp) => ({
                    id: cp.cp_id,
                })) ?? [],
        },
    });

    const { handleSubmit, getValues } = form;

    // Update Event in database
    const handleUpdate = async (formValues: ModalUpdateFormData) => {
        const {
            is_activated,
            name,
            description,
            start_date,
            end_date,
            logo_url,
            promotional_url,
            cps_mobile,
            cps_fixed,
            removed_cps_mobile,
            removed_cps_fixed,
        } = formValues;

        if (!selectedEvent) return;

        const { error } = await supabase
            .from('events')
            .update({
                name,
                description,
                start_date,
                end_date,
                logo_url,
                promotional_url,
            })
            .eq('id', selectedEvent.id);

        if (error) throw error;

        handleCheckedCPMobiles(cps_mobile ?? [], removed_cps_mobile);
        handleCheckedCPFixed(cps_fixed ?? [], removed_cps_fixed);

        handleEditModal(false);

        queryClient.invalidateQueries('events');
    };

    const handleCheckedCPMobiles = (
        cps_mobile: ICPM_events[],
        removed_cps_mobile: any,
    ) => {
        // Eliminar los CP del listado de CPs a eliminar
        removed_cps_mobile.map(async (cp: { id: string }) => {
            const { error: cpError } = await supabase
                .from('cpm_events')
                .delete()
                .eq('cp_id', cp.id)
                .eq('event_id', selectedEvent.id);

            if (cpError) {
                throw cpError;
            }
        });

        // // Insertar los nuevos CPs asociados al evento
        cps_mobile?.forEach(async (cp) => {
            const { error } = await supabase.from('cpm_events').insert({
                cp_id: cp.cp_id,
                event_id: selectedEvent.id,
                owner_id: cp.owner_id,
                is_cervezanas_event: true,
                is_active: true,
            });
            if (error) {
                throw error;
            }

            // Notify to producer that the CP was added to the event
            const newCPLinkedToCervezanasEventMessage = `Se ha registrado un PC al Evento Cervezanas ${selectedEvent.name}. Puedes configurarlo en el apartado de eventos, dentro del perfil.`;
            const producerLink = `${ROUTE_PRODUCER}${ROUTE_PROFILE}${ROUTE_EVENTS}`;

            sendPushNotification(
                cp.owner_id,
                newCPLinkedToCervezanasEventMessage,
                producerLink,
            );
        });
        // }
    };

    const handleCheckedCPFixed = (
        cpfs_event: ICPF_events[],
        removed_cpf_mobile: any,
    ) => {
        // Eliminar los CP del listado de CPs a eliminar
        removed_cpf_mobile.map(async (cp: { id: string }) => {
            const { error: cpError } = await supabase
                .from('cpm_events')
                .delete()
                .eq('cp_id', cp.id)
                .eq('event_id', selectedEvent.id);

            if (cpError) {
                throw cpError;
            }
        });

        // // Insertar los nuevos CPs asociados al evento
        cpfs_event?.forEach(async (cp) => {
            const { error } = await supabase.from('cpf_events').insert({
                cp_id: cp.cp_id,
                event_id: selectedEvent.id,
                is_active: false,
            });
            if (error) {
                throw error;
            }

            // Notify to producer that the CP was added to the event
            const newCPLinkedToCervezanasEventMessage = `Se ha registrado un PC al Evento Cervezanas ${selectedEvent.name}. Puedes configurarlo en el apartado de eventos, dentro del perfil.`;
            const producerLink = `${ROUTE_PRODUCER}${ROUTE_PROFILE}${ROUTE_EVENTS}`;

            sendPushNotification(
                cp.owner_id,
                newCPLinkedToCervezanasEventMessage,
                producerLink,
            );
        });
    };

    const updateEventMutation = useMutation({
        mutationKey: ['updateEvent'],
        mutationFn: handleUpdate,
        onError: (e: any) => {
            console.error(e);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: ModalUpdateFormData,
    ) => {
        return new Promise<void>((resolve, reject) => {
            updateEventMutation.mutate(formValues, {
                onSuccess: () => resolve(),
                onError: (error) => reject(error),
            });
        });
    };

    return (
        <ModalWithForm
            showBtn={false}
            showModal={isEditModal}
            setShowModal={handleEditModal}
            title={t('edit_event') ?? 'Edit event'}
            btnTitle={t('edit_event')}
            description={''}
            icon={faAdd}
            handler={handleSubmit(onSubmit)}
            btnSize={'large'}
            classIcon={'w-6 h-6'}
            classContainer={''}
            form={form}
        >
            <>
                {isFetchingMobile && <p>Loading...</p>}
                {isLoadingMobile && <p>Loading...</p>}
                {!isLoadingMobile && !isFetchingMobile && (
                    <form>
                        {/* Event Information  */}
                        <fieldset className="space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                            {/* Is Activated  */}
                            <div className="flex w-full flex-col items-end">
                                <label
                                    className="relative inline-flex cursor-pointer items-center"
                                    htmlFor="is_activated"
                                >
                                    {/* <input
                                        id="is_activated"
                                        type="checkbox"
                                        className="peer sr-only"
                                        {...register('is_activated', {
                                            required: true,
                                        })}
                                    /> */}

                                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-beer-blonde peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beer-softFoam dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-beer-blonde"></div>

                                    <span className="ml-3 text-lg font-medium text-gray-900 dark:text-gray-300">
                                        {t('is_activated')}
                                    </span>
                                </label>

                                <span className="mt-2 text-sm font-medium text-gray-400 dark:text-gray-300">
                                    {t('is_activated_description')}
                                </span>
                            </div>

                            <legend className="m-2 text-2xl">
                                {t('events_info')}
                            </legend>

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
                                placeholder="The event every beer lover is waiting for!"
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
                        <fieldset className="mt-4 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                            <legend className="text-2xl">
                                {t('event_advertising')}
                            </legend>

                            {/* Logo */}

                            {/* AD Img  */}
                        </fieldset>

                        {/* List of Mobile Consumption Points  */}
                        <fieldset className="mt-4 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                            <legend className="text-2xl">
                                {t('cp_mobile_associated')}
                            </legend>

                            {/* List of CPs  */}
                            <SearchCheckboxCPMobiles
                                cpsMobile={cpsMobile}
                                checkedCPs={checkedCPMobiles}
                                form={form}
                            />
                        </fieldset>

                        {/* List of Fixed Consumption Points  */}
                        <fieldset className="mt-4 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                            <legend className="text-2xl">
                                {t('cp_fixed_associated')}
                            </legend>

                            {/* List of CPs  */}
                            <SearchCheckboxCPFixeds
                                cpsFixed={cpsFixed}
                                checkedCPs={checkedCPFixed}
                                form={form}
                            />
                        </fieldset>
                    </form>
                )}
            </>
        </ModalWithForm>
    );
}
