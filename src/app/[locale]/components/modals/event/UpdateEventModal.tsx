'use client';

import ModalWithForm from '../ModalWithForm';
import Label from '../../ui/Label';
import Title from '../../ui/Title';
import InputLabel from '../../form/InputLabel';
import SelectInput from '../../form/SelectInput';
import InputTextarea from '../../form/InputTextarea';
import useFetchCPSEventByEventsId from '@/hooks/useFetchCPsEventByEventId'; // Corregido
import React, { ComponentProps, useEffect } from 'react';
import { z, ZodType } from 'zod';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { IEvent } from '@/lib/types/eventOrders';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { useMutation, useQueryClient } from 'react-query';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { formatDateDefaultInput } from '@/utils/formatDate';
import { EventCategory, EVENT_CATEGORIES } from '@/lib/enums';
import { DisplayInputError } from '../../ui/DisplayInputError';
import { SearchCheckboxCPs } from '../../common/SearchCheckboxCPs';
import {
    IConsumptionPoint,
    IConsumptionPointEventNoCircularDependency,
} from '@/lib/types/consumptionPoints';
import { validateDateRange } from '@/utils/ZodValidationUtils';

interface FormData {
    is_activated: boolean;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    logo_url: string;
    promotional_url: string;
    category: string;
    cps?: IConsumptionPointEventNoCircularDependency[];
    removed_cps?: {
        id?: string;
    }[];
}

const consumptionPointEventSchema = z.object({
    id: z.string(),
    created_at: z.string(),
    cp_id: z.string(),
    cp_name: z.string(),
    cp_description: z.string(),
    status: z.string(),
    event_id: z.string(),
    owner_id: z.string(),
    is_active: z.boolean(),
    is_cervezanas_event: z.boolean(),
});

const schema: ZodType<FormData> = z
    .object({
        is_activated: z.boolean(),
        name: z.string().nonempty({ message: 'errors.input_required' }),
        description: z.string().nonempty({ message: 'errors.input_required' }),
        start_date: z.string().nonempty({ message: 'errors.input_required' }),
        end_date: z.string().nonempty({ message: 'errors.input_required' }),
        logo_url: z.string(),
        promotional_url: z.string(),
        cps: z
            .array(consumptionPointEventSchema)
            // .min(1, {
            //     message: 'Debe seleccionar al menos un punto de consumo',
            // })
            .optional(),
        category: z.string(),
        removed_cps: z.array(
            z.object({
                id: z.string().optional(),
            }),
        ),
    })
    .superRefine((data, ctx) => {
        const dateError = validateDateRange(data.start_date, data.end_date);
        if (dateError !== true) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['end_date'],
                message: dateError,
            });
        }
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
    const t = useTranslations('event');
    const { supabase } = useAuth();

    const queryClient = useQueryClient();

    const {
        data: checkedCPs,
        isLoading,
        isFetching,
    } = useFetchCPSEventByEventsId(selectedEvent.id);

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
            category: selectedEvent.category || EventCategory.SOCIAL_GATHERINGS,
            cps: [], // Inicialmente vacío
            removed_cps: [],
        },
    });

    const {
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = form;

    useEffect(() => {
        console.log('selectedEvent.category:', selectedEvent.category);
        console.log(
            'Matching category:',
            EVENT_CATEGORIES.find(
                (cat) => cat.value === selectedEvent.category,
            ),
        );
    }, [selectedEvent]);

    // Reiniciar el formulario cuando checkedCPs esté disponible
    useEffect(() => {
        if (checkedCPs) {
            reset({
                is_activated: selectedEvent.is_activated,
                name: selectedEvent.name,
                description: selectedEvent.description,
                start_date: formatDateDefaultInput(selectedEvent.start_date),
                end_date: formatDateDefaultInput(selectedEvent.end_date),
                logo_url: selectedEvent.logo_url ?? '',
                promotional_url: selectedEvent.promotional_url ?? '',
                category: selectedEvent.category,
                cps: checkedCPs.map((cp) => ({
                    cp_id: cp.cp_id,
                    cp_name: cp.cp_name,
                    cp_description: cp.cp_description,
                    status: cp.status,
                    event_id: cp.event_id,
                    owner_id: cp.owner_id,
                    is_active: cp.is_active,
                    is_cervezanas_event: cp.is_cervezanas_event,
                })),
                removed_cps: checkedCPs.map((cp) => ({
                    id: cp.cp_id,
                })),
            });
        }
    }, [checkedCPs, reset, selectedEvent]);

    useEffect(() => {
        console.log(errors);
    }, [errors]);

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
            category,
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
                category,
                is_activated, // Asegurarse de actualizar este campo también
            })
            .eq('id', selectedEvent.id);

        if (error) throw error;

        handleCheckedCPs(cps ?? [], removed_cps);

        handleEditModal(false);

        queryClient.invalidateQueries('events');
    };

    const handleCheckedCPs = (
        cps: IConsumptionPointEventNoCircularDependency[],
        removed_cps: any,
    ) => {
        // Comprobar si todos los elementos de checkedCPs están en cps
        const allCheckedInNew = checkedCPs?.every((cp) =>
            cps.some((item) => item.cp_id === cp.cp_id),
        );

        // Comprobar si todos los elementos de cps están en checkedCP
        const allNewInChecked = cps.every((item) =>
            checkedCPs?.some((cp) => cp.cp_id === item.cp_id),
        );

        // Si hay cambios, actualiza los CPs móviles asociados al evento
        if (!allCheckedInNew || !allNewInChecked) {
            // Eliminar todos los CPs asociados al evento
            checkedCPs?.forEach(async (cp) => {
                const { error: cpError } = await supabase
                    .from('cp_events')
                    .delete()
                    .eq('cp_id', cp.cp_id)
                    .eq('event_id', selectedEvent.id);

                if (cpError) {
                    throw cpError;
                }
            });

            // Insertar los nuevos CPs asociados al evento
            cps?.forEach(async (cp) => {
                const { error } = await supabase.from('cp_events').insert({
                    owner_id: cp.owner_id,
                    event_id: selectedEvent.id,
                    cp_id: cp.cp_id,
                    cp_name: cp.cp_name,
                    cp_description: cp.cp_description,
                    is_active: true,
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

    const handleChangeCategory = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const value = event.target.value as EventCategory;
        setValue('category', value);
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
                                    className="relative inline-flex cursor-pointer items-center gap-4"
                                    htmlFor="is_activated"
                                >
                                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-beer-blonde peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beer-softFoam dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-beer-blonde"></div>

                                    <Label
                                        size="large"
                                        font="medium"
                                        color="gray"
                                    >
                                        {t('is_activated')}
                                    </Label>
                                </label>

                                <span className="mt-2 text-sm font-medium text-gray-400 dark:text-gray-300">
                                    {t('is_activated_description')}
                                </span>
                            </div>

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
                                    onChange={handleChangeCategory}
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

                        {/* List of Consumption Points  */}
                        <fieldset className="mt-4 space-y-4 rounded-md border-2 border-beer-softBlondeBubble px-4 pb-4">
                            <legend>
                                <Title size="large">{t('cp_associated')}</Title>
                            </legend>

                            {/* Error message */}
                            {errors.cps && errors.cps.root?.message && (
                                <DisplayInputError
                                    message={errors.cps.root.message}
                                />
                            )}

                            {/* List of CPs  */}
                            <SearchCheckboxCPs
                                cps={cps}
                                checkedCPs={checkedCPs}
                                form={form}
                                selectedEventId={selectedEvent.id} // Añadido
                            />
                        </fieldset>
                    </form>
                )}
            </>
        </ModalWithForm>
    );
}
