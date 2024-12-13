'use client';

import Title from '../ui/Title';
import ListCPProducts from './ListCPProducts';
import InputLabel from '@/app/[locale]/components/form/InputLabel';
import ModalWithForm from '../modals/ModalWithForm';
import useFetchCPPacksByCPId from '@/hooks/useFetchCPPacks';
import SelectInput from '@/app/[locale]/components/form/SelectInput';
import InputTextarea from '@/app/[locale]/components/form/InputTextarea';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../(auth)/Context/useAuth';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from 'react-query';
import { DisplayInputError } from '../ui/DisplayInputError';
import { formatDateDefaultInput } from '@/utils/formatDate';
import { validateDateRange } from '@/utils/ZodValidationUtils';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import { STATUS_OPTIONS, VIEW_CONFIGURATION_OPTIONS } from '@/constants';

// Definición del esquema de validación con Zod
const formSchema = z
    .object({
        cp_name: z.string(),
        cp_description: z
            .string()
            .nonempty({ message: 'La descripción es requerida' }),
        start_date: z
            .string()
            .nonempty({ message: 'La fecha de inicio es requerida' }),
        end_date: z
            .string()
            .nonempty({ message: 'La fecha de fin es requerida' }),
        status: z.enum(['active', 'finished', 'error', 'cancelled', 'paused']),
        product_items: z.array(z.string()).optional(),
        is_booking_required: z.boolean(),
        stand_location: z.string().optional(),
        maximum_capacity: z.number().int().min(0, {
            message: 'La capacidad máxima debe ser mayor o igual a 0',
        }),
        view_configuration: z.enum(['one_step', 'two_steps', 'three_steps']),
        has_pending_payment: z.boolean(),
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

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Hook personalizado para obtener los packs de productos asociados al PC
    const { data: packsInProduct } = useFetchCPPacksByCPId(selectedCP.id);

    // Inicializar react-hook-form con Zod resolver
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cp_name: selectedCP?.cp_name || '',
            cp_description: selectedCP?.cp_description || '',
            start_date: formatDateDefaultInput(selectedCP?.start_date || ''),
            end_date: formatDateDefaultInput(selectedCP?.end_date || ''),
            status:
                (selectedCP?.status as
                    | 'active'
                    | 'finished'
                    | 'error'
                    | 'cancelled'
                    | 'paused') || 'active',
            stand_location: selectedCP?.stand_location || '',
            product_items:
                selectedCP?.cp_products?.map((p) => p.product_pack_id) || [],
            is_booking_required: selectedCP?.is_booking_required || false,
            view_configuration: selectedCP?.view_configuration || 'three_step',
            has_pending_payment: selectedCP?.has_pending_payment || false,
            maximum_capacity: selectedCP?.maximum_capacity || 0,
        },
    });

    const {
        formState: { errors },
        handleSubmit,
        register,
        setValue,
        watch,
    } = form;

    useEffect(() => {
        console.log('ERRORS', errors);
    }, [errors]);

    useEffect(() => {
        if (packsInProduct?.length) {
            const productPackIds = packsInProduct.map(
                (item) => item.product_pack_id,
            );
            setValue('product_items', productPackIds);
        }
    }, [packsInProduct, setValue]);

    // Definir la mutación para actualizar el PC
    const updateCPMutation = useMutation(
        async (formValues: FormData) => {
            try {
                const {
                    cp_name,
                    cp_description,
                    start_date,
                    end_date,
                    product_items,
                    view_configuration,
                    has_pending_payment,
                    stand_location,
                    is_booking_required,
                    maximum_capacity,
                    status,
                } = formValues;

                const { error: cpError } = await supabase
                    .from('cp_events')
                    .update({
                        cp_name,
                        cp_description,
                        is_booking_required,
                        view_configuration,
                        has_pending_payment,
                        start_date,
                        end_date,
                        stand_location,
                        maximum_capacity,
                        status,
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

                queryClient.invalidateQueries(['cp_events']);
                handleEditModal(false);

                return true;
            } catch (error: any) {
                setErrorMessage(
                    error.message || 'Error al actualizar el punto de consumo',
                );
                throw error;
            }
        },
        {
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

    return (
        <ModalWithForm
            showBtn={false}
            showModal={isEditModal}
            setShowModal={handleEditModal}
            title={t('edit_cp_config')}
            btnTitle={t('edit_cp_config')}
            icon={faAdd}
            handler={handleSubmit(onSubmit)}
            handlerClose={() => {
                handleEditModal(false);
            }}
            form={form}
        >
            <form>
                {/* Información del PC */}
                <fieldset className="grid grid-cols-1 gap-2 rounded-md border-2 border-beer-softBlondeBubble p-4">
                    <legend>
                        <Title size="large" color="beer-blonde">
                            {t('cp_info')}
                        </Title>
                    </legend>

                    {errorMessage && (
                        <DisplayInputError message={errorMessage} />
                    )}

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

                    <div className="flex gap-2">
                        {/* Estado */}
                        <SelectInput
                            form={form}
                            label={'status'}
                            labelText={'Estado'}
                            options={STATUS_OPTIONS}
                        />

                        {/* Configuración de vista */}
                        <SelectInput
                            form={form}
                            label={'view_configuration'}
                            labelText={'Configuración de Vista'}
                            options={VIEW_CONFIGURATION_OPTIONS}
                        />
                    </div>

                    {/* Ubicación del Stand */}
                    <InputLabel
                        form={form}
                        label={'stand_location'}
                        labelText={'Ubicación del Stand'}
                    />

                    {/* Capacidad máxima  */}
                    <InputLabel
                        form={form}
                        label={'maximum_capacity'}
                        labelText={'Capacidad Máxima'}
                        inputType="number"
                        registerOptions={{
                            valueAsNumber: true,
                        }}
                    />

                    <div className="flex gap-2">
                        {/* Pendiente de Pago */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="has_pending_payment"
                                aria-describedby="has_pending_payment_description"
                                {...register('has_pending_payment')}
                                className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <label
                                htmlFor="has_pending_payment"
                                aria-describedby="has_pending_payment_description"
                                className="text-sm text-gray-700 dark:text-white"
                            >
                                {t('event.include_pending_payment')}
                            </label>
                        </div>

                        {/* Reserva requerida */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_booking_required"
                                {...register('is_booking_required')}
                                className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <label
                                htmlFor="is_booking_required"
                                className="text-sm text-gray-700 dark:text-white"
                            >
                                {t('event.booking_required')}
                            </label>
                        </div>
                    </div>
                </fieldset>

                {/* Productos del PC */}
                <fieldset className="mt-6 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                    <legend>
                        <Title size="large" color="beer-blonde">
                            {t('cp_products')}
                        </Title>
                    </legend>
                    <ListCPProducts
                        form={form}
                        productItems={watch('product_items')}
                    />
                </fieldset>
            </form>
        </ModalWithForm>
    );
}
