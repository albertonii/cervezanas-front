import ProducerDisclaimerModal from '../../(roles)/admin/profile/consumption_points/ProducerDisclaimerModal';
import DistributorDisclaimerModal from '../../(roles)/admin/profile/consumption_points/DistributorDisclaimerModal';
import InputLabel from '@/app/[locale]/components/common/InputLabel';
import SelectInput from '@/app/[locale]/components/common/SelectInput';
import Link from 'next/link';
import Button from '@/app/[locale]/components/common/Button';
import Spinner from '@/app/[locale]/components/common/Spinner';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { SignUpWithPasswordCredentials } from '../Context/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod';
import { useMutation } from 'react-query';
import { useAuth } from '../Context/useAuth';
import { ROLE_ENUM, ROLE_OPTIONS } from '@/lib//enums';
import { SupabaseProps } from '@/constants';
import ConsumptionPointDisclaimerModal from '../../(roles)/admin/profile/consumption_points/ConsumptionPointDisclaimerModal';

interface FormData {
    access_level: string;
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    is_legal_age: boolean;
    // avatar_url: string;
    // email_verified: boolean;
    // full_name: string;
    // iss: string;
    // name: string;
    // lastname: string;
    // picture: string;
    // provider_id: string;
    // sub: string;
}

const schema: ZodType<FormData> = z
    .object({
        access_level: z.string(),
        username: z.string().min(5, { message: 'errors.input_required' }),
        email: z
            .string()
            .email({
                message: 'errors.input_email_invalid',
            })
            .min(5, { message: 'errors.input_required' }),
        password: z.string().min(8, { message: 'errors.password_8_length' }),
        confirm_password: z
            .string()
            .min(8, { message: 'errors.password_8_length' }),
        is_legal_age: z.boolean().refine((data) => data === true, {
            message: 'errors.register_legal_age',
        }),
    })
    .refine((data) => data.password === data.confirm_password, {
        path: ['confirm_password'],
        message: 'errors.password_match',
    });

type ValidationSchema = z.infer<typeof schema>;

export const SignUpForm = () => {
    const t = useTranslations();

    const { signUp, isLoading: loading } = useAuth();
    const [isProducer, setIsProducer] = useState(false);
    const [isDistributor, setIsDistributor] = useState(false);
    const [isConsumptionPoint, setIsConsumptionPoint] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            access_level: ROLE_ENUM.Cervezano,
            username: '',
            email: '',
            password: '',
        },
    });

    const { handleSubmit, reset } = form;

    const [role, setRole] = useState(ROLE_ENUM.Cervezano);

    const handleChangeRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value: any = event?.target.value;

        setRole(value);
    };

    const handleCredentialsSignUp = async (form: ValidationSchema) => {
        const { username, email, password } = form;

        const data = {
            access_level: [role],
            username: username,
            email: email,
            email_verified: false,
        };

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
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 flex flex-col space-y-4"
        >
            <SelectInput
                form={form}
                labelTooltip={'tooltips.role_description'}
                options={ROLE_OPTIONS}
                label={'access_level'}
                registerOptions={{
                    required: true,
                }}
                onChange={handleChangeRole}
                defaultValue={role}
            />

            {/* <div className="flex w-full flex-col space-y-2">
                <select
                {...register("access_level")}
                value={role}
                onChange={handleChangeRole}
                className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                >
                {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                    {option.label}
                    </option>
                ))}
                </select>
            </div> */}

            <InputLabel
                form={form}
                label={'username'}
                registerOptions={{
                    required: true,
                }}
                placeholder="user_123"
            />

            <InputLabel
                form={form}
                label={'email'}
                registerOptions={{
                    required: true,
                }}
                placeholder="ejemplo@cervezanas.com"
                inputType="email"
            />

            <InputLabel
                form={form}
                label={'password'}
                registerOptions={{
                    required: true,
                }}
                placeholder="*****"
                inputType="password"
            />

            <InputLabel
                form={form}
                label={'confirm_password'}
                registerOptions={{
                    required: true,
                }}
                placeholder="*****"
                inputType="password"
            />

            <div className="flex w-full flex-col space-y-2">
                <InputLabel
                    form={form}
                    label={'is_legal_age'}
                    registerOptions={{
                        required: true,
                    }}
                    placeholder="*****"
                    inputType="checkbox"
                />
                <p className="text-xs text-gray-500">
                    {t('is_legal_age_description')}
                </p>
            </div>

            {role === ROLE_ENUM.Productor && (
                <div className="flex w-full flex-col space-y-2">
                    <div className="w-full">
                        <label
                            className={
                                'flex w-full flex-row-reverse  items-end justify-end gap-1 space-y-2 text-sm text-gray-600'
                            }
                            htmlFor="producer_disclaimer"
                        >
                            <span className="font-medium">
                                {t('producer_disclaimer_read_and_accepantance')}
                            </span>

                            <input
                                type="checkbox"
                                className={
                                    'float-right h-5 w-5 rounded border-bear-light bg-beer-softBlonde text-beer-blonde focus:ring-2 focus:ring-bear-alvine dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-beer-softBlonde'
                                }
                                id="producer_disclaimer"
                            />
                        </label>
                    </div>

                    <p className="text-xs text-gray-500">
                        <Link
                            href={
                                SupabaseProps.BASE_DOCUMENTS_URL +
                                '/acuerdo_productor_cervezanas.pdf?t=2024-01-24T17%3A52%3A02.060Z'
                            }
                            target={'_blank'}
                        >
                            <span className="mx-1 text-beer-darkGold hover:underline">
                                {t('click_here_to_download')}{' '}
                                {t('producer_read_disclaimer')}
                            </span>
                        </Link>
                    </p>
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

            {loading ? (
                <span>
                    <Spinner color={''} size={''} />
                </span>
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
                            'group relative my-4 flex w-full justify-center rounded-md border border-none border-transparent bg-beer-blonde px-4 py-2 text-sm font-medium hover:bg-beer-draft hover:font-semibold hover:text-beer-blonde focus:outline-none focus:ring-2 focus:ring-beer-softBlonde focus:ring-offset-2 '
                        }
                        fullSize
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
