'use client';

import Title from '../ui/Title';
import Spinner from '../ui/Spinner';
import ListCPProducts from './ListCPProducts';
import Modal from '@/app/[locale]/components/modals/Modal';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import InputLabel from '@/app/[locale]/components/form/InputLabel';
import SelectInput from '@/app/[locale]/components/form/SelectInput';
import InputTextarea from '@/app/[locale]/components/form/InputTextarea';
import useFetchCPPacksByCPId from '@/hooks/useFetchCPPacks';
import React, { useEffect, useCallback } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { IUserTable } from '@/lib/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../(auth)/Context/useAuth';
import { GeocodeResult } from 'use-places-autocomplete';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { DisplayInputError } from '../ui/DisplayInputError';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
    IConsumptionPointEvent,
    ICPProductsEditModal,
} from '@/lib/types/consumptionPoints';

// Definición del esquema de validación con Zod
const formSchema = z
    .object({
        cp_name: z
            .string()
            .nonempty({ message: 'El nombre del PC es requerido' }),
        cp_description: z
            .string()
            .nonempty({ message: 'La descripción es requerida' }),
        organizer_name: z.string().optional(),
        organizer_lastname: z.string().optional(),
        organizer_email: z
            .string()
            .email({ message: 'Correo electrónico inválido' })
            .optional(),
        organizer_phone: z.string().optional(),
        start_date: z
            .string()
            .nonempty({ message: 'La fecha de inicio es requerida' }),
        end_date: z
            .string()
            .nonempty({ message: 'La fecha de fin es requerida' }),
        address: z.string().nonempty({ message: 'La dirección es requerida' }),
        status: z.enum(['active', 'finished', 'error', 'cancelled', 'paused']),
        is_internal_organizer: z.boolean(),
        product_items: z.array(z.string()).optional(),
        geoArgs: z.array(z.any()), // Mejorar con un esquema específico si es posible
        is_booking_required: z.boolean(),
        maximum_capacity: z.number().int().positive({
            message: 'La capacidad máxima debe ser un número positivo',
        }),
        view_configuration: z.enum(['one_step', 'two_steps', 'three_steps']),
        has_pending_payment: z.boolean(),
        selectedEOrganizer: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.is_internal_organizer) {
            if (!data.organizer_name || data.organizer_name.trim() === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['organizer_name'],
                    message: 'El nombre del organizador es requerido',
                });
            }
            if (
                !data.organizer_lastname ||
                data.organizer_lastname.trim() === ''
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['organizer_lastname'],
                    message: 'El apellido del organizador es requerido',
                });
            }
            if (!data.organizer_email || data.organizer_email.trim() === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['organizer_email'],
                    message:
                        'El correo electrónico del organizador es requerido',
                });
            }
            if (!data.organizer_phone || data.organizer_phone.trim() === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['organizer_phone'],
                    message: 'El teléfono del organizador es requerido',
                });
            }
        } else {
            if (
                !data.selectedEOrganizer ||
                data.selectedEOrganizer.trim() === ''
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['selectedEOrganizer'],
                    message: 'Debe seleccionar un organizador externo',
                });
            }
        }

        // Validar que end_date sea posterior a start_date
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        if (startDate >= endDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['end_date'],
                message:
                    'La fecha de fin debe ser posterior a la fecha de inicio',
            });
        }
    });

// Inferir el tipo FormData a partir del esquema Zod
type FormData = z.infer<typeof formSchema>;

interface Props {
    selectedCP: IConsumptionPointEvent;
    isEditModal: boolean;
    handleEditModal: (value: boolean) => void;
}

export default function EditCPointEventModal({
    selectedCP,
    isEditModal,
    handleEditModal,
}: Props) {
    const t = useTranslations();
    const { supabase } = useAuth();
    const queryClient = useQueryClient();

    // Hook personalizado para obtener los packs de productos asociados al PC
    const {
        data: packsInProduct,
        refetch,
        isLoading: isFetchLoading,
    } = useFetchCPPacksByCPId(selectedCP.id);

    // Inicializar react-hook-form con Zod resolver
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cp_name: selectedCP?.cp_name || '',
            cp_description: selectedCP?.cp_description || '',
            organizer_name: selectedCP?.cp?.organizer_name || '',
            organizer_lastname: selectedCP?.cp?.organizer_lastname || '',
            organizer_email: selectedCP?.cp?.organizer_email || '',
            organizer_phone: selectedCP?.cp?.organizer_phone || '',
            start_date: selectedCP?.start_date || '',
            end_date: selectedCP?.end_date || '',
            address: selectedCP?.address || '',
            status:
                (selectedCP?.cp?.status as
                    | 'active'
                    | 'finished'
                    | 'error'
                    | 'cancelled'
                    | 'paused') || 'active',
            is_internal_organizer:
                selectedCP?.cp?.is_internal_organizer || true,
            product_items:
                selectedCP?.cp?.cp_products?.map((p) => p.product_pack_id) ||
                [],
            geoArgs: selectedCP?.cp?.geoArgs || [],
            is_booking_required: selectedCP?.cp?.is_booking_required || false,
            maximum_capacity: selectedCP?.cp?.maximum_capacity || 0,
            view_configuration: selectedCP?.view_configuration || 'one_step',
            has_pending_payment: selectedCP?.has_pending_payment || false,
            selectedEOrganizer: selectedCP?.users?.id || '',
        },
    });

    const {
        formState: { errors },
        handleSubmit,
        register,
        setValue,
        watch,
    } = form;

    const isInternalOrganizer = watch('is_internal_organizer');

    // Obtener los organizadores externos solo si 'is_internal_organizer' es false
    const {
        data: externalOrganizersData,
        refetch: refetchOrganizers,
        isLoading: isOrganizersLoading,
    } = useQuery(
        ['externalOrganizers', selectedCP.id],
        async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            const userId = user?.id;
            if (!userId) throw new Error('Usuario no autenticado');
            const { data, error } = await supabase
                .from('users')
                .select('id, name, lastname')
                .eq('cp_organizer_status', 1)
                .neq('id', userId);
            if (error) throw new Error(error.message);
            return data as IUserTable[];
        },
        {
            enabled: false, // Solo obtener cuando es necesario
        },
    );

    // Refetchear los organizadores externos cuando 'is_internal_organizer' cambia a false
    useEffect(() => {
        if (!isInternalOrganizer) {
            refetchOrganizers();
        }
    }, [isInternalOrganizer, refetchOrganizers]);

    // Actualizar 'product_items' cuando cambian los packs en productos
    useEffect(() => {
        if (packsInProduct) {
            const productPackIds = packsInProduct.map(
                (item: ICPProductsEditModal) => item.product_pack_id,
            );
            setValue('product_items', productPackIds);
        }
    }, [packsInProduct, setValue]);

    // Definir la mutación para actualizar el PC
    const updateCPMutation = useMutation(
        async (formValues: FormData) => {
            const {
                cp_name,
                cp_description,
                organizer_name,
                organizer_lastname,
                organizer_email,
                organizer_phone,
                address,
                is_internal_organizer,
                is_booking_required,
                maximum_capacity,
                product_items,
                view_configuration,
                has_pending_payment,
                selectedEOrganizer,
            } = formValues;

            // Actualizar la tabla 'cp'
            const { error: cpError } = await supabase
                .from('cp')
                .update({
                    cp_name,
                    cp_description,
                    organizer_name: is_internal_organizer
                        ? organizer_name
                        : undefined,
                    organizer_lastname: is_internal_organizer
                        ? organizer_lastname
                        : undefined,
                    organizer_email: is_internal_organizer
                        ? organizer_email
                        : undefined,
                    organizer_phone: is_internal_organizer
                        ? organizer_phone
                        : undefined,
                    address,
                    is_internal_organizer,
                    is_booking_required,
                    maximum_capacity,
                    view_configuration,
                    has_pending_payment,
                })
                .eq('id', selectedCP.id);

            if (cpError) throw new Error(cpError.message);

            // Actualizar la tabla 'cp_products'

            // 1. Eliminar productos existentes
            const { error: deleteError } = await supabase
                .from('cp_products')
                .delete()
                .eq('cp_id', selectedCP.id);

            if (deleteError) throw new Error(deleteError.message);

            // 2. Insertar nuevos productos
            const cpProductsToInsert =
                product_items?.map((packId) => ({
                    cp_id: selectedCP.id,
                    product_pack_id: packId,
                })) || [];

            if (cpProductsToInsert.length > 0) {
                const { error: insertError } = await supabase
                    .from('cp_products')
                    .insert(cpProductsToInsert);

                if (insertError) throw new Error(insertError.message);
            }

            // Opcional: Actualizar la relación del organizador externo si es necesario

            // Retornar éxito
            return true;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['cps', selectedCP.id]);
                handleEditModal(false);
                // Mostrar mensaje de éxito si es necesario
            },
            onError: (error: any) => {
                console.error(error);
                // Mostrar mensaje de error si es necesario
            },
        },
    );

    // Manejar la sumisión del formulario
    const onSubmit = (formValues: FormData) => {
        updateCPMutation.mutate(formValues);
    };

    // Manejar la actualización de la dirección desde CPGoogleMap
    const handleAddress = useCallback(
        (address: string, geoArgs: GeocodeResult[]) => {
            setValue('address', address);
            setValue('geoArgs', geoArgs);
        },
        [setValue],
    );

    return (
        <Modal
            showBtn={false}
            showModal={isEditModal}
            setShowModal={handleEditModal}
            title={t('edit_cp_config')}
            btnTitle={t('edit_cp_config')}
            description={''}
            icon={faAdd}
            handler={handleSubmit(onSubmit)}
            handlerClose={() => {
                handleEditModal(false);
            }}
            btnSize={'large'}
            classContainer={''}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Información del PC */}
                <fieldset className="grid grid-cols-1 gap-2 rounded-md border-2 border-beer-softBlondeBubble p-4">
                    <legend>
                        <Title size="large">{t('cp_info')}</Title>
                    </legend>

                    {/* Nombre del PC */}
                    <InputLabel
                        form={form}
                        label={'cp_name'}
                        labelText={'Nombre del PC'}
                    />

                    {/* Descripción del PC */}
                    <InputTextarea
                        form={form}
                        label={'cp_description'}
                        labelText={'Descripción'}
                    />

                    {/* Fechas */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <InputLabel
                            form={form}
                            label={'start_date'}
                            labelText={'Fecha de Inicio'}
                            inputType="date"
                        />

                        <InputLabel
                            form={form}
                            label={'end_date'}
                            labelText={'Fecha de Fin'}
                            inputType="date"
                        />
                    </div>

                    {/* Estado */}
                    <SelectInput
                        form={form}
                        label={'status'}
                        labelText={'Estado'}
                        options={[
                            { label: 'Activo', value: 'active' },
                            { label: 'Finalizado', value: 'finished' },
                            { label: 'Error', value: 'error' },
                            { label: 'Cancelado', value: 'cancelled' },
                            { label: 'Pausado', value: 'paused' },
                        ]}
                    />

                    {/* Configuración de vista */}
                    <SelectInput
                        form={form}
                        label={'view_configuration'}
                        labelText={'Configuración de Vista'}
                        options={[
                            { label: '1 Paso', value: 'one_step' },
                            { label: '2 Pasos', value: 'two_steps' },
                            { label: '3 Pasos', value: 'three_steps' },
                        ]}
                    />

                    {/* Pendiente de Pago */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="has_pending_payment"
                            {...register('has_pending_payment')}
                            className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <label
                            htmlFor="has_pending_payment"
                            className="text-sm text-gray-700"
                        >
                            {t('include_pending_payment')}
                        </label>
                    </div>
                </fieldset>

                {/* Información del Organizador */}
                <fieldset className="mt-6 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                    <legend>
                        <Title size="large">{t('organizer_info')}</Title>
                    </legend>

                    {/* Is Internal Organizer */}
                    <div className="flex flex-col">
                        <label htmlFor="is_internal_organizer" className="mb-1">
                            {t('is_internal_organizer')}
                        </label>
                        <select
                            id="is_internal_organizer"
                            {...register('is_internal_organizer')}
                            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                        >
                            <option value="true">{t('yes')}</option>
                            <option value="false">{t('no')}</option>
                        </select>
                        {errors.is_internal_organizer && (
                            <DisplayInputError
                                message={
                                    errors.is_internal_organizer
                                        .message as string
                                }
                            />
                        )}
                    </div>

                    {/* Organizer Details if Internal */}
                    {isInternalOrganizer && (
                        <>
                            {/* Organizer Name and Lastname */}
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <InputLabel
                                    form={form}
                                    label={'organizer_name'}
                                    labelText={'Nombre del Organizador'}
                                />

                                <InputLabel
                                    form={form}
                                    label={'organizer_lastname'}
                                    labelText={'Apellido del Organizador'}
                                />
                            </div>

                            {/* Organizer Email and Phone */}
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <InputLabel
                                    form={form}
                                    label={'organizer_email'}
                                    labelText={'Correo Electrónico'}
                                />

                                <InputLabel
                                    form={form}
                                    label={'organizer_phone'}
                                    labelText={'Teléfono'}
                                />
                            </div>
                        </>
                    )}

                    {/* External Organizer Selection if not Internal */}
                    {!isInternalOrganizer && (
                        <div className="flex flex-col">
                            <label
                                htmlFor="selectedEOrganizer"
                                className="mb-1"
                            >
                                {t('select_external_organizer')}
                            </label>
                            {isOrganizersLoading ? (
                                <Spinner color="blonde" size="small" />
                            ) : (
                                <select
                                    id="selectedEOrganizer"
                                    {...register('selectedEOrganizer')}
                                    className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                                >
                                    <option value="">
                                        {t('select_organizer')}
                                    </option>
                                    {/* {externalOrganizersData && externalOrganizersData.map((organizer: IUser) => (
                                        <option key={organizer.id} value={organizer.id}>
                                            {organizer.name} {organizer.lastname}
                                        </option>
                                    ))} */}
                                </select>
                            )}
                            {errors.selectedEOrganizer && (
                                <DisplayInputError
                                    message={
                                        errors.selectedEOrganizer
                                            .message as string
                                    }
                                />
                            )}
                        </div>
                    )}
                </fieldset>

                {/* Dirección y Mapa */}
                <fieldset className="mt-6 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                    <legend>
                        <Title size="large">{t('cp_location')}</Title>
                    </legend>

                    {/* Address */}
                    {errors.address && (
                        <span className="text-red-500">
                            {errors.address.message}
                        </span>
                    )}
                    {/* <CPGoogleMap
                        handleAddress={handleAddress}
                        defaultLocation={selectedCP.address}
                        defaultGeoArgs={selectedCP.geoArgs}
                    /> */}
                </fieldset>

                {/* Productos del PC */}
                <fieldset className="mt-6 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                    <legend>
                        <Title size="large">{t('cp_products')}</Title>
                    </legend>
                    <ListCPProducts
                        form={form}
                        productItems={watch('product_items')}
                    />
                </fieldset>

                {/* Capacidad y Reservas */}
                <fieldset className="mt-6 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                    <legend>
                        <Title size="large">{t('additional_settings')}</Title>
                    </legend>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <InputLabel
                            form={form}
                            label={'maximum_capacity'}
                            labelText={'Capacidad Máxima'}
                            inputType="number"
                        />

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_booking_required"
                                {...register('is_booking_required')}
                                className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <label
                                htmlFor="is_booking_required"
                                className="text-sm text-gray-700"
                            >
                                {t('is_booking_required')}
                            </label>
                        </div>
                    </div>
                </fieldset>

                {/* Botón de Guardar */}
                <div className="mt-6 flex justify-end">
                    <Button btnType="submit" primary class="px-6 py-3">
                        {t('save')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
