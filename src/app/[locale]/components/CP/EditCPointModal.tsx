'use client';

import Title from '../ui/Title';
import CPGoogleMap from './CPGoogleMap';
import ListCPProducts from './ListCPProducts';
import Modal from '@/app/[locale]/components/modals/Modal';
import useFetchCPPacksByCPId from '@/hooks/useFetchCPPacks';
import InputLabel from '@/app/[locale]/components/form/InputLabel';
import SelectInput from '@/app/[locale]/components/form/SelectInput';
import InputTextarea from '@/app/[locale]/components/form/InputTextarea';
import React, { ComponentProps, useEffect, useState } from 'react';
import { IUser } from '@/lib/types/types';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../(auth)/Context/useAuth';
import { GeocodeResult } from 'use-places-autocomplete';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { cleanObject, isValidObject } from '@/utils/utils';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { DisplayInputError } from '@/app/[locale]/components/ui/DisplayInputError';
import {
    IConsumptionPoint,
    ICPProductsEditModal,
} from '@/lib/types/consumptionPoints';

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

interface FormData {
    cp_name: string;
    cp_description: string;
    organizer_name: string;
    organizer_lastname: string;
    organizer_email: string;
    organizer_phone: string;
    start_date: any;
    end_date: any;
    address: string;
    status: string;
    is_internal_organizer: boolean;
    product_items: string[];
    geoArgs: GeocodeResult[];
    is_booking_required: boolean;
    maximum_capacity: number;
}

interface Props {
    selectedCP: IConsumptionPoint;
    isEditModal: boolean;
    handleEditModal: ComponentProps<any>;
}

export default function EditCPointModal({
    selectedCP,
    isEditModal,
    handleEditModal,
}: Props) {
    const t = useTranslations();
    const { supabase } = useAuth();
    const { user } = useAuth();

    const {
        data: packsInProduct,
        refetch,
        isLoading: isFetchLoading,
    } = useFetchCPPacksByCPId(selectedCP.id);

    const [productItems, setProductItems] = useState<string[]>([]);

    const [isInternalOrganizer, setIsInternalOrganizer] =
        useState<boolean>(true);
    const [addressInputRequired, setAddressInputRequired] =
        useState<boolean>(false);

    const [externalOrganizers, setExternalOrganizers] = useState<IUser[]>([]);
    const [selectedEOrganizer, setSelectedEOrganizer] = useState<string>();

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

    const form = useForm<FormData>({
        defaultValues: {
            cp_name: selectedCP?.cp_name,
            cp_description: selectedCP?.cp_description,
            organizer_name: selectedCP?.organizer_name,
            organizer_lastname: selectedCP?.organizer_lastname,
            organizer_email: selectedCP?.organizer_email,
            organizer_phone: selectedCP?.organizer_phone,
            address: selectedCP?.address,
            is_internal_organizer: selectedCP.is_internal_organizer,
            geoArgs: selectedCP?.geoArgs,
            product_items: productItems,
            // is_booking_required: selectedCP?.is_booking_required,
        },
    });

    const {
        formState: { errors },
        handleSubmit,
        register,
        setValue,
    } = form;

    useEffect(() => {
        if (packsInProduct) {
            packsInProduct.map((item: ICPProductsEditModal) => {
                const productPackId: string = item.product_pack_id;
                setProductItems((current) => {
                    if (!current.includes(productPackId))
                        return [...current, productPackId];
                    return current;
                });
            });
        }
    }, [packsInProduct]);

    const handleAddress = (address: string) => {
        setValue('address', address);
    };

    const handleIsInternalOrganizer = (e: any) => {
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

    // Update CP in database
    const handleUpdate = async (formValues: FormData) => {
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
            address,
            is_internal_organizer,
            is_booking_required,
            maximum_capacity,
            product_items,
        } = formValues;

        if (!isValidObject(address)) {
            setAddressInputRequired(true);
            return;
        }

        if (selectedCP) {
            const { error } = await supabase
                .from('cp')
                .update({
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
                })
                .eq('id', selectedCP.id);

            if (error) throw error;

            // TODO: CREAR NUEVO CP_PRODUCTS PERO VINCULADO A CP y no a CP_EVENTS

            // const { error: errorDelete } = await supabase
            //     .from('cp_products')
            //     .delete()
            //     .eq('cp_id', selectedCP.id);

            // if (errorDelete) throw errorDelete;

            // Insert product items in cp_products table
            const pItemsFiltered = cleanObject(product_items);

            if (pItemsFiltered) {
                // Convert pItemsFiltered JSON objects to array
                const pItemsFilteredArray = Object.values(pItemsFiltered);

                const cpId = selectedCP.id;

                // Link the pack with the consumption Point
                pItemsFilteredArray.map(async (pack: any) => {
                    // TODO: Desde el register de accordionItem se introduce un product pack como string/json o como array de objetos. Habría que normalizar la información
                    if (typeof pack.id === 'object') {
                        pack.id.map(async (packId: string) => {
                            const { error } = await supabase
                                .from('cp_products')
                                .insert({
                                    cp_id: cpId,
                                    product_pack_id: packId,
                                });

                            if (error) {
                                throw error;
                            }
                        });
                    } else {
                        const { error } = await supabase
                            .from('cp_products')
                            .insert({
                                cp_id: cpId,
                                product_pack_id: pack.id,
                            });

                        if (error) {
                            throw error;
                        }
                    }
                });

                refetch();
            }

            queryClient.invalidateQueries('consumption_points');
        }
    };

    const updateCPMutation = useMutation({
        mutationKey: ['updateCP'],
        mutationFn: handleUpdate,
        onSuccess: () => {
            handleEditModal(false);
        },
        onError: (e: any) => {
            console.error(e);
        },
    });

    const onSubmit = (formValues: FormData) => {
        try {
            updateCPMutation.mutate(formValues);
        } catch (e) {
            console.error(e);
        }
    };

    if (isFetchLoading) return <></>;

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
            <form>
                <fieldset className="grid grid-cols-1 gap-2 rounded-md border-2 border-beer-softBlondeBubble p-4">
                    <legend>
                        <Title size="large">{t('cp_info')}</Title>
                    </legend>

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

                    {/* Start date and end date  */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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

                            <select
                                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                                id="is_internal_organizer"
                                {...register('is_internal_organizer', {
                                    required: true,
                                })}
                                onChange={(e) => {
                                    handleIsInternalOrganizer(e);
                                }}
                            >
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
                        <>
                            <div className="flex w-full flex-col">
                                <span className="mb-2 mt-2">
                                    Selecciona del listado de abajo el
                                    organizador externo responsable de este
                                    evento. Una vez creado el evento enviaremos
                                    una confirmación al organizador externo para
                                    que pueda gestionar el evento y acepta los
                                    términos y condiciones de uso de la
                                    plataforma. Dicho evento tendrá el estado
                                    `Pendiente de confirmación` hasta que el
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
                                        externalOrganizers.map(
                                            (organizer: any) => (
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
                                            ),
                                        )}
                                </select>

                                {errorOnSelectEOrganizer && (
                                    <DisplayInputError message="errors.input_required" />
                                )}
                            </div>
                        </>
                    )}
                </fieldset>

                <fieldset className="mt-12 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                    <legend>
                        <Title size="large">{t('cp_location')}</Title>
                    </legend>

                    {addressInputRequired && (
                        <span className="text-red-500">
                            {t('errors.input_required')}
                        </span>
                    )}

                    {/* Address  */}
                    <CPGoogleMap
                        handleAddress={handleAddress}
                        defaultLocation={selectedCP.address}
                        defaultGeoArgs={selectedCP.geoArgs}
                    />
                </fieldset>

                {/* <fieldset className="mt-4 flex flex-col space-y-4">
                    <legend>
                        <Title size="large">{t('cp_products')}</Title>
                    </legend>

                    <ListCPProducts form={form} productItems={productItems} />
                </fieldset> */}
            </form>
        </Modal>
    );
}
