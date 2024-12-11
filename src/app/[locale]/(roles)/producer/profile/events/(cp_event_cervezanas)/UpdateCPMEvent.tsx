'use client';

import InputLabel from '@/app/[locale]/components/form/InputLabel';
import InputTextarea from '@/app/[locale]/components/form/InputTextarea';
import ModalWithForm from '@/app/[locale]/components/modals/ModalWithForm';
import React, { ComponentProps, useState } from 'react';
import { z, ZodType } from 'zod';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from 'react-query';
import { formatDateDefaultInput } from '@/utils/formatDate';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import { useAuth } from '../../../../../(auth)/Context/useAuth';
import { SearchCheckboxExperiences } from './SearchCheckboxExperiences';

type ModalUpdCPEventFormData = {
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
        cp_id?: string;
        event_id?: string;
    }[];
    removed_event_experiences?: {
        id?: string;
    }[];
};

const schema: ZodType<ModalUpdCPEventFormData> = z.object({
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
            cp_id: z.string().optional(),
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
    selectedCPEvent: IConsumptionPointEvent;
    isEditModal: boolean;
    handleEditModal: ComponentProps<any>;
}

export default function UpdateCPEventModal({
    selectedCPEvent,
    isEditModal,
    handleEditModal,
}: Props) {
    const t = useTranslations();
    const { supabase } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<ValidationSchema>({
        resolver: zodResolver(schema),
        defaultValues: {
            cp_id: selectedCPEvent.cp_id,
            event_id: selectedCPEvent.event_id,
            is_active: selectedCPEvent.is_active,
            is_cervezanas_event: selectedCPEvent.is_cervezanas_event,
            owner_id: selectedCPEvent.owner_id,
            event_experiences: [],
            event: {
                id: selectedCPEvent.events?.id ?? '',
                created_at: formatDateDefaultInput(
                    selectedCPEvent.events?.created_at ?? '',
                ),
                name: selectedCPEvent.events?.name ?? '',
                description: selectedCPEvent.events?.description ?? '',
                start_date: formatDateDefaultInput(
                    selectedCPEvent.events?.start_date ?? '',
                ),
                end_date: formatDateDefaultInput(
                    selectedCPEvent.events?.end_date ?? '',
                ),
                status: selectedCPEvent.events?.status ?? '',
                owner_id: selectedCPEvent.events?.owner_id ?? '',
                is_activated: selectedCPEvent.events?.is_activated ?? false,
                is_cervezanas_event:
                    selectedCPEvent.events?.is_cervezanas_event ?? false,
            },
            removed_event_experiences: [],
        },
    });

    const {
        handleSubmit,
        formState: { errors },
    } = form;

    // Update CPMEvent in database
    const handleUpdate = async (formValues: ModalUpdCPEventFormData) => {
        setIsLoading(true);

        const { event_experiences, removed_event_experiences } = formValues;

        // If there are removed experiences, delete them
        removed_event_experiences?.map(async (removedEventExperience) => {
            if (!removedEventExperience) return;

            if (removedEventExperience.id) {
                const { error } = await supabase
                    .from('event_experiences')
                    .delete()
                    .eq('id', removedEventExperience.id);

                if (error) {
                    setIsLoading(false);
                    throw error;
                }
            }
        });

        event_experiences?.map(async (eventExperience) => {
            if (!eventExperience || !eventExperience.id) return;

            const { error } = await supabase
                .from('event_experiences')
                .update({
                    experience_id: eventExperience.experience_id,
                    event_id: eventExperience.event_id,
                    cp_id: eventExperience.cp_id,
                })
                .eq('id', eventExperience.id);

            if (error) {
                setIsLoading(false);
                throw error;
            }
        });

        handleEditModal(false);
        setIsLoading(false);
        queryClient.invalidateQueries(['cp_events', selectedCPEvent.event_id]);
    };

    const updateEventMutation = useMutation({
        mutationKey: ['update_cp_events'],
        mutationFn: handleUpdate,
        onError: (e: any) => {
            console.error(e);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: ModalUpdCPEventFormData,
    ) => {
        return new Promise<void>((resolve, reject) => {
            updateEventMutation.mutate(formValues, {
                onSuccess: () => {
                    resolve();
                },
                onError: (error) => {
                    reject(error);
                },
            });
        });
    };

    return (
        <ModalWithForm
            showBtn={false}
            showModal={isEditModal}
            setShowModal={handleEditModal}
            title={'edit_event'}
            btnTitle={'save'}
            description={''}
            icon={faAdd}
            handler={handleSubmit(onSubmit)}
            classContainer={`${isLoading && ' opacity-75'}`}
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
                            cpId={selectedCPEvent.cp_id}
                            eventId={selectedCPEvent.event_id}
                            form={form}
                        />
                    </fieldset>
                </form>
            </>
        </ModalWithForm>
    );
}
