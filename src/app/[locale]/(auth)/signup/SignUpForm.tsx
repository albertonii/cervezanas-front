import Link from 'next/link';
import Title from '../../components/ui/Title';
import Label from '../../components/ui/Label';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/buttons/Button';
import InputLabel from '../../components/form/InputLabel';
import SelectInput from '../../components/form/SelectInput';
import InputTextarea from '../../components/form/InputTextarea';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import ProducerDisclaimerModal from '../../(roles)/admin/profile/consumption_points/ProducerDisclaimerModal';
import DistributorDisclaimerModal from '../../(roles)/admin/profile/consumption_points/DistributorDisclaimerModal';
import ConsumptionPointDisclaimerModal from '../../(roles)/admin/profile/consumption_points/ConsumptionPointDisclaimerModal';
import { useState } from 'react';
import { z, ZodType } from 'zod';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { SupabaseProps } from '@/constants';
import { useAuth } from '../Context/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROLE_ENUM, ROLE_OPTIONS } from '@/lib//enums';
import { SubmitHandler, useForm } from 'react-hook-form';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SignUpWithPasswordCredentials } from '../Context/AuthContext';

interface FormData {
    access_level: string;
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    is_legal_age: boolean;
    company_name?: string;
    id_number?: string;
    company_email?: string;
    company_phone?: string;
    company_description?: string;
    company_legal_representative?: string;
}

const schema: ZodType<FormData> = z
    .object({
        access_level: z.string(),
        username: z
            .string()
            .min(5, { message: 'errors.input_required' })
            .regex(/^[a-zA-Z0-9._]+$/, {
                message: 'errors.username_invalid_characters',
            })
            .max(30, { message: 'errors.input_unsername_max_length_20' })
            .transform((val) => val.toLowerCase()), // Normalización a minúsculas
        email: z
            .string()
            .email({
                message: 'errors.input_email_invalid',
            })
            .min(5, { message: 'errors.input_required' })
            .transform((val) => val.toLowerCase()), // Normalización a minúsculas
        password: z.string().min(8, { message: 'errors.password_8_length' }),
        confirm_password: z
            .string()
            .min(8, { message: 'errors.password_8_length' }),
        is_legal_age: z.boolean().refine((data) => data === true, {
            message: 'errors.register_legal_age',
        }),
        company_name: z.string().optional(),
        id_number: z.string().optional(),
        company_email: z.string().optional(),
        company_phone: z.string().optional(),
        company_description: z.string().optional(),
        company_legal_representative: z.string().optional(),
    })
    .refine((data) => data.password === data.confirm_password, {
        path: ['confirm_password'],
        message: 'errors.password_match',
    })
    .refine(
        (data) => {
            if (
                data.access_level === ROLE_ENUM.Productor ||
                data.access_level === ROLE_ENUM.Distributor
            ) {
                return !!data.company_name;
            }
            return true;
        },
        {
            path: ['company_name'],
            message: 'errors.input_required',
        },
    )
    .refine(
        (data) => {
            if (
                data.access_level === ROLE_ENUM.Productor ||
                data.access_level === ROLE_ENUM.Distributor
            ) {
                return !!data.id_number;
            }
            return true;
        },
        {
            path: ['id_number'],
            message: 'errors.input_required',
        },
    )
    .refine(
        (data) => {
            if (
                data.access_level === ROLE_ENUM.Productor ||
                data.access_level === ROLE_ENUM.Distributor
            ) {
                return !!data.company_email;
            }
            return true;
        },
        {
            path: ['company_email'],
            message: 'errors.input_required',
        },
    )
    .refine(
        (data) => {
            if (
                data.access_level === ROLE_ENUM.Productor ||
                data.access_level === ROLE_ENUM.Distributor
            ) {
                return !!data.company_phone;
            }
            return true;
        },
        {
            path: ['company_phone'],
            message: 'errors.input_required',
        },
    )
    .refine(
        (data) => {
            if (
                data.access_level === ROLE_ENUM.Productor ||
                data.access_level === ROLE_ENUM.Distributor
            ) {
                return !!data.company_description;
            }
            return true;
        },
        {
            path: ['company_description'],
            message: 'errors.input_required',
        },
    )
    .refine(
        (data) => {
            if (
                data.access_level === ROLE_ENUM.Productor ||
                data.access_level === ROLE_ENUM.Distributor
            ) {
                return !!data.company_legal_representative;
            }
            return true;
        },
        {
            path: ['company_legal_representative'],
            message: 'errors.input_required',
        },
    );

type ValidationSchema = z.infer<typeof schema>;

export const SignUpForm = () => {
    const t = useTranslations();

    const { signUp } = useAuth();
    const [isSignupSubmitLoading, setSignupSubmitLoading] = useState(false);
    const [isProducer, setIsProducer] = useState(false);
    const [isDistributor, setIsDistributor] = useState(false);
    const [isConsumptionPoint, setIsConsumptionPoint] = useState(false);
    const [role, setRole] = useState(ROLE_ENUM.Cervezano);

    const form = useForm<ValidationSchema>({
        resolver: zodResolver(schema),
        defaultValues: {
            access_level: ROLE_ENUM.Cervezano,
            username: '',
            email: '',
            password: '',
        },
    });

    const { handleSubmit, reset } = form;

    const handleChangeRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value: any = event?.target.value;

        setRole(value);
    };

    const handleCredentialsSignUp = async (form: ValidationSchema) => {
        setSignupSubmitLoading(true);

        const { username, email, password } = form;

        const data: {
            access_level: ROLE_ENUM[];
            username: string;
            email: string;
            email_verified: boolean;
            company_name?: string;
            id_number?: string;
            company_email?: string;
            company_phone?: string;
            company_description?: string;
            company_legal_representative?: string;
        } = {
            access_level: [role],
            username: username,
            email: email,
            email_verified: false,
        };

        if (role === ROLE_ENUM.Distributor || role === ROLE_ENUM.Productor) {
            data.company_name = form.company_name;
            data.id_number = form.id_number;
            data.company_email = form.company_email;
            data.company_phone = form.company_phone;
            data.company_description = form.company_description;
            data.company_legal_representative =
                form.company_legal_representative;
        }

        if (
            role === ROLE_ENUM.Distributor ||
            role === ROLE_ENUM.Productor ||
            role === ROLE_ENUM.Consumption_point
        ) {
            data.access_level.push(ROLE_ENUM.Cervezano);
        }

        const signUpInfo: SignUpWithPasswordCredentials = {
            email: email,
            password: password,
            options: {
                emailRedirectTo: `${location.origin}/api/auth/callback`,
                captchaToken: '',
                data: data,
            },
        };

        await signUp(signUpInfo).then((res) => {
            if (res) {
                if (role === ROLE_ENUM.Productor) {
                    setIsProducer(true);
                } else if (role === ROLE_ENUM.Distributor) {
                    setIsDistributor(true);
                } else if (role === ROLE_ENUM.Consumption_point) {
                    setIsConsumptionPoint(true);
                }

                reset();
            }
        });

        setSignupSubmitLoading(false);
    };

    const handleCredentialsMutation = useMutation({
        mutationKey: 'credentialsSignUp',
        mutationFn: handleCredentialsSignUp,
        onError: (error: Error) => {
            console.error(error);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: FormData,
    ) => {
        try {
            handleCredentialsMutation.mutate(formValues);
        } catch (e) {
            console.error(e);
        }
    };

    const handleCloseModal = () => {
        setIsProducer(false);
        setIsDistributor(false);
        setIsConsumptionPoint(false);
    };

    const handleSetIsProducer = (isProducer: boolean) => {
        setIsProducer(isProducer);
    };

    const handleSetIsDistributor = (isDistributor: boolean) => {
        setIsDistributor(isDistributor);
    };

    const handleSetIsConsumptionPoint = (isConsumptionPoint: boolean) => {
        setIsConsumptionPoint(isConsumptionPoint);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`mt-4 space-y-8`}>
            <div className="space-y-4">
                {isSignupSubmitLoading && (
                    <span>
                        <Spinner
                            color={'beer-blonde'}
                            size={'large'}
                            absolute
                            absolutePosition={'center'}
                        />
                    </span>
                )}

                <SelectInput
                    form={form}
                    labelTooltip={'tooltips.role_description'}
                    options={ROLE_OPTIONS}
                    label={'access_level'}
                    registerOptions={{
                        required: true,
                    }}
                    onChange={handleChangeRole}
                />

                <div className="flex gap-4">
                    <InputLabel
                        form={form}
                        label={'username'}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder="user_123"
                        disabled={isSignupSubmitLoading}
                    />

                    <InputLabel
                        form={form}
                        label={'email'}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder="ejemplo@cervezanas.beer"
                        inputType="email"
                        disabled={isSignupSubmitLoading}
                    />
                </div>

                <div className="flex gap-4">
                    <InputLabel
                        form={form}
                        label={'password'}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder="*****"
                        inputType="password"
                        disabled={isSignupSubmitLoading}
                    />

                    <InputLabel
                        form={form}
                        label={'confirm_password'}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder="*****"
                        inputType="password"
                        disabled={isSignupSubmitLoading}
                    />
                </div>

                <PasswordStrengthIndicator password={form.watch('password')} />
            </div>

            {role === ROLE_ENUM.Productor && (
                <div className="flex w-full flex-col space-y-2">
                    <Title size="medium" color="beer-blonde">
                        {t('company_information')}
                    </Title>

                    <div className="flex gap-4">
                        <InputLabel
                            form={form}
                            label={'company_name'}
                            labelText={'public_user_information.company_name'}
                            registerOptions={{
                                required: true,
                            }}
                            placeholder="Empresa Cervezanas SL"
                            disabled={isSignupSubmitLoading}
                        />

                        <InputLabel
                            form={form}
                            label={'id_number'}
                            labelText={'public_user_information.id_number'}
                            registerOptions={{
                                required: true,
                            }}
                            placeholder="G35887712"
                            disabled={isSignupSubmitLoading}
                        />
                    </div>

                    <div className="flex gap-4">
                        <InputLabel
                            form={form}
                            label={'company_legal_representative'}
                            labelText={
                                'public_user_information.company_legal_representative'
                            }
                            registerOptions={{
                                required: true,
                            }}
                            placeholder="Juan Pérez"
                            disabled={isSignupSubmitLoading}
                        />

                        <InputLabel
                            form={form}
                            label={'company_phone'}
                            labelText={'public_user_information.company_phone'}
                            registerOptions={{
                                required: true,
                            }}
                            placeholder="+34 123 456 789"
                            disabled={isSignupSubmitLoading}
                        />
                    </div>

                    <InputLabel
                        form={form}
                        label={'company_email'}
                        labelText={'public_user_information.company_email'}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder="correoempresa@cervezanas.beer"
                        inputType="email"
                        disabled={isSignupSubmitLoading}
                    />

                    <InputTextarea
                        form={form}
                        label={'company_description'}
                        labelText={'company_description'}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder="Breve descripción de la empresa"
                        disabled={isSignupSubmitLoading}
                    />
                </div>
            )}

            {role === ROLE_ENUM.Distributor && (
                <div className="flex w-full flex-col space-y-2">
                    <Title size="medium" color="beer-blonde">
                        {t('company_information')}
                    </Title>

                    <div className="flex gap-4">
                        <InputLabel
                            form={form}
                            label={'company_name'}
                            labelText={'public_user_information.company_name'}
                            registerOptions={{
                                required: true,
                            }}
                            placeholder="Empresa Cervezanas SL"
                            disabled={isSignupSubmitLoading}
                        />

                        <InputLabel
                            form={form}
                            label={'id_number'}
                            labelText={'public_user_information.id_number'}
                            registerOptions={{
                                required: true,
                            }}
                            placeholder="G35887712"
                            disabled={isSignupSubmitLoading}
                        />
                    </div>

                    <div className="flex gap-4">
                        <InputLabel
                            form={form}
                            label={'company_legal_representative'}
                            labelText={
                                'public_user_information.company_legal_representative'
                            }
                            registerOptions={{
                                required: true,
                            }}
                            placeholder="Juan Pérez"
                            disabled={isSignupSubmitLoading}
                        />

                        <InputLabel
                            form={form}
                            label={'company_phone'}
                            labelText={'public_user_information.company_phone'}
                            registerOptions={{
                                required: true,
                            }}
                            placeholder="+34 123 456 789"
                            disabled={isSignupSubmitLoading}
                        />
                    </div>

                    <InputLabel
                        form={form}
                        label={'company_email'}
                        labelText={'public_user_information.company_email'}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder="correoempresa@cervezanas.beer"
                        inputType="email"
                        disabled={isSignupSubmitLoading}
                    />

                    <InputTextarea
                        form={form}
                        label={'company_description'}
                        labelText={'company_description'}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder="Breve descripción de la empresa"
                        disabled={isSignupSubmitLoading}
                    />
                </div>
            )}

            {role === ROLE_ENUM.Productor && (
                <div className="flex w-full flex-col space-y-2">
                    <div className="w-full flex items-start gap-2">
                        <input
                            type="checkbox"
                            className={
                                'h-5 w-5 rounded border-bear-light bg-beer-softBlonde text-beer-blonde focus:ring-2 focus:ring-bear-alvine dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-beer-softBlonde'
                            }
                            id="producer_disclaimer"
                            disabled={isSignupSubmitLoading}
                        />

                        <Label size="small" htmlFor="producer_disclaimer">
                            {t('producer_disclaimer_read_and_accepantance')}
                        </Label>
                    </div>

                    <Label size="xsmall">
                        <Link
                            href={
                                SupabaseProps.BASE_DOCUMENTS_URL +
                                '/acuerdo_productor_cervezanas.pdf?t=2024-01-24T17%3A52%3A02.060Z'
                            }
                            target={'_blank'}
                        >
                            <span className="mx-1 hover:underline">
                                {t('click_here_to_download')}{' '}
                                {t('producer_read_disclaimer')}
                            </span>
                        </Link>
                    </Label>
                </div>
            )}

            {role === ROLE_ENUM.Distributor && (
                <div className="flex w-full flex-col space-y-2">
                    <div className="w-full">
                        <label
                            className={
                                'flex w-full flex-row-reverse  items-end justify-end gap-1 space-y-2 text-sm text-gray-600'
                            }
                            htmlFor="distributor_disclaimer"
                        >
                            <span className="font-medium">
                                {t(
                                    'distributor_disclaimer_read_and_accepantance',
                                )}
                            </span>

                            <input
                                type="checkbox"
                                className={
                                    'float-right h-5 w-5 rounded border-bear-light bg-beer-softBlonde text-beer-blonde focus:ring-2 focus:ring-bear-alvine dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-beer-softBlonde'
                                }
                                id="distributor_disclaimer"
                                disabled={isSignupSubmitLoading}
                            />
                        </label>
                    </div>

                    <p className="text-xs text-gray-500">
                        <Link
                            href={
                                SupabaseProps.BASE_DOCUMENTS_URL +
                                '/acuerdo_distribuidor_cervezanas.pdf?t=2024-01-24T17%3A51%3A27.332Z'
                            }
                            target={'_blank'}
                        >
                            <span className="mx-1 text-beer-darkGold hover:underline">
                                {t('click_here_to_download')}{' '}
                                {t('distributor_read_disclaimer')}
                            </span>
                        </Link>
                    </p>
                </div>
            )}

            {role === ROLE_ENUM.Consumption_point && (
                <div className="flex w-full flex-col space-y-2">
                    <div className="w-full">
                        <label
                            className={
                                'flex w-full flex-row-reverse  items-end justify-end gap-1 space-y-2 text-sm text-gray-600'
                            }
                            htmlFor="consumption_point_disclaimer"
                        >
                            <span className="font-medium">
                                {t(
                                    'consumption_point_disclaimer_read_and_accepantance',
                                )}
                            </span>

                            <input
                                type="checkbox"
                                className={
                                    'float-right h-5 w-5 rounded border-bear-light bg-beer-softBlonde text-beer-blonde focus:ring-2 focus:ring-bear-alvine dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-beer-softBlonde'
                                }
                                id="consumption_point_disclaimer"
                                disabled={isSignupSubmitLoading}
                            />
                        </label>
                    </div>

                    <p className="text-xs text-gray-500">
                        <Link
                            href={
                                SupabaseProps.BASE_DOCUMENTS_URL +
                                '/acuerdo_punto_consumo_cervezanas.pdf?t=2024-01-24T17%3A51%3A27.332Z'
                            }
                            target={'_blank'}
                        >
                            <span className="mx-1 text-beer-darkGold hover:underline">
                                {t('click_here_to_download')}{' '}
                                {t('consumption_point_read_disclaimer')}
                            </span>
                        </Link>
                    </p>
                </div>
            )}

            <div className="w-full flex items-start gap-2">
                <input
                    type="checkbox"
                    {...form.register('is_legal_age', { required: true })}
                    className="h-5 w-5 rounded border-bear-light bg-beer-softBlonde text-beer-blonde focus:ring-2 focus:ring-bear-alvine 
                        dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-beer-softBlonde"
                    disabled={isSignupSubmitLoading}
                />
                <Label size="small">{t('is_legal_age_description')}</Label>
            </div>

            {isSignupSubmitLoading ? (
                <Spinner color={'beer-blonde'} size={'small'} />
            ) : (
                <>
                    <ProducerDisclaimerModal
                        isProducer={isProducer}
                        handleSetIsProducer={handleSetIsProducer}
                        handleCloseModal={handleCloseModal}
                    />

                    <DistributorDisclaimerModal
                        isDistributor={isDistributor}
                        handleSetIsDistributor={handleSetIsDistributor}
                        handleCloseModal={handleCloseModal}
                    />

                    <ConsumptionPointDisclaimerModal
                        isConsumptionPoint={isConsumptionPoint}
                        handleSetIsConsumptionPoint={
                            handleSetIsConsumptionPoint
                        }
                        handleCloseModal={handleCloseModal}
                    />

                    <Button
                        title={'sign_up'}
                        btnType="submit"
                        class={
                            'group relative my-1 flex w-full justify-center rounded-md border border-none border-transparent bg-beer-blonde px-4 py-2 text-sm font-medium hover:bg-beer-draft hover:font-semibold hover:text-beer-blonde focus:outline-none focus:ring-2 focus:ring-beer-softBlonde focus:ring-offset-2 '
                        }
                        fullSize
                        disabled={isSignupSubmitLoading}
                    >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FontAwesomeIcon
                                icon={faLock}
                                style={{ color: 'bear-dark' }}
                                title={'Lock'}
                                className="text-base text-beer-softBlonde group-hover:text-beer-blonde"
                            />
                        </span>
                        {t('sign_up')}
                    </Button>
                </>
            )}
        </form>
    );
};
