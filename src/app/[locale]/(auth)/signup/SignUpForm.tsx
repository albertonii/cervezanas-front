import { useState } from 'react';
import Spinner from '../../components/common/Spinner';
import { useTranslations } from 'next-intl';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { SignUpWithPasswordCredentials } from '../Context/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod';
import { useMutation } from 'react-query';
import { useMessage } from '../../components/message/useMessage';
import { useAuth } from '../Context/useAuth';
import Button from '../../components/common/Button';
import { ROLE_ENUM, ROLE_OPTIONS } from '../../../../lib/enums';
import InputLabel from '../../components/common/InputLabel';
import SelectInput from '../../components/common/SelectInput';
import Link from 'next/link';
import { SupabaseProps } from '../../../../constants';
import Modal from '../../components/modals/Modal';
import ProducerDisclaimerModal from '../../(roles)/admin/profile/consumption_points/ProducerDisclaimerModal';
import DistributorDisclaimerModal from '../../(roles)/admin/profile/consumption_points/DistributorDisclaimerModal';

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
    username: z.string().min(5, { message: 'Required' }),
    email: z
      .string()
      .email({
        message: 'Must be a valid email',
      })
      .min(5, { message: 'Required' }),
    password: z
      .string()
      .min(8, { message: 'Password must be atleast 8 characters' }),
    confirm_password: z
      .string()
      .min(8, { message: 'Password must be atleast 8 characters' }),
    is_legal_age: z.boolean().refine((data) => data === true, {
      message: 'You must be of legal age',
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: "Password don't match",
  });

type ValidationSchema = z.infer<typeof schema>;

export const SignUpForm = () => {
  const t = useTranslations();

  const { signUp, isLoading: loading } = useAuth();
  const [isProducer, setIsProducer] = useState(false);
  const [isDistributor, setIsDistributor] = useState(false);

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
  const { handleMessage } = useMessage();

  const handleChangeRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value: any = event?.target.value;

    setRole(value);
  };

  const handleCredentialsSignUp = async (form: ValidationSchema) => {
    const { username, email, password } = form;

    const data = {
      access_level: role,
      username: username,
      email: email,
      email_verified: false,
    };

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

  const onSubmit: SubmitHandler<ValidationSchema> = (formValues: FormData) => {
    try {
      handleCredentialsMutation.mutate(formValues);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCloseModal = () => {
    setIsProducer(false);
    setIsDistributor(false);
  };

  const handleSetIsProducer = (isProducer: boolean) => {
    setIsProducer(isProducer);
  };

  const handleSetIsDistributor = (isDistributor: boolean) => {
    setIsDistributor(isDistributor);
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
        <p className="text-xs text-gray-500">{t('is_legal_age_description')}</p>
      </div>

      {role === ROLE_ENUM.Productor && (
        <div className="flex w-full flex-col space-y-2">
          {/* <InputLabel
            form={form}
            label={"is_legal_age"}
            labelText={t("producer_disclaimer_acceptance")}
            registerOptions={{
              required: true,
            }}
            placeholder="*****"
            inputType="checkbox"
          /> */}

          <div className="w-full">
            <label
              className={
                'flex w-full flex-row-reverse  items-end justify-end gap-1 space-y-2 text-sm text-gray-600'
              }
            >
              <span className="font-medium">
                {t('producer_disclaimer_acceptance')}
              </span>

              <input
                type="checkbox"
                className={
                  'float-right h-5 w-5 rounded border-bear-light bg-beer-softBlonde text-beer-blonde focus:ring-2 focus:ring-bear-alvine dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-beer-softBlonde'
                }
              />
            </label>
          </div>

          <Link
            href={
              SupabaseProps.BASE_DOCUMENTS_URL +
              '/acuerdo_productor_cervezanas.pdf?t=2024-01-24T17%3A52%3A02.060Z'
            }
            target={'_blank'}
          >
            <span className="mx-1 text-beer-darkGold hover:underline">
              {t('producer_read_disclaimer')}
            </span>
          </Link>
        </div>
      )}

      {role === ROLE_ENUM.Distributor && (
        <div className="flex w-full flex-col space-y-2">
          <div className="w-full">
            <label
              className={
                'flex w-full flex-row-reverse  items-end justify-end gap-1 space-y-2 text-sm text-gray-600'
              }
            >
              <span className="font-medium">
                {t('distributor_disclaimer_acceptance')}
              </span>

              <input
                type="checkbox"
                className={
                  'float-right h-5 w-5 rounded border-bear-light bg-beer-softBlonde text-beer-blonde focus:ring-2 focus:ring-bear-alvine dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-beer-softBlonde'
                }
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
                {t('distributor_read_disclaimer')}
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
