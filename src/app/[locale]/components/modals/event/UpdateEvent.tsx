'use client';

import React, { ComponentProps, useEffect } from 'react';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { useMutation, useQueryClient } from 'react-query';
import {
    ICPFixed,
    ICPF_events,
    ICPMobile,
    ICPM_events,
    IEvent,
} from '../../../../../lib/types/types';
import { formatDateDefaultInput } from '../../../../../utils/formatDate';
import useFetchCPSMobileByEventsId from '../../../../../hooks/useFetchCPsMobileByEventId';
import InputLabel from '../../common/InputLabel';
import InputTextarea from '../../common/InputTextarea';
import { SearchCheckboxCPMobiles } from '../../common/SearchCheckboxCPMobiles';
import { SearchCheckboxCPFixeds } from '../../common/SearchCheckboxCPFixed';
import useFetchCPSFixedByEventsId from '../../../../../hooks/useFetchCPsFixedByEventId';
import ModalWithForm from '../ModalWithForm';

interface FormData {
    is_activated: boolean;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    logo_url: string;
    promotional_url: string;
    cps_mobile: ICPM_events[];
    cps_fixed: ICPF_events[];
}

interface Props {
    selectedCPMEvent: ICPM_events;
    isEditModal: boolean;
    handleEditModal: ComponentProps<any>;
    cpsMobile: ICPMobile[];
    cpsFixed: ICPFixed[];
}

export default function UpdateEventModal({
    selectedCPMEvent,
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
    } = useFetchCPSMobileByEventsId(selectedCPMEvent.event_id);

    const {
        data: checkedCPFixed,
        isLoading: isLoadingFixed,
        isFetching: isFetchingFixed,
        refetch: refetchFixed,
    } = useFetchCPSFixedByEventsId(selectedCPMEvent.event_id);

    useEffect(() => {
        refetchMobile();
        refetchFixed();
    }, []);

    const form = useForm<FormData>({
        defaultValues: {
            is_activated: selectedCPMEvent.events?.is_activated,
            name: selectedCPMEvent.events?.name,
            description: selectedCPMEvent.events?.description,
            start_date: formatDateDefaultInput(
                selectedCPMEvent.events?.start_date ?? '',
            ),
            end_date: formatDateDefaultInput(
                selectedCPMEvent.events?.end_date ?? '',
            ),
            logo_url: selectedCPMEvent.events?.logo_url ?? '',
            promotional_url: selectedCPMEvent.events?.promotional_url ?? '',
        },
    });

    const { handleSubmit, register } = form;

    // Update Event in database
    const handleUpdate = async (formValues: FormData) => {
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
        } = formValues;

        if (!selectedCPMEvent) return;

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
            .eq('id', selectedCPMEvent.event_id);

        if (error) throw error;

        handleCheckedCPMobiles(cps_mobile);
        handleCheckedCPFixed(cps_fixed);

        handleEditModal(false);

        queryClient.invalidateQueries({ queryKey: ['events'] });
    };

    const handleCheckedCPMobiles = (cps_mobile: ICPM_events[]) => {
        // Comprobar si todos los elementos de checkedCPMobiles están en cps_mobile
        const allCheckedInNew = checkedCPMobiles?.every((cp) =>
            cps_mobile.some((item) => item.cp_id === cp.cp_id),
        );

        // Comprobar si todos los elementos de cps_mobile están en checkedCPMobiles
        const allNewInChecked = cps_mobile.every((item) =>
            checkedCPMobiles?.some((cp) => cp.cp_id === item.cp_id),
        );

        // Si hay cambios, actualiza los CPs móviles asociados al evento
        if (!allCheckedInNew || !allNewInChecked) {
            // Eliminar todos los CPs asociados al evento
            checkedCPMobiles?.forEach(async (cp) => {
                const { error: cpError } = await supabase
                    .from('cpm_events')
                    .delete()
                    .eq('cp_id', cp.cp_id)
                    .eq('event_id', selectedCPMEvent.event_id);

                if (cpError) {
                    throw cpError;
                }
            });

            // // Insertar los nuevos CPs asociados al evento
            cps_mobile?.forEach(async (item) => {
                const { error } = await supabase.from('cpm_events').insert({
                    cp_id: item.cp_id,
                    event_id: selectedCPMEvent.event_id,
                    is_active: false,
                });
                if (error) {
                    throw error;
                }
            });
        }
    };

    const handleCheckedCPFixed = (cps_fixed: ICPF_events[]) => {
        // Comprobar si todos los elementos de checkedCPFixed están en cps_fixed
        const allCheckedInNew = checkedCPFixed?.every((cp) =>
            cps_fixed.some((item) => item.cp_id === cp.cp_id),
        );

        // Comprobar si todos los elementos de cps_fixed están en checkedCPFixed
        const allNewInChecked = cps_fixed.every((item) =>
            checkedCPFixed?.some((cp) => cp.cp_id === item.cp_id),
        );

        // Si hay cambios, actualiza los CPs móviles asociados al evento
        if (!allCheckedInNew || !allNewInChecked) {
            // Eliminar todos los CPs asociados al evento
            checkedCPFixed?.forEach(async (cp) => {
                const { error: cpError } = await supabase
                    .from('cpf_events')
                    .delete()
                    .eq('cp_id', cp.cp_id)
                    .eq('event_id', selectedCPMEvent.event_id);

                if (cpError) {
                    throw cpError;
                }
            });

            // // Insertar los nuevos CPs asociados al evento
            cps_fixed?.forEach(async (item) => {
                const { error } = await supabase.from('cpf_events').insert({
                    cp_id: item.cp_id,
                    event_id: selectedCPMEvent.event_id,
                    is_active: false,
                });
                if (error) {
                    throw error;
                }
            });
        }
    };

    const updateEventMutation = useMutation({
        mutationKey: ['updateEvent'],
        mutationFn: handleUpdate,
        onError: (e: any) => {
            console.error(e);
        },
    });

    const onSubmit = (formValues: FormData) => {
        try {
            updateEventMutation.mutate(formValues);
        } catch (e) {
            console.error(e);
        }
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
                                    {/* TODO: INFORMAR SI ESTÁ ACTIVADO O NO */}
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
