'use client';

import CPGoogleMap from './CPGoogleMap';
import ListCPMProducts from './ListCPMProducts';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { getGeocode } from 'use-places-autocomplete';
import { IUser } from '@/lib//types/types';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { cleanObject, isValidObject } from '@/utils/utils';
import { DisplayInputError } from '@/app/[locale]/components/common/DisplayInputError';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ModalWithForm from '@/app/[locale]/components/modals/ModalWithForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import SelectInput from '@/app/[locale]/components/common/SelectInput';
import InputLabel from '@/app/[locale]/components/common/InputLabel';
import InputTextarea from '@/app/[locale]/components/common/InputTextarea';
import Spinner from '@/app/[locale]/components/common/Spinner';
import { ROLE_ENUM } from '@/lib//enums';

enum CPFixedStatus {
    active = 'active',
    finished = 'finished',
    error = 'error',
    cancelled = 'cancelled',
    paused = 'paused',
}

export const cp_fixed_status_options: {
    label: string;
    value: CPFixedStatus;
}[] = [
    { label: 'active', value: CPFixedStatus.active },
    { label: 'finished', value: CPFixedStatus.finished },
    { label: 'error', value: CPFixedStatus.error },
    { label: 'cancelled', value: CPFixedStatus.cancelled },
    { label: 'paused', value: CPFixedStatus.paused },
];

interface ModalAddCPFixedFormData {
    cp_name: string;
    cp_description: string;
    organizer_name: string;
    organizer_lastname: string;
    organizer_email: string;
    organizer_phone: string;
    start_date: string;
    end_date: string;
    address: string;
    status: string;
    is_internal_organizer: boolean;
    product_items?: any[];
    // maximum_capacity
    // is_booking_required
}

const schema: ZodType<ModalAddCPFixedFormData> = z.object({
    cp_name: z.string().nonempty({ message: 'errors.input_required' }),
    cp_description: z.string().nonempty({ message: 'errors.input_required' }),
    organizer_name: z.string().nonempty({ message: 'errors.input_required' }),
    organizer_lastname: z
        .string()
        .nonempty({ message: 'errors.input_required' }),
    organizer_email: z.string().nonempty({ message: 'errors.input_required' }),
    organizer_phone: z.string().nonempty({ message: 'errors.input_required' }),
    start_date: z.string().nonempty({ message: 'errors.input_required' }),
    end_date: z.string().nonempty({ message: 'errors.input_required' }),
    address: z.string().nonempty({ message: 'errors.input_required' }),
    status: z.string().nonempty({ message: 'errors.input_required' }),
    is_internal_organizer: z.boolean(),
    product_items: z.any(),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    cpsId: string;
}

export default function AddCPFixedModal({ cpsId }: Props) {
    const t = useTranslations();
    const { user, supabase } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
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
        queryKey: ['organizers'],
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
            start_date: '',
            end_date: '',
            address: '',
            status: '',
            is_internal_organizer: true,
        },
    });

    const {
        formState: { errors },
        handleSubmit,
        reset,
        setValue,
    } = form;

    const handleAddress = (address: string) => {
        setValue('address', address);
    };

    const handleInsertCPFixed = async (form: ValidationSchema) => {
        setIsLoading(true);

        if (!selectedEOrganizer && !isInternalOrganizer) {
            setErrorOnSelectEOrganizer(true);
            return;
        }

        const {
            address,
            cp_name,
            cp_description,
            organizer_name,
            organizer_lastname,
            organizer_email,
            organizer_phone,
            start_date,
            end_date,
            product_items,
            status,
        } = form;

        if (!isValidObject(address)) {
            setAddressInputRequired(true);
            return;
        }

        const results = (await getGeocode({ address })) as any;

        const { data, error } = await supabase
            .from('cp_fixed')
            .insert({
                cp_name,
                cp_description,
                organizer_name,
                organizer_lastname,
                organizer_email,
                organizer_phone,
                start_date,
                end_date,
                address,
                status,
                is_booking_required: false,
                cp_id: cpsId,
                is_internal_organizer: isInternalOrganizer,
                geoArgs: results,
            })
            .select();

        if (error) {
            setIsLoading(false);
            throw error;
        }

        const pItemsFiltered = cleanObject(product_items);

        if (pItemsFiltered) {
            // Convert pItemsFiltered JSON objects to array
            const pItemsFilteredArray = Object.values(pItemsFiltered);

            const cpFixedId = data[0].id;

            // Link the pack with the consumption Point
            pItemsFilteredArray.map(async (pack: any) => {
                // TODO: Desde el register de accordionItem se introduce un product pack como string/json o como array de objetos. Habría que normalizar la información
                if (typeof pack.id === 'object') {
                    pack.id.map(async (packId: string) => {
                        const { error } = await supabase
                            .from('cpf_products')
                            .insert({
                                cp_id: cpFixedId,
                                product_pack_id: packId,
                            });

                        if (error) {
                            setIsLoading(false);
                            throw error;
                        }
                    });
                } else {
                    const { error } = await supabase
                        .from('cpf_products')
                        .insert({
                            cp_id: cpFixedId,
                            product_pack_id: pack.id,
                        });

                    if (error) {
                        setIsLoading(false);
                        throw error;
                    }
                }
            });
        }

        if (!isInternalOrganizer) {
            // Notify user that has been assigned as organizer
            const { error } = await supabase.from('notifications').insert({
                message: `You have been assigned as organizer for the fixed consumption point ${cp_name}`,
                user_id: selectedEOrganizer,
                link: `/${ROLE_ENUM.Productor}/profile?a=consumption_points`,
                source: user?.id, // User that has created the consumption point
            });

            if (error) {
                throw error;
            }
        }

        queryClient.invalidateQueries('cpFixed');
        setShowModal(false);
        setIsLoading(false);

        reset();
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

    const insertCPFixedMutation = useMutation({
        mutationKey: 'insertCPFixed',
        mutationFn: handleInsertCPFixed,
        onError: (error: any) => {
            console.error(error);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: ModalAddCPFixedFormData,
    ) => {
        return new Promise<void>((resolve, reject) => {
            insertCPFixedMutation.mutate(formValues, {
                onSuccess: () => resolve(),
                onError: (error) => reject(error),
            });
        });
    };

    return (
        <ModalWithForm
            showBtn={true}
            showModal={showModal}
            setShowModal={setShowModal}
            title={t('add_new_cp_fixed')}
            btnTitle={t('save')}
            description={''}
            handler={handleSubmit(onSubmit)}
            classIcon={'w-6 h-6'}
            classContainer={`${isLoading && ' opacity-75'}`}
            form={form}
        >
            {isLoading ? (
                <div className="h-[50vh]">
                    <Spinner size="xxLarge" color="beer-blonde" center />
                </div>
            ) : (
                <form>
                    <fieldset className="grid grid-cols-1 gap-2 rounded-md border-2 border-beer-softBlondeBubble p-4">
                        <legend className="m-2 text-2xl">
                            {t('cp_fixed_info')}
                        </legend>

                        {/* Status */}
                        <SelectInput
                            form={form}
                            labelTooltip={'cp_fixed_status_tooltip'}
                            options={cp_fixed_status_options}
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
                            labelText={t('description')}
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
                        <legend className="text-2xl">
                            {t('organizer_info')}
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
                                        labelText={t('name')}
                                        registerOptions={{
                                            required: true,
                                        }}
                                    />

                                    <InputLabel
                                        form={form}
                                        label={'organizer_lastname'}
                                        labelText={t('lastname')}
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
                                        labelText={t('email')}
                                        registerOptions={{
                                            required: true,
                                        }}
                                        inputType="email"
                                    />

                                    <InputLabel
                                        form={form}
                                        label={'organizer_phone'}
                                        labelText={t('phone')}
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
                        )}
                    </fieldset>

                    <fieldset className="mt-12 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                        <legend className="text-2xl">
                            {t('cp_fixed_location')}
                        </legend>

                        {addressInputRequired && (
                            <DisplayInputError message="errors.input_required" />
                        )}

                        {/* Address  */}
                        <CPGoogleMap handleAddress={handleAddress} />
                    </fieldset>

                    <fieldset className="mt-4 flex flex-col space-y-4">
                        <legend className="text-2xl">
                            {t('cp_fixed_products')}
                        </legend>

                        {/* List of selectable products that the owner can use */}
                        <ListCPMProducts form={form} />
                    </fieldset>
                </form>
            )}
        </ModalWithForm>
    );
}
