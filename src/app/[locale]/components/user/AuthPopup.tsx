import Button from '../ui/buttons/Button';
import InputLabel from '../form/InputLabel';
import useOnClickOutside from '@/hooks/useOnOutsideClickDOM';
import React, { useCallback, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { z, ZodType } from 'zod';
import { useMutation } from 'react-query';
import { useLocale, useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../(auth)/Context/useAuth';
import { SubmitHandler, useForm } from 'react-hook-form';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { ROUTE_SIGNIN } from '@/config';

interface AuthPopupProps {
    onClose: () => void;
}

type SigninFormData = {
    email: string;
    password: string;
};

const signInSchema: ZodType<SigninFormData> = z.object({
    email: z
        .string()
        .email({
            message: 'errors.input_email_invalid',
        })
        .min(5, { message: 'errors.input_required' }),
    password: z.string().min(8, { message: 'errors.password_8_length' }),
});

type SignInValidationSchema = z.infer<typeof signInSchema>;

const AuthPopup: React.FC<AuthPopupProps> = ({ onClose }) => {
    const t = useTranslations();
    const router = useRouter();
    const locale = useLocale();

    const { signInWithProvider, signIn } = useAuth();
    const modalRef = useRef<HTMLDivElement>(null);

    const signInForm = useForm<SigninFormData>({
        resolver: zodResolver(signInSchema),
    });

    const { handleSubmit, reset } = signInForm;

    const handleCredentialsSignIn = async (form: SignInValidationSchema) => {
        const { email, password } = form;
        const isSignedIn = await signIn(email, password);

        if (isSignedIn) {
            reset();
            onClose();
        }
    };

    const handleCredentialsMutation = useMutation({
        mutationKey: 'credentials_sign_in_popup',
        mutationFn: handleCredentialsSignIn,
        onError: (error: Error) => {
            console.error(error);
        },
    });

    const onSubmitSignin: SubmitHandler<SignInValidationSchema> = (
        formValues: SigninFormData,
    ) => {
        try {
            handleCredentialsMutation.mutate(formValues);
        } catch (e) {
            console.error(e);
        }
    };

    const handleGoogleSignIn = async () => {
        signInWithProvider('google');
    };

    const handleGoToSignInPage = () => {
        router.push(`/${locale}${ROUTE_SIGNIN}`);
        onClose();
    };

    useOnClickOutside(modalRef, () => onClose());

    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        },
        [onClose],
    );

    useEffect(() => {
        // attach the event listener if the modal is shown
        document.addEventListener('keydown', handleKeyPress);
        // remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 -top-[25vh]">
            <div
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
                ref={modalRef}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{t('sign_in')}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmitSignin)}
                    className="space-y-4"
                >
                    {/* email  */}
                    <InputLabel
                        form={signInForm}
                        label={'email'}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder="user@cervezanas.com"
                        inputType="email"
                    />

                    {/* password  */}
                    <InputLabel
                        form={signInForm}
                        label={'password'}
                        registerOptions={{
                            required: true,
                        }}
                        inputType="password"
                        placeholder="*****"
                    />

                    {/* submit  */}
                    <Button
                        title={'sign_in'}
                        class="w-full bg-beer-blonde text-white py-2 rounded-md hover:bg-beer-draft transition"
                        btnType="submit"
                    >
                        <FontAwesomeIcon icon={faLock} className="mr-2" />
                        {t('sign_in')}
                    </Button>
                </form>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">O</span>
                    </div>
                </div>

                <div className="mt-4">
                    <Button
                        accent
                        class=" mr-2 w-full rounded-lg border bg-white px-4 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        onClick={() => handleGoogleSignIn()}
                    >
                        <div className="flex items-center ">
                            <span className="mx-2 my-2 flex h-6 w-6 items-center justify-center">
                                <svg
                                    className="w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 0 32 32"
                                    width="64"
                                    height="64"
                                >
                                    <defs>
                                        <path
                                            id="A"
                                            d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                                        />
                                    </defs>
                                    <clipPath id="B">
                                        <use xlinkHref="#A" />
                                    </clipPath>
                                    <g transform="matrix(.727273 0 0 .727273 -.954545 -1.45455)">
                                        <path
                                            d="M0 37V11l17 13z"
                                            clipPath="url(#B)"
                                            fill="#fbbc05"
                                        />
                                        <path
                                            d="M0 11l17 13 7-6.1L48 14V0H0z"
                                            clipPath="url(#B)"
                                            fill="#ea4335"
                                        />
                                        <path
                                            d="M0 37l30-23 7.9 1L48 0v48H0z"
                                            clipPath="url(#B)"
                                            fill="#34a853"
                                        />
                                        <path
                                            d="M48 48L17 24l-4-3 35-10z"
                                            clipPath="url(#B)"
                                            fill="#4285f4"
                                        />
                                    </g>
                                </svg>
                            </span>

                            <span className="ml-2 text-md sm:text-lg">
                                {t('continue_with_google')}
                            </span>
                        </div>
                    </Button>
                </div>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">O</span>
                    </div>
                </div>

                <div
                    className="mt-4 text-center hover:underline cursor-pointer"
                    onClick={handleGoToSignInPage}
                >
                    <span className="text-beer-draft text-lg hover:underline">
                        {t('go_to_signin_and_signup_page')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AuthPopup;
