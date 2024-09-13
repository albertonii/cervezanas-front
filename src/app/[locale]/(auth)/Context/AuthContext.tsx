'use client';

import useSWR from 'swr';
import React, { useEffect, useState, createContext, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Database } from '@/lib//schema';
import {
    ROUTE_ADMIN,
    ROUTE_AUTHORIZED_USERS,
    ROUTE_PROFILE,
    ROUTE_SIGNIN,
} from '@/config';
import { EVENTS, VIEWS } from '@/constants';
import { IUserProfile } from '@/lib//types/types';
import { useLocale, useTranslations } from 'next-intl';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { createBrowserClient } from '@/utils/supabaseBrowser';
import {
    AuthChangeEvent,
    AuthResponse,
    Provider,
    Session,
    SupabaseClient,
} from '@supabase/supabase-js';
import { ROLE_ENUM } from '@/lib//enums';
import {
    sendNewDistributorEmail,
    sendNewProducerEmail,
    sendPushNotification,
} from '@/lib//actions';

enum PROVIDER_TYPE {
    GOOGLE = 'google',
}

export type SignUpWithPasswordCredentials = {
    /** The user's email address. */
    email: string;
    /** The user's password. */
    password: string;
    options?: {
        /** The redirect url embedded in the email link */
        emailRedirectTo?: string;
        /**
         * A custom data object to store the user's metadata. This maps to the `auth.users.user_metadata` column.
         *
         * The `data` should be a JSON object that includes user-specific info, such as their first and last name.
         */
        data?: object;
        /** Verification token received when the user completes the captcha on the site. */
        captchaToken?: string;
    };
};
export interface AuthSession {
    initial: boolean;
    user: any;
    isLoading: boolean;
    isAuthLoading: boolean;
    setIsAuthLoading: (loading: boolean) => void;
    signUp: (payload: SignUpWithPasswordCredentials) => Promise<any>;
    signIn: (email: string, password: string) => void;
    signInWithProvider: (provider: Provider) => void;
    signOut: () => Promise<void>;
    sendResetPasswordEmail: (email: string) => Promise<boolean>;
    updatePassword: (password: string) => void;
    supabase: SupabaseClient<Database>;
    role: ROLE_ENUM | null;
    roles: ROLE_ENUM[] | null;
    provider: PROVIDER_TYPE | null;
    isLoggedIn: boolean;
    changeRole: (role: ROLE_ENUM) => void;
    getActiveRole: () => string | null;
}

const supabaseClient = createBrowserClient();

export const AuthContext = createContext<AuthSession>({
    initial: true,
    user: null,
    role: null,
    roles: [],
    isLoading: false,
    isAuthLoading: false,
    setIsAuthLoading: () => {},
    signUp: async () => null,
    signIn: async (email: string, password: string) => null,
    signInWithProvider: async () => void {},
    signOut: async () => void {},
    sendResetPasswordEmail: async () => false,
    updatePassword: async () => void {},
    supabase: supabaseClient,
    provider: null,
    isLoggedIn: false,
    changeRole: (role: ROLE_ENUM) => {},
    getActiveRole: () => null,
});

export const AuthContextProvider = ({
    serverSession,
    children,
}: {
    serverSession?: Session | null;
    children: React.ReactNode;
}) => {
    const t = useTranslations();
    const [initial, setInitial] = useState(true);
    const [view, setView] = useState(VIEWS.SIGN_IN);
    const locale = useLocale();
    const router = useRouter();
    const [isAuthLoading, setIsAuthLoading] = useState(false);

    const [supabase] = useState(supabaseClient);

    const [role, setRole] = useState<ROLE_ENUM | null>(null);
    const [roles, setRoles] = useState<ROLE_ENUM[] | null>([]);
    const [provider, setProvider] = useState<PROVIDER_TYPE | null>(null);

    const { handleMessage, clearMessages } = useMessage();

    const getUser = async () => {
        if (!serverSession) return undefined;

        const { data: user, error } = await supabase
            .from('users')
            .select(
                `
                    *,
                    gamification (
                        *
                    )
                `,
            )
            .eq('id', serverSession.user.id)

            .single();

        if (error) {
            console.error(error);
            return undefined;
        }

        return user as IUserProfile;
    };

    const {
        data: user,
        isLoading,
        mutate,
    } = useSWR(serverSession ? 'profile-context' : null, getUser);

    // Refresh the Page to Sync Server and Client
    useEffect(() => {
        async function getActiveSession() {
            const { data: activeSession } = await supabase.auth.getUser();

            // If the user login with the provider the role is going to be consumer
            // if (
            //     activeSession?.user?.app_metadata?.provider?.includes(
            //         PROVIDER_TYPE.GOOGLE,
            //     )
            // ) {
            //     setProvider(PROVIDER_TYPE.GOOGLE);
            //     setRole(ROLE_ENUM.Cervezano);
            //     setRoles([ROLE_ENUM.Cervezano]);
            //     return;
            // }

            const localStorageRole = window.localStorage.getItem('active_role');

            const activeRole = localStorageRole
                ? localStorageRole
                : activeSession?.user?.user_metadata?.access_level[0];

            // Set role for the user and load different layouts
            setRole(activeRole);
            setRoles(activeSession?.user?.user_metadata?.access_level);
        }

        getActiveSession();

        const {
            data: { subscription: authListener },
        } = supabase.auth.onAuthStateChange(
            async (event: AuthChangeEvent, currentSession: any) => {
                if (currentSession && currentSession.access_token) {
                    window.localStorage.setItem(
                        'oauth_provider_token',
                        currentSession.access_token,
                    );
                }

                if (currentSession && currentSession.refresh_token) {
                    window.localStorage.setItem(
                        'oauth_provider_refresh_token',
                        currentSession.refresh_token,
                    );
                }

                if (event === 'SIGNED_OUT') {
                    window.localStorage.removeItem('oauth_provider_token');
                    window.localStorage.removeItem(
                        'oauth_provider_refresh_token',
                    );
                }

                if (
                    (currentSession && currentSession.refresh_token) ||
                    (currentSession && currentSession.access_token)
                ) {
                    // Check if the user is logged in with a provider
                    if (
                        currentSession?.user?.app_metadata?.provider?.includes(
                            PROVIDER_TYPE.GOOGLE,
                        )
                    ) {
                        if (!currentSession.user.user_metadata.access_level) {
                            setRole(ROLE_ENUM.Cervezano);
                            // Send user role consumer to the server
                            await supabase.rpc('set_claim', {
                                uid: currentSession.user.id,
                                claim: 'access_level',
                                value: [ROLE_ENUM.Cervezano],
                            });
                        }
                    }
                }

                if (
                    !serverSession ||
                    !currentSession ||
                    currentSession.access_token !== serverSession?.access_token
                ) {
                    // trigger a router refresh whenever the current session changes
                    router.refresh();
                }

                switch (event) {
                    case EVENTS.INITIAL_SESSION:
                        setInitial(false);
                        break;
                    case EVENTS.PASSWORD_RECOVERY:
                        console.log('PASSWORD_RECOVERY');
                        setView(VIEWS.UPDATE_PASSWORD);
                        break;
                    case EVENTS.SIGNED_IN:
                        setView(VIEWS.SIGN_IN);
                        break;

                    case EVENTS.SIGNED_OUT:
                        setView(VIEWS.SIGN_IN);
                        router.push(`/${locale}/${ROUTE_SIGNIN}`);
                        break;
                    case EVENTS.USER_UPDATED:
                        setView(VIEWS.SIGN_IN);
                        break;
                    default:
                }
            },
        );

        return () => {
            authListener?.unsubscribe();
        };
    }, [serverSession, supabase, router]);

    const signUp = async (payload: SignUpWithPasswordCredentials) => {
        const signUpMessage = t('messages.sign_up_success');
        const userAlreadyRegisteredMessage = t(
            'messages.user_already_registered',
        );

        // Check if user exists
        const { data: user, error: emailError } = await supabase
            .from('users')
            .select(
                `
                    *
                `,
            )
            .eq('email', payload.email);

        if (user && user.length > 0) {
            handleMessage({
                message: userAlreadyRegisteredMessage,
                type: 'error',
            });
            return;
        }

        if (emailError) {
            handleMessage({
                message: emailError.message,
                type: 'error',
            });
            return;
        }

        const { error, data } = (await supabase.auth.signUp(
            payload,
        )) as AuthResponse;

        if (!data || !data.user) {
            handleMessage({
                message: error?.message ?? t('messages.sign_up_error'),
                type: 'error',
            });

            return null;
        }

        // Get access_level from the user
        const access_level = data.user?.user_metadata.access_level[0];

        if (access_level === ROLE_ENUM.Productor) {
            // Notificar a administrador que se ha registrado un nuevo productor y está esperando aprobación
            const newProducerMessage = `El productor ${data.user?.user_metadata.username} se ha registrado y está esperando aprobación`;
            const producerLink = `${ROUTE_ADMIN}${ROUTE_PROFILE}${ROUTE_AUTHORIZED_USERS}`;

            await sendNewProducerEmail(payload.email as string);

            await sendPushNotification(
                process.env.NEXT_PUBLIC_ADMIN_ID as string,
                newProducerMessage,
                producerLink,
            );

            return data;
        } else if (access_level === ROLE_ENUM.Distributor) {
            // Notificar a administrador que se ha registrado un nuevo distribuidor y está esperando aprobación
            const newDistributorMessage = `El distribuidor ${data.user?.user_metadata.username} se ha registrado y está esperando aprobación`;
            const distributorLink = `${ROUTE_ADMIN}${ROUTE_PROFILE}${ROUTE_AUTHORIZED_USERS}`;

            await sendNewDistributorEmail(payload.email as string);

            await sendPushNotification(
                process.env.NEXT_PUBLIC_ADMIN_ID as string,
                newDistributorMessage,
                distributorLink,
            );

            return data;
        } else if (access_level === ROLE_ENUM.Consumption_point) {
            // Notificar a administrador que se ha registrado un nuevo punto de consumo y está esperando aprobación
            const newConsumptionPointMessage = `El punto de consumo ${data.user?.user_metadata.username} se ha registrado y está esperando aprobación`;
            const consumptionPointLink = `${ROUTE_ADMIN}${ROUTE_PROFILE}${ROUTE_AUTHORIZED_USERS}`;

            // TODO -> Crear funcion sendNewConsumptionPointEmail
            await sendNewDistributorEmail(payload.email as string);

            await sendPushNotification(
                process.env.NEXT_PUBLIC_ADMIN_ID as string,
                newConsumptionPointMessage,
                consumptionPointLink,
            );

            return data;
        }

        if (error) {
            handleMessage({ message: error.message, type: 'error' });
            return error;
        }

        clearMessages();
        handleMessage({
            message: signUpMessage,
            type: 'success',
        });

        return data;
    };

    const signIn = async (email: string, password: string) => {
        const signInMessage = t('messages.sign_in_success');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            if (error.message === 'Invalid login credentials') {
                handleMessage({
                    message: 'errors.invalid_credentials',
                    type: 'error',
                });
            } else {
                handleMessage({ message: error.message, type: 'error' });
            }

            return error;
        }

        handleMessage({
            type: 'success',
            message: signInMessage,
        });

        // router.push(`/${locale}`);
    };

    const signInWithProvider = async (provider: Provider) => {
        try {
            ('use server');

            // Si acceden con Google, por defecto son consumidores
            // Google does not send out a refresh token by default, so you will need to pass
            // parameters like these to signInWithOAuth() in order to extract the provider_refresh_token:
            await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/api/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });
        } catch (error) {
            console.error(error);
        }

        // user = res.user;
        // if (user?.user_metadata && user.user_metadata?.access_level) {
        //   isAccessLevel = user.user_metadata?.access_level ? true : false;
        // } else {
        //   isAccessLevel = false;
        // }
        // });

        // router.push(`/${locale}`);

        // // Check if access level is null or invalid
        // if (!isAccessLevel && user) {
        //   // Send user role producer to the server
        //   await supabase.rpc("set_claim", {
        //     // uid: user.id,
        //     uid: "",
        //     claim: "access_level",
        //     value: ROLE_ENUM.Cervezano,
        //   });
        // }
    };

    const signOut = async () => {
        window.localStorage.removeItem('active_role');
        await supabase.auth.signOut();
    };

    const sendResetPasswordEmail = async (email: string) => {
        const resetEmailMessage = t('messages.reset_password_email_sent');

        console.log(window.location.origin + '/reset-password');

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            console.error('Error resetting password:', error.message);

            handleMessage({ message: error.message, type: 'error' });
            return false;
        }

        handleMessage({
            message: resetEmailMessage,
            type: 'success',
        });

        return true;
    };

    const updatePassword = async (password: string) => {
        const upd_password_success = t('messages.upd_password_success');

        const { data: resetData, error } = await supabase.auth.updateUser({
            password,
        });

        // TODO: Error al restablecer contraseña: "Auth Session Missing"
        if (resetData.user) {
            handleMessage({
                message: upd_password_success,
                type: 'success',
            });

            // setTimeout(() => {
            //   router.push("/signin");
            // }, 2000);
        }

        if (error) {
            console.error(error);
            handleMessage({ message: error.message, type: 'error' });
        }
    };

    const changeRole = (role: ROLE_ENUM) => {
        setRole(role);

        window.localStorage.setItem('active_role', role);

        setIsAuthLoading(true);

        setTimeout(() => {
            setIsAuthLoading(false);
        }, 2000);
    };

    const getActiveRole = () => {
        const localStorageRole = window.localStorage.getItem('active_role');

        if (localStorageRole) {
            return localStorageRole;
        }

        return null;
    };

    const value = useMemo(() => {
        return {
            initial,
            user,
            role,
            roles,
            isLoading,
            isAuthLoading,
            setIsAuthLoading,
            mutate,
            signUp,
            signIn,
            signInWithProvider,
            signOut,
            supabase,
            provider,
            isLoggedIn: !!user,
            sendResetPasswordEmail,
            updatePassword,
            changeRole,
            getActiveRole,
        };
    }, [
        initial,
        user,
        role,
        roles,
        isLoading,
        isAuthLoading,
        setIsAuthLoading,
        mutate,
        signUp,
        signIn,
        signInWithProvider,
        signOut,
        supabase,
        provider,
        sendResetPasswordEmail,
        updatePassword,
        changeRole,
        getActiveRole,
    ]);

    return (
        <AuthContext.Provider value={value}> {children}</AuthContext.Provider>
    );
};
