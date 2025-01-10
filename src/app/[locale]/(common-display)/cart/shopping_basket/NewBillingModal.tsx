import React, { useState } from 'react';
import ModalWithForm from '@/app/[locale]/components/modals/ModalWithForm';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useQueryClient } from 'react-query';
import { BillingInformationType } from '@/lib/enums';
import { zodResolver } from '@hookform/resolvers/zod';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { useMessage } from '@/app/[locale]/components/message/useMessage';

import {
    insertCompanyBillingAddress,
    insertIndividualBillingAddress,
} from '../actions';
import { NewBillingIndividualAddress } from './NewBillingIndividualAddress';
import { NewBillingCompanyAddress } from './NewBillingCompanyAddress';

const IndividualSchema = z.object({
    type: z.literal(BillingInformationType.INDIVIDUAL), // <--- clave de discriminación
    name: z.string().nonempty({ message: 'errors.input_required' }),
    lastname: z.string().nonempty({ message: 'errors.input_required' }),

    // Campos comunes a ambos que sean obligatorios
    document_id: z.string().nonempty({ message: 'errors.input_required' }),
    address: z.string().nonempty({ message: 'errors.input_required' }),
    country: z.string().nonempty({ message: 'errors.input_required' }),
    region: z.string().nonempty({ message: 'errors.input_required' }),
    sub_region: z.string().nonempty({ message: 'errors.input_required' }),
    city: z.string().nonempty({ message: 'errors.input_required' }),
    zipcode: z.string().nonempty({ message: 'errors.input_required' }),
    phone: z.string().nonempty({ message: 'errors.input_required' }),

    // Opcionales
    address_extra: z.string().optional(),

    // Si `is_default` lo pones en ambos, estará disponible en ambos:
    is_default: z.boolean().default(false).optional(),
});

const CompanySchema = z.object({
    type: z.literal(BillingInformationType.COMPANY), // <--- clave de discriminación
    company_name: z.string().nonempty({ message: 'errors.input_required' }),

    // Campos comunes a ambos que sean obligatorios
    document_id: z.string().nonempty({ message: 'errors.input_required' }),
    address: z.string().nonempty({ message: 'errors.input_required' }),
    country: z.string().nonempty({ message: 'errors.input_required' }),
    region: z.string().nonempty({ message: 'errors.input_required' }),
    sub_region: z.string().nonempty({ message: 'errors.input_required' }),
    city: z.string().nonempty({ message: 'errors.input_required' }),
    zipcode: z.string().nonempty({ message: 'errors.input_required' }),
    phone: z.string().nonempty({ message: 'errors.input_required' }),

    // Opcionales
    address_extra: z.string().optional(),

    // Si `is_default` lo pones en ambos, estará disponible en ambos:
    is_default: z.boolean().default(false).optional(),
});

// 2. Creamos la "unión discriminada"
//    para que Zod sepa qué validar en función de `type`.
export const schemaNewBillingModal = z.discriminatedUnion('type', [
    IndividualSchema,
    CompanySchema,
]);

export type NewBillingValidationSchema = z.infer<typeof schemaNewBillingModal>;

interface Props {
    billingAddressesLength: number;
}

export default function NewBillingModal({ billingAddressesLength }: Props) {
    const t = useTranslations();
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const queryClient = useQueryClient();

    const { user } = useAuth();
    const { handleMessage } = useMessage();

    const form = useForm<NewBillingValidationSchema>({
        resolver: zodResolver(schemaNewBillingModal),
        defaultValues: {
            type: BillingInformationType.INDIVIDUAL,
            is_default: billingAddressesLength === 0,
        },
        mode: 'onChange',
    });

    const { reset } = form;

    const watchType = form.watch('type');

    const handleSave = async () => {
        console.log('DENTRO'); // Este método se ejecuta si el trigger() no encuentra errores
        // Recoge los datos del form
        const values = form.getValues();

        // Haces la lógica final de guardado.
        // Por ejemplo:
        if (values.type === BillingInformationType.INDIVIDUAL) {
            handleIndividualAddBillingAddress(values);
        } else {
            handleCompanyAddBillingAddress(values);
        }
    };

    const handleIndividualAddBillingAddress = async (
        form: Extract<
            NewBillingValidationSchema,
            { type: BillingInformationType.INDIVIDUAL }
        >,
    ) => {
        setIsLoading(true);

        const object = {
            user_id: user?.id,
            name: form.name,
            lastname: form.lastname,
            document_id: form.document_id,
            phone: form.phone,
            address: form.address,
            zipcode: form.zipcode,
            country: form.country,
            region: form.region,
            sub_region: form.sub_region,
            city: form.city,
            is_default: billingAddressesLength === 0,
        };

        await insertIndividualBillingAddress(object)
            .then(() => {
                queryClient.invalidateQueries(['billingAddresses', user?.id]);
                reset();

                handleMessage({
                    type: 'success',
                    message: 'success.billing_address_created',
                });
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
                handleMessage({
                    type: 'error',
                    message: 'errors.creating_billing_address',
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleCompanyAddBillingAddress = async (
        form: Extract<
            NewBillingValidationSchema,
            { type: BillingInformationType.COMPANY }
        >,
    ) => {
        setIsLoading(true);

        console.log('LENGHT', billingAddressesLength);

        const object = {
            user_id: user?.id,
            company_name: form.company_name,
            document_id: form.document_id,
            phone: form.phone,
            address: form.address,
            zipcode: form.zipcode,
            country: form.country,
            region: form.region,
            sub_region: form.sub_region,
            city: form.city,
            is_default: billingAddressesLength === 0,
            is_company: false,
        };

        await insertCompanyBillingAddress(object)
            .then(() => {
                queryClient.invalidateQueries(['billingAddresses', user?.id]);
                reset();

                handleMessage({
                    type: 'success',
                    message: 'success.billing_address_created',
                });
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
                handleMessage({
                    type: 'error',
                    message: 'errors.creating_billing_address',
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <ModalWithForm
            showBtn={true}
            showModal={showModal}
            setShowModal={setShowModal}
            title="add_billing_address"
            btnTitle="save"
            triggerBtnTitle="add_billing_address"
            description=""
            icon={faAdd}
            classContainer="!w-full sm:!w-1/2"
            form={form}
            handler={handleSave}
        >
            <>
                <div className="flex justify-center">
                    <label>
                        <input
                            type="radio"
                            value={BillingInformationType.INDIVIDUAL}
                            checked={
                                watchType === BillingInformationType.INDIVIDUAL
                            }
                            onChange={() =>
                                form.setValue(
                                    'type',
                                    BillingInformationType.INDIVIDUAL,
                                )
                            }
                            className="peer hidden"
                        />
                        <span
                            className={`
                                peer-checked:border-product-softBlonde peer-checked:text-product-dark dark:peer-checked:text-product-blonde inline-flex w-full cursor-pointer items-center
                                justify-between rounded-l-lg border border-gray-200 bg-white py-2 px-4 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600 
                                peer-checked:border-2 peer-checked:border-beer-blonde peer-checked:bg-beer-softFoam dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700
                                dark:hover:text-gray-300 dark:peer-checked:bg-beer-softFoam dark:peer-checked:border-beer-blonde dark:peer-checked:text-beer-dark
                                ${
                                    watchType ===
                                        BillingInformationType.INDIVIDUAL &&
                                    'font-semibold'
                                }
                            `}
                        >
                            {t('individual')}
                        </span>
                    </label>

                    <label>
                        <input
                            type="radio"
                            value={BillingInformationType.COMPANY}
                            checked={
                                watchType === BillingInformationType.COMPANY
                            }
                            onChange={() =>
                                form.setValue(
                                    'type',
                                    BillingInformationType.COMPANY,
                                )
                            }
                            className="peer hidden"
                        />
                        <span
                            className={`
                                peer-checked:border-product-softBlonde peer-checked:text-product-dark dark:peer-checked:text-product-blonde inline-flex w-full cursor-pointer items-center
                                justify-between rounded-r-lg border border-gray-200 bg-white py-2 px-4 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600 
                                peer-checked:border-2 peer-checked:border-beer-blonde peer-checked:bg-beer-softFoam dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700
                                dark:hover:text-gray-300 dark:peer-checked:bg-beer-softFoam dark:peer-checked:border-beer-blonde dark:peer-checked:text-beer-dark
                                ${
                                    watchType ===
                                        BillingInformationType.COMPANY &&
                                    'font-semibold'
                                }
                            `}
                        >
                            {t('company_or_freelance')}
                        </span>
                    </label>
                </div>

                {/* Render condicional */}
                {watchType === BillingInformationType.INDIVIDUAL && (
                    <NewBillingIndividualAddress form={form} />
                )}

                {watchType === BillingInformationType.COMPANY && (
                    <NewBillingCompanyAddress form={form} />
                )}
            </>
        </ModalWithForm>
    );
}
