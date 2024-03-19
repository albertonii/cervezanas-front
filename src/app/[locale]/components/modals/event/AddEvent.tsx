'use client';

import dynamic from 'next/dynamic';
import BasicEventForm from '../../../(roles)/producer/profile/events/(producer_events)/BasicEventForm';
import ExperienceForm from '../../../(roles)/producer/profile/events/ExperienceForm';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ICPFixed, ICPMobile } from '../../../../../lib/types/types';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { useMutation, useQueryClient } from 'react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SearchCheckboxCPFixeds } from '../../common/SearchCheckboxCPFixed';
import { SearchCheckboxCPMobiles } from '../../common/SearchCheckboxCPMobiles';

const ModalWithForm = dynamic(() => import('../ModalWithForm'), { ssr: false });

export type ModalAddEventFormData = {
    name: string;
    description: string;
    start_date: Date;
    end_date: Date;
    logo_url?: string;
    promotional_url?: string;
    cps_mobile?: any[];
    cps_fixed?: any[];
    event_experiences?: {
        experience_id?: string;
        cp_mobile_id?: string;
        cp_fixed_id?: string;
    }[];
};

const schema: ZodType<ModalAddEventFormData> = z.object({
    name: z.string().nonempty({ message: 'errors.input_required' }),
    description: z.string().nonempty({ message: 'errors.input_required' }),
    start_date: z.date(),
    end_date: z.date(),
    logo_url: z.string().optional(),
    promotional_url: z.string().optional(),
    cps_mobile: z.any(),
    cps_fixed: z.any(),
    event_experiences: z.array(
        z.object({
            experience_id: z.string().optional(),
            cp_mobile_id: z.string().optional(),
            cp_fixed_id: z.string().optional(),
        }),
    ),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    cpsMobile: ICPMobile[];
    cpsFixed: ICPFixed[];
}

export default function AddEvent({ cpsMobile, cpsFixed }: Props) {
    const t = useTranslations();
    const { user, supabase } = useAuth();

    const [showModal, setShowModal] = useState<boolean>(false);

    const queryClient = useQueryClient();

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
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
        // HAY ERROR AQUI PQ ESTÁ GENERANDO CP _ ID Vacios para event experiences
        setValue('event_experiences', []);
    }, []);

    const handleInsertEvent = async (form: ValidationSchema) => {
        const {
            name,
            description,
            start_date,
            end_date,
            cps_mobile,
            cps_fixed,
            event_experiences,
        } = form;

        const formatStartDate = new Date(start_date).toISOString();
        const formatEndDate = new Date(end_date).toISOString();

        // Create event
        const { data: event, error: eventError } = await supabase
            .from('events')
            .insert({
                is_activated: false,
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

        if (!event) {
            return;
        }

        if (eventError) {
            throw eventError;
        }

        const { id: eventId } = event;

        if (cps_mobile) {
            // Get CP checked from the list
            const cpsMobileFiltered = cps_mobile.filter((cp) => cp.cp_id);

            // Loop trough all the selected CPs and insert them into the event
            cpsMobileFiltered.map(async (cp) => {
                const { error: cpError } = await supabase
                    .from('cpm_events')
                    .insert({
                        cp_id: cp.cp_id,
                        event_id: eventId,
                        is_active: false,
                    });

                if (cpError) {
                    throw cpError;
                }
            });
        }

        if (cps_fixed) {
            // Get CP checked from the list
            const cpsFixedFiltered = cps_fixed.filter((cp) => cp.cp_id);

            // Loop trough all the selected CPs and insert them into the event
            cpsFixedFiltered.map(async (cp: ICPFixed) => {
                const { error: cpError } = await supabase
                    .from('cpf_events')
                    .insert({
                        cp_id: cp.cp_id,
                        event_id: eventId,
                        is_active: false,
                    });

                if (cpError) {
                    throw cpError;
                }
            });
        }

        if (event_experiences) {
            event_experiences.map(async (experience) => {
                if (!experience.experience_id) return;

                const { error: experienceError } = await supabase
                    .from('event_experiences')
                    .insert({
                        event_id: eventId,
                        experience_id: experience.experience_id,
                        cp_mobile_id: experience.cp_mobile_id ?? null,
                        cp_fixed_id: experience.cp_fixed_id ?? null,
                    });

                if (experienceError) {
                    throw experienceError;
                }
            });
        }

        setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            setShowModal(false);
            reset();
        }, 300);
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
            classIcon={''}
            classContainer={''}
            handler={handleSubmit(onSubmit)}
            form={form}
        >
            <form>
                <BasicEventForm form={form} />

                {/* List of Mobile Consumption Points  */}
                <fieldset className="mt-4 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                    <legend className="text-2xl">
                        {t('cp_mobile_associated')}
                    </legend>

                    <SearchCheckboxCPMobiles
                        cpsMobile={cpsMobile}
                        form={form}
                    />
                </fieldset>

                {/* List of Fixed Consumption Points  */}
                <fieldset className="mt-4 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                    <legend className="text-2xl">
                        {t('cp_fixed_associated')}
                    </legend>

                    <SearchCheckboxCPFixeds cpsFixed={cpsFixed} form={form} />
                </fieldset>

                {/* Listado de experiencias cervezanas configuradas por el usuario y habilitadas en el evento */}
                <fieldset className="mt-4 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                    <legend className="text-2xl">{t('experiences')}</legend>

                    <ExperienceForm
                        form={form}
                        cpsMobile={cpsMobile}
                        cpsFixed={cpsFixed}
                    />
                </fieldset>
            </form>
        </ModalWithForm>
    );
}
