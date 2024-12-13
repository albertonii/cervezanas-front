'use client';

import Title from '../../ui/Title';
import dynamic from 'next/dynamic';
import Spinner from '../../ui/Spinner';
import ExperienceForm from '../../../(roles)/producer/profile/events/ExperienceForm';
import BasicEventForm from '../../../(roles)/producer/profile/events/(producer_events)/BasicEventForm';
import React, { useEffect, useState } from 'react';
import { z, ZodType } from 'zod';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { useMutation, useQueryClient } from 'react-query';
import { SearchCheckboxCPs } from '../../common/SearchCheckboxCPs';
import {
    IConsumptionPoint,
    IConsumptionPointEventNoCircularDependency,
} from '@/lib/types/consumptionPoints';
import { EventCategory } from '@/lib/enums';

const ModalWithForm = dynamic(() => import('../ModalWithForm'), { ssr: false });

export type ModalAddEventFormData = {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    // logo_url: string;
    // promotional_url: string;
    category: string;
    cps?: IConsumptionPointEventNoCircularDependency[];
    event_experiences?: {
        experience_id?: string;
        cp_id?: string;
    }[];
};

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

const schema: ZodType<ModalAddEventFormData> = z
    .object({
        name: z.string().nonempty({ message: 'errors.input_required' }),
        description: z.string().nonempty({ message: 'errors.input_required' }),
        start_date: z.string().nonempty({ message: 'errors.input_required' }),
        end_date: z.string().nonempty({ message: 'errors.input_required' }),
        // logo_url: z.string(),
        // promotional_url: z.string(),
        cps: z
            .array(consumptionPointEventSchema)
            // .min(1, {
            //     message: 'Debe seleccionar al menos un punto de consumo',
            // })
            .optional(),
        category: z.string(),
        event_experiences: z.array(
            z.object({
                experience_id: z.string().optional(),
                cp_id: z.string().optional(),
            }),
        ),
    })
    .superRefine((data, ctx) => {
        // Validar que end_date sea posterior a start_date
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        if (startDate > endDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['end_date'],
                message:
                    'La fecha de fin debe ser posterior o igual a la fecha de inicio',
            });
        }
    });

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    cps: IConsumptionPoint[];
}

export default function AddEventModal({ cps }: Props) {
    const t = useTranslations('event');
    const { user, supabase } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState<boolean>(false);

    const queryClient = useQueryClient();

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            description: '',
            start_date: '',
            end_date: '',
            category: EventCategory.SOCIAL_GATHERINGS, // Valor predeterminado
            cps: [],
            event_experiences: [],
        },
    });

    const {
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
    } = form;

    useEffect(() => {
        console.log(errors);
    }, [errors]);

    useEffect(() => {
        // HAY ERROR AQUI PQ ESTÁ GENERANDO CP _ ID Vacios para event experiences
        setValue('event_experiences', []);
    }, []);

    const handleInsertEvent = async (form: ValidationSchema) => {
        setIsLoading(true);

        const {
            name,
            description,
            start_date,
            end_date,
            category,
            cps,
            event_experiences,
        } = form;

        const formatStartDate = new Date(start_date).toISOString();
        const formatEndDate = new Date(end_date).toISOString();

        // Create event
        const { data: event, error: eventError } = await supabase
            .from('events')
            .insert({
                name,
                description,
                start_date: formatStartDate,
                end_date: formatEndDate,
                owner_id: user?.id,
                address: '',
                category,
                logo_url: '',
                promotional_url: '',
                status: '',
                geoArgs: {
                    type: 'Point',
                    coordinates: [0, 0],
                },
            })
            .select('*')
            .single();

        if (!event) {
            setIsLoading(false);
            return;
        }

        if (eventError) {
            setIsLoading(false);
            throw eventError;
        }

        const { id: eventId } = event;

        handleCheckedCPs(cps ?? [], eventId);

        if (event_experiences) {
            event_experiences.map(async (experience) => {
                if (!experience.experience_id) return;

                const { error: experienceError } = await supabase
                    .from('event_experiences')
                    .insert({
                        event_id: eventId,
                        experience_id: experience.experience_id,
                        cp_id: experience.cp_id ?? null,
                    });

                if (experienceError) {
                    setIsLoading(false);
                    throw experienceError;
                }
            });
        }

        setTimeout(() => {
            queryClient.invalidateQueries('events');
            setShowModal(false);
            reset();
            setIsLoading(false);
        }, 300);
    };

    const handleCheckedCPs = (
        cps: IConsumptionPointEventNoCircularDependency[],
        eventId: string,
    ) => {
        if (cps) {
            // Get CP checked from the list
            const cpsFiltered = cps.filter(
                (cp: IConsumptionPointEventNoCircularDependency) => cp.cp_id,
            );

            // Loop trough all the selected CPs and insert them into the event
            cpsFiltered.forEach(
                async (cp: IConsumptionPointEventNoCircularDependency) => {
                    const { error: cpError } = await supabase
                        .from('cp_events')
                        .insert({
                            owner_id: user?.id,
                            event_id: eventId,
                            cp_id: cp.cp_id,
                            cp_name: cp.cp_name,
                            cp_description: cp.cp_description,
                            address: cp.address,
                            is_active: true,
                        });

                    if (cpError) {
                        setIsLoading(false);
                        throw cpError;
                    }
                },
            );
        }
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
            btnTitle={'save'}
            triggerBtnTitle={'add_new_event'}
            description={''}
            classContainer={`${isLoading && ' opacity-75'}`}
            handler={handleSubmit(onSubmit)}
            form={form}
        >
            {isLoading ? (
                <div className="h-[50vh]">
                    <Spinner
                        size="xxLarge"
                        color="beer-blonde"
                        absolutePosition="center"
                        absolute
                    />
                </div>
            ) : (
                <form>
                    <BasicEventForm form={form} />

                    {/* List of Consumption Points  */}
                    <fieldset className="mt-4 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                        <legend>
                            <Title size="large">{t('cp_associated')}</Title>
                        </legend>

                        <SearchCheckboxCPs cps={cps} form={form} />
                    </fieldset>

                    {/* Listado de experiencias cervezanas configuradas por el usuario y habilitadas en el evento */}
                    <fieldset className="mt-4 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                        <legend>
                            <Title size="large">{t('experiences')}</Title>
                        </legend>

                        <ExperienceForm form={form} cps={cps} />
                    </fieldset>
                </form>
            )}
        </ModalWithForm>
    );
}
