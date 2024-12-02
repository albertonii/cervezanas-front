'use client';

import InputLabel from '@/app/[locale]/components/form/InputLabel';
import InputTextarea from '@/app/[locale]/components/form/InputTextarea';
import ModalWithForm from '@/app/[locale]/components/modals/ModalWithForm';
import useFetchCPSEventByEventsId from '@/hooks/useFetchCPsEventByEventId ';
import React, { ComponentProps, useEffect } from 'react';
import { z, ZodType } from 'zod';
import { useTranslations } from 'next-intl';
import { IEvent } from '@/lib/types/eventOrders';
import { sendPushNotification } from '@/lib//actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from 'react-query';
import { formatDateDefaultInput } from '@/utils/formatDate';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { SearchCheckboxCPs } from '@/app/[locale]/components/common/SearchCheckboxCPs';
import { ROUTE_EVENTS, ROUTE_PRODUCER, ROUTE_PROFILE } from '@/config';
import {
    IConsumptionPoint,
    IConsumptionPointEvent,
} from '@/lib/types/consumptionPoints';

interface ModalUpdateFormData {
    is_activated: boolean;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    logo_url: string;
    promotional_url: string;
    cps?: IConsumptionPointEvent[];
    removed_cps?: {
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
    cps: z.any(),
    removed_cps: z.array(
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
    cps: IConsumptionPoint[];
}

export default function UpdateEventModal({
    selectedEvent,
    isEditModal,
    handleEditModal,
    cps,
}: Props) {
    const t = useTranslations();
    const { supabase } = useAuth();

    const queryClient = useQueryClient();

    const {
        data: checkedCPs,
        isLoading,
        isFetching,
        refetch,
        isFetchedAfterMount,
    } = useFetchCPSEventByEventsId(selectedEvent.id);

    useEffect(() => {
        if (isFetchedAfterMount) {
            refetch();
        }
    }, [isFetchedAfterMount]);

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
            removed_cps:
                checkedCPs?.map((cp) => ({
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
            cps,
            removed_cps,
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

        handleCheckedCPs(cps ?? [], removed_cps);

        handleEditModal(false);

        queryClient.invalidateQueries('events');
    };

    const handleCheckedCPs = (
        cps: IConsumptionPointEvent[],
        removed_cps: any,
    ) => {
        // Eliminar los CP del listado de CPs a eliminar
        removed_cps.map(async (cp: { id: string }) => {
            const { error: cpError } = await supabase
                .from('cp_events')
                .delete()
                .eq('cp_id', cp.id)
                .eq('event_id', selectedEvent.id);

            if (cpError) {
                throw cpError;
            }
        });

        // // Insertar los nuevos CPs asociados al evento
        cps?.forEach(async (cp) => {
            const { error } = await supabase.from('cp_events').insert({
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
            btnTitle={'save'}
            description={''}
            icon={faAdd}
            handler={handleSubmit(onSubmit)}
            classContainer={''}
            form={form}
        >
            <>
                {isFetching && <p>Loading...</p>}
                {isLoading && <p>Loading...</p>}
                {!isLoading && !isFetching && (
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
                                placeholder={t('introduce_event_name')}
                            />

                            {/* Event description  */}
                            <InputTextarea
                                form={form}
                                label={'description'}
                                registerOptions={{
                                    required: true,
                                }}
                                placeholder={`${t(
                                    'introduce_event_description',
                                )}`}
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
                                {t('cp_associated')}
                            </legend>

                            {/* List of CPs  */}
                            <SearchCheckboxCPs
                                cps={cps}
                                checkedCPs={checkedCPs}
                                form={form}
                            />
                        </fieldset>
                    </form>
                )}
            </>
        </ModalWithForm>
    );
}
