'use client';

import Title from '../ui/Title';
import CPGoogleMap from './CPGoogleMap';
import ListCPMProducts from './ListCPProducts';
import ModalWithForm from '../modals/ModalWithForm';
import InputLabel from '@/app/[locale]/components/form/InputLabel';
import SelectInput from '@/app/[locale]/components/form/SelectInput';
import InputTextarea from '@/app/[locale]/components/form/InputTextarea';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { z, ZodType } from 'zod';
import { ROLE_ENUM } from '@/lib//enums';
import { IUser } from '@/lib/types/types';
import { createNotification } from '@/utils/utils';
import { useAuth } from '../../(auth)/Context/useAuth';
import { getGeocode } from 'use-places-autocomplete';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { cleanObject, isValidObject } from '@/utils/utils';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { DisplayInputError } from '@/app/[locale]/components/ui/DisplayInputError';

enum CPType {
    mobile = 'mobile',
    fixed = 'fixed',
}

export const cp_type_options: {
    label: string;
    value: CPType;
}[] = [
    { label: 'Móvil', value: CPType.mobile },
    { label: 'Fijo', value: CPType.fixed },
];

enum CPStatus {
    active = 'active',
    finished = 'finished',
    error = 'error',
    cancelled = 'cancelled',
    paused = 'paused',
}

export const cp_status_options: {
    label: string;
    value: CPStatus;
}[] = [
    { label: 'active', value: CPStatus.active },
    { label: 'finished', value: CPStatus.finished },
    { label: 'error', value: CPStatus.error },
    { label: 'cancelled', value: CPStatus.cancelled },
    { label: 'paused', value: CPStatus.paused },
];

interface ModalAddCPFormData {
    cp_name: string;
    cp_description: string;
    organizer_name: string;
    organizer_lastname: string;
    organizer_email: string;
    organizer_phone: string;
    address: string;
    status: string;
    maximum_capacity: number;
    is_booking_required: boolean;
    is_internal_organizer: boolean;
    product_items?: string[];
    type: string;
}

type ValidationSchema = z.infer<typeof schema>;

const schema: ZodType<ModalAddCPFormData> = z.object({
    cp_name: z.string().nonempty({ message: 'errors.input_required' }),
    cp_description: z.string().nonempty({ message: 'errors.input_required' }),
    organizer_name: z.string().nonempty({ message: 'errors.input_required' }),
    organizer_lastname: z
        .string()
        .nonempty({ message: 'errors.input_required' }),
    organizer_email: z.string().nonempty({ message: 'errors.input_required' }),
    organizer_phone: z.string().nonempty({ message: 'errors.input_required' }),
    address: z.string().nonempty({ message: 'errors.input_required' }),
    status: z.string().nonempty({ message: 'errors.input_required' }),
    is_internal_organizer: z.boolean(),
    product_items: z.any(),
    maximum_capacity: z
        .number()
        .nonnegative({ message: 'errors.input_required' }),
    is_booking_required: z.boolean(),
    type: z.string().nonempty({ message: 'errors.input_required' }),
});

interface Props {
    cpsId: string;
}

export default function AddConsumptionPointModal({ cpsId }: Props) {
    const t = useTranslations();
    const { user, supabase } = useAuth();

    const { handleMessage } = useMessage();

    const [isInternalOrganizer, setIsInternalOrganizer] =
        useState<boolean>(true);
    const [addressInputRequired, setAddressInputRequired] =
        useState<boolean>(false);

    const [externalOrganizers, setExternalOrganizers] = useState<IUser[]>([]);
    const [selectedEOrganizer, setSelectedEOrganizer] = useState<string>();

    const [showModal, setShowModal] = useState<boolean>(false);
    const [errorOnSelectEOrganizer, setErrorOnSelectEOrganizer] =
        useState(false);

    const queryClient = useQueryClient();

    const getExternalOrganizers = async () => {
        return await supabase
            .from('users')
            .select('id, name, lastname')
            .eq('cp_organizer_status', 1)
            .neq('id', user?.id);
    };

    const query = useQuery({
        queryKey: 'organizers',
        queryFn: getExternalOrganizers,
        enabled: false,
    });

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            cp_name: '',
            cp_description: '',
            organizer_name: '',
            organizer_lastname: '',
            organizer_email: '',
            organizer_phone: '',
            address: '',
            status: '',
            is_internal_organizer: true,
            maximum_capacity: 0,
            is_booking_required: false,
            type: CPType.mobile,
        },
    });

    const {
        formState: { errors },
        handleSubmit,
        reset,
        setValue,
    } = form;

    const handleAddress = (address: string) => {
        setValue('address', address as any);
    };

    const handleInsertCP = async (form: ValidationSchema) => {
        if (!selectedEOrganizer && !isInternalOrganizer) {
            setErrorOnSelectEOrganizer(true);
            return;
        }

        const {
            cp_name,
            cp_description,
            organizer_name,
            organizer_lastname,
            organizer_email,
            organizer_phone,
            product_items,
            status,
            address,
        } = form;

        if (!isValidObject(address)) {
            setAddressInputRequired(true);
            return;
        }

        const results = (await getGeocode({ address })) as any;

        const { data, error } = await supabase
            .from('cp')
            .insert({
                cp_name,
                cp_description,
                organizer_name,
                organizer_lastname,
                organizer_email,
                organizer_phone,
                address,
                status,
                cp_id: cpsId,
                geoArgs: results,
                is_internal_organizer: isInternalOrganizer,
                owner_id: user?.id,
                type: 'mobile',
                maximum_capacity: 0,
                is_booking_required: false,
            })
            .select('*')
            .single();

        if (error) {
            console.log(error);

            throw error;
        }

        // const pItemsFiltered = cleanObject(product_items);

        // if (pItemsFiltered) {
        //     // Convert pItemsFiltered JSON objects to array
        //     const pItemsFilteredArray: { id: string }[] =
        //         Object.values(pItemsFiltered);

        //     const consumptionPointId = data.id;

        //     // Link the pack with the consumption Point
        //     pItemsFilteredArray.map(async (pack: { id: string }) => {
        //         // TODO: Desde el register de accordionItem se introduce un product pack como string/json o como array de objetos. Habría que normalizar la información
        //         if (typeof pack.id === 'object') {
        //             // const { error } = await supabase
        //             //     .from('cp_products')
        //             //     .insert({
        //             //         cp_id: consumptionPointId,
        //             //         product_pack_id: pack.id,
        //             //         stock: 0,
        //             //         price: 0,
        //             //         product_name: '',
        //             //         pack_name: '',
        //             //     });
        //             // if (error) {
        //             //     throw error;
        //             // }
        //             // TODO: CREAR NUEVO CP_PRODUCTS PERO VINCULADO A CP y no a CP_EVENTS
        //         } else {
        //             // const { error } = await supabase
        //             //     .from('cp_products')
        //             //     .insert({
        //             //         cp_id: consumptionPointId,
        //             //         product_pack_id: pack.id,
        //             //         stock: 0,
        //             //         price: 0,
        //             //         product_name: '',
        //             //         pack_name: '',
        //             //     });
        //             // if (error) {
        //             //     throw error;
        //             // }
        //         }
        //     });
        // }

        if (!isInternalOrganizer) {
            if (!selectedEOrganizer) {
                handleMessage({
                    type: 'error',
                    message: t('errors.send_notification'),
                });

                return;
            }

            const link = `/${ROLE_ENUM.Productor}/profile?a=consumption_points`;

            // Notify user that has been assigned as organizer
            const response = await createNotification(
                supabase,
                selectedEOrganizer,
                user?.id,
                link,
                t('cps.has_been_assigned_as_organizer'),
            );

            if (response.error) {
                console.error(response.error);
                handleMessage({
                    type: 'error',
                    message: t('notifications.error'),
                });

                return;
            }
        }

        queryClient.invalidateQueries('consumption_points');
        setShowModal(false);
        reset();
    };

    const handleIsInternalOrganizer = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const value = e.target.value; // esto será un string "true" o "false"
        setIsInternalOrganizer(value === 'true');
        setValue('is_internal_organizer', value === 'true');

        if (value === 'false') {
            const loadExternalOrganizer = async () => {
                const { data } = await query.refetch();
                const externalOrganizers = data?.data as any[];
                setExternalOrganizers(externalOrganizers);
            };

            loadExternalOrganizer();
        }
    };

    const insertCPMutation = useMutation({
        mutationKey: 'insertCPoint',
        mutationFn: handleInsertCP,
        onError: (error: any) => {
            console.error(error);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: ModalAddCPFormData,
    ) => {
        return new Promise<void>((resolve, reject) => {
            insertCPMutation.mutate(formValues, {
                onSuccess: () => {
                    resolve();
                },
                onError: (error) => {
                    console.error(error);
                    reject();
                },
            });
        });
    };

    return (
        <ModalWithForm
            showBtn={true}
            showModal={showModal}
            setShowModal={setShowModal}
            title={t('add_new_cp')}
            btnTitle={t('new_cp_config')}
            description={''}
            handler={handleSubmit(onSubmit)}
            form={form}
            classContainer={''}
        >
            <>
                <fieldset className="grid grid-cols-1 gap-2 rounded-md border-2 border-beer-softBlondeBubble p-4">
                    <legend>
                        <Title size="large">{t('cp_info')}</Title>
                    </legend>

                    <div className="flex gap-4">
                        {/* Status */}
                        <SelectInput
                            form={form}
                            labelTooltip={'cp_status_tooltip'}
                            options={cp_status_options}
                            label={'status'}
                            registerOptions={{
                                required: true,
                            }}
                        />

                        {/* Type - Mobile | Fixed */}
                        <SelectInput
                            form={form}
                            options={cp_type_options}
                            label={'type'}
                            registerOptions={{
                                required: true,
                            }}
                        />
                    </div>

                    {/* Event name  */}
                    <InputLabel
                        form={form}
                        label={'cp_name'}
                        registerOptions={{
                            required: true,
                        }}
                    />

                    {/* Event description  */}
                    <InputTextarea
                        form={form}
                        label={'cp_description'}
                        labelText={'description'}
                        registerOptions={{
                            required: true,
                        }}
                    />

                    <InputLabel
                        form={form}
                        label={'maximum_capacity'}
                        inputType="number"
                        registerOptions={{
                            required: true,
                            valueAsNumber: true,
                        }}
                        defaultValue={0}
                    />

                    <InputLabel
                        form={form}
                        label={'is_booking_required'}
                        inputType="checkbox"
                        registerOptions={{
                            required: true,
                        }}
                    />
                </fieldset>

                {/* Organizer Information  */}
                <fieldset className="mt-12 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                    <legend>
                        <Title size="large">{t('organizer_info')}</Title>
                    </legend>

                    {/* Is internal organizer value  */}
                    <div className="flex flex-row space-x-2">
                        <div className="flex w-full flex-col">
                            <label htmlFor="is_internal_organizer">
                                {t('is_internal_organizer')}
                            </label>

                            <select onChange={handleIsInternalOrganizer}>
                                <option value="true">{t('yes')}</option>
                                <option value="false">{t('no')}</option>
                            </select>

                            {errors.is_internal_organizer && (
                                <DisplayInputError message="errors.input_required" />
                            )}
                        </div>
                    </div>

                    {/* In case organizer is internal from company*/}
                    {isInternalOrganizer && (
                        <>
                            {/* Organizer name and lastname  */}
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <InputLabel
                                    form={form}
                                    label={'organizer_name'}
                                    labelText={'name'}
                                    registerOptions={{
                                        required: true,
                                    }}
                                />

                                <InputLabel
                                    form={form}
                                    label={'organizer_lastname'}
                                    labelText={'lastname'}
                                    registerOptions={{
                                        required: true,
                                    }}
                                />
                            </div>

                            {/* Email and phone  */}
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <InputLabel
                                    form={form}
                                    label={'organizer_email'}
                                    labelText={'email'}
                                    registerOptions={{
                                        required: true,
                                    }}
                                    inputType="email"
                                />

                                <InputLabel
                                    form={form}
                                    label={'organizer_phone'}
                                    labelText={'phone'}
                                    registerOptions={{
                                        required: true,
                                    }}
                                />
                            </div>
                        </>
                    )}

                    {/* In case organizer is external from company*/}
                    {!isInternalOrganizer && (
                        <div className="flex w-full flex-col">
                            <span className="mb-2 mt-2">
                                Selecciona del listado de abajo el organizador
                                externo responsable de este evento. Una vez
                                creado el evento enviaremos una confirmación al
                                organizador externo para que pueda gestionar el
                                evento y acepta los términos y condiciones de
                                uso de la plataforma. Dicho evento tendrá el
                                estado `Pendiente de confirmación` hasta que el
                                organizador externo acepte los términos y
                                condiciones.
                            </span>

                            <select
                                className="text-md rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 focus:border-beer-blonde focus:outline-none "
                                id="is_external_organizer"
                                onClick={(e: any) => {
                                    const value = e.target.value;
                                    setSelectedEOrganizer(value);
                                }}
                            >
                                {externalOrganizers &&
                                    externalOrganizers.map((organizer: any) => (
                                        <option
                                            key={organizer.id}
                                            value={organizer.id}
                                            onSelect={() => {
                                                setSelectedEOrganizer(
                                                    organizer,
                                                );
                                                setErrorOnSelectEOrganizer(
                                                    false,
                                                );
                                            }}
                                        >
                                            {organizer.name}{' '}
                                            {organizer.lastname}
                                        </option>
                                    ))}
                            </select>

                            {errorOnSelectEOrganizer && (
                                <DisplayInputError message="errors.input_required" />
                            )}
                        </div>
                    )}
                </fieldset>

                <fieldset className="mt-12 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                    <legend>
                        <Title size="large">{t('cp_location')}</Title>
                    </legend>

                    {addressInputRequired && (
                        <DisplayInputError message="errors.input_required" />
                    )}

                    {/* Address  */}
                    <CPGoogleMap handleAddress={handleAddress} />
                </fieldset>

                {/* <fieldset className="mt-4 flex flex-col space-y-4">
                    <legend>
                        <Title size="large">{t('cp_products')}</Title>
                    </legend>

                    <ListCPMProducts form={form} />
                </fieldset> */}
            </>
        </ModalWithForm>
    );
}
