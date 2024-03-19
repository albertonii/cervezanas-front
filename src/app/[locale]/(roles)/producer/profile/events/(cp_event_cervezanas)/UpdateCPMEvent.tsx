'use client';

import InputLabel from '../../../../../components/common/InputLabel';
import InputTextarea from '../../../../../components/common/InputTextarea';
import ModalWithForm from '../../../../../components/modals/ModalWithForm';
import React, { ComponentProps, useEffect, useState } from 'react';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../../../../(auth)/Context/useAuth';
import { useMutation, useQueryClient } from 'react-query';
import { ICPM_events } from '../../../../../../../lib/types/types';
import { formatDateDefaultInput } from '../../../../../../../utils/formatDate';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod';
import { SearchCheckboxExperiences } from './SearchCheckboxExperiences';

type ModalUpdCPMEventFormData = {
    cp_id: string;
    event_id: string;
    is_active: boolean;
    is_cervezanas_event: boolean;
    owner_id: string;
    event: {
        id: string;
        created_at: string;
        name: string;
        description: string;
        start_date: string;
        end_date: string;
        status?: string;
        is_activated?: boolean;
        is_cervezanas_event?: boolean;
        owner_id?: string;
    };
    event_experiences?: {
        id?: string;
        experience_id?: string;
        cp_mobile_id?: string;
        cp_fixed_id?: string;
        event_id?: string;
    }[];
    removed_event_experiences?: {
        id?: string;
    }[];
};

const schema: ZodType<ModalUpdCPMEventFormData> = z.object({
    cp_id: z.string().nonempty({ message: 'errors.input_required' }),
    event_id: z.string().nonempty({ message: 'errors.input_required' }),
    is_active: z.boolean(),
    is_cervezanas_event: z.boolean(),
    owner_id: z.string().nonempty({ message: 'errors.input_required' }),
    event: z.object({
        id: z.string().nonempty({ message: 'errors.input_required' }),
        created_at: z.string().nonempty({ message: 'errors.input_required' }),
        name: z.string().nonempty({ message: 'errors.input_required' }),
        description: z.string().nonempty({ message: 'errors.input_required' }),
        start_date: z.string().nonempty({ message: 'errors.input_required' }),
        end_date: z.string().nonempty({ message: 'errors.input_required' }),
        status: z.string().optional(),
        is_activated: z.boolean().optional(),
        is_cervezanas_event: z.boolean().optional(),
        owner_id: z.string().optional(),
    }),
    event_experiences: z.array(
        z.object({
            id: z.string().optional(),
            experience_id: z.string().optional(),
            cp_mobile_id: z.string().optional(),
            cp_fixed_id: z.string().optional(),
            event_id: z.string().optional(),
        }),
    ),
    removed_event_experiences: z.array(
        z.object({
            id: z.string().optional(),
        }),
    ),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    selectedCPMEvent: ICPM_events;
    isEditModal: boolean;
    handleEditModal: ComponentProps<any>;
}

export default function UpdateCPMEventModal({
    selectedCPMEvent,
    isEditModal,
    handleEditModal,
}: Props) {
    const t = useTranslations();
    const { supabase } = useAuth();

    const queryClient = useQueryClient();

    const form = useForm<ValidationSchema>({
        resolver: zodResolver(schema),
        defaultValues: {
            cp_id: selectedCPMEvent.cp_id,
            event_id: selectedCPMEvent.event_id,
            is_active: selectedCPMEvent.is_active,
            is_cervezanas_event: selectedCPMEvent.is_cervezanas_event,
            owner_id: selectedCPMEvent.owner_id,
            event_experiences: [],
            event: {
                id: selectedCPMEvent.events?.id ?? '',
                created_at: formatDateDefaultInput(
                    selectedCPMEvent.events?.created_at ?? '',
                ),
                name: selectedCPMEvent.events?.name ?? '',
                description: selectedCPMEvent.events?.description ?? '',
                start_date: formatDateDefaultInput(
                    selectedCPMEvent.events?.start_date ?? '',
                ),
                end_date: formatDateDefaultInput(
                    selectedCPMEvent.events?.end_date ?? '',
                ),
                status: selectedCPMEvent.events?.status ?? '',
                owner_id: selectedCPMEvent.events?.owner_id ?? '',
                is_activated: selectedCPMEvent.events?.is_activated ?? false,
                is_cervezanas_event:
                    selectedCPMEvent.events?.is_cervezanas_event ?? false,
            },
            removed_event_experiences: [],
        },
    });

    const {
        handleSubmit,
        formState: { errors },
    } = form;

    // Update CPMEvent in database
    const handleUpdate = async (formValues: ModalUpdCPMEventFormData) => {
        const { event_experiences, removed_event_experiences } = formValues;

        // If there are removed experiences, delete them
        removed_event_experiences?.map(async (removedEventExperience) => {
            if (!removedEventExperience) return;

            if (removedEventExperience.id) {
                const { error } = await supabase
                    .from('event_experiences')
                    .delete()
                    .eq('id', removedEventExperience.id);

                if (error) throw error;
            }
        });

        event_experiences?.map(async (eventExperience) => {
            if (!eventExperience) return;

            if (eventExperience.id) {
                const { error } = await supabase
                    .from('event_experiences')
                    .update({
                        experience_id: eventExperience.experience_id,
                        event_id: eventExperience.event_id,
                        cp_mobile_id: eventExperience.cp_mobile_id,
                        cp_fixed_id: null,
                    })
                    .eq('id', eventExperience.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('event_experiences')
                    .insert({
                        experience_id: eventExperience.experience_id,
                        event_id: eventExperience.event_id,
                        cp_mobile_id: eventExperience.cp_mobile_id,
                        cp_fixed_id: null,
                    });

                if (error) throw error;
            }
        });

        handleEditModal(false);

        queryClient.invalidateQueries('cpm_events');
    };

    const updateEventMutation = useMutation({
        mutationKey: ['update_cpm_events'],
        mutationFn: handleUpdate,
        onError: (e: any) => {
            console.error(e);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: ModalUpdCPMEventFormData,
    ) => {
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
                <form>
                    {/* Event Information  */}
                    <fieldset className="space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                        {/* Is Activated  */}
                        <div className="flex w-full flex-col items-end">
                            <label
                                className="relative inline-flex cursor-pointer items-center"
                                htmlFor="is_activated"
                            >
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
                            label={'event.name'}
                            registerOptions={{
                                required: true,
                            }}
                            disabled
                        />

                        {/* Event description  */}
                        <InputTextarea
                            form={form}
                            label={'event.description'}
                            registerOptions={{
                                required: true,
                            }}
                            placeholder="The event every beer lover is waiting for!"
                            disabled
                        />

                        {/* Start date and end date  */}
                        <div className="flex flex-row space-x-2">
                            <InputLabel
                                form={form}
                                label={'event.start_date'}
                                registerOptions={{
                                    required: true,
                                }}
                                inputType="date"
                                disabled
                            />

                            <InputLabel
                                form={form}
                                label={'event.end_date'}
                                registerOptions={{
                                    required: true,
                                }}
                                inputType="date"
                                disabled
                            />
                        </div>
                    </fieldset>

                    {/* Asociar las experiencias que tenga el productor configuradas al punto de consumo para ese evento  */}
                    <fieldset className="space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                        <legend className="m-2 text-2xl">
                            {t('associate_experiences')}
                        </legend>

                        <SearchCheckboxExperiences
                            cpMobileId={selectedCPMEvent.cp_id}
                            eventId={selectedCPMEvent.event_id}
                            form={form}
                        />
                    </fieldset>
                </form>
            </>
        </ModalWithForm>
    );
}
