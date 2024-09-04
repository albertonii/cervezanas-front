'use client';

import Image from 'next/image';
import DisplayImageProfile from '@/app/[locale]/components/common/DisplayImageProfile';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../(auth)/Context/useAuth';
import {
    faUpload,
    faUser,
    faShoppingCart,
    faBell,
    faStar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { COMMON, SupabaseProps } from '@/constants';
import { useAppContext } from '@/app/context/AppContext';
import { Sidebar } from '@/app/[locale]/components/common/Sidebar';
import { formatDateTypeDefaultInput } from '@/utils/formatDate';

type LayoutProps = {
    children: React.ReactNode;
};

const profilePhotoUrl = `${SupabaseProps.PROFILE_PHOTO_URL}`;

export default async function layout({ children }: LayoutProps) {
    const { user, supabase } = useAuth();
    const { profileImg, setProfileImg } = useAppContext();
    const [profileImg_, setProfileImg_] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);

    const sidebarLinks = [
        {
            name: 'profile',
            icon: faUser,
            option: 'settings',
        },
        {
            name: 'event_orders',
            icon: faShoppingCart,
            option: 'event_orders',
        },
        {
            name: 'online_orders',
            icon: faShoppingCart,
            option: 'online_orders',
        },
        {
            name: 'reviews',
            icon: faStar,
            option: 'reviews',
        },
        {
            name: 'notifications.label',
            icon: faBell,
            option: 'notifications',
        },
    ];

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const updateProfile = async (file: File) => {
            const encodeUriProfileImg = encodeURIComponent(
                `${profilePhotoUrl}${user?.id}/img`,
            );
            const decodeUriProfileImg = decodeURIComponent(
                `${profilePhotoUrl}${user?.id}/img`,
            );

            const { error: errorDelete } = await supabase.storage
                .from('avatars')
                .remove([encodeUriProfileImg]);

            if (errorDelete) {
                console.error('errorDelete', errorDelete);
                return;
            }

            const { error } = await supabase.storage
                .from('avatars')
                .upload(encodeUriProfileImg, file, {
                    cacheControl: '3600',
                    upsert: true,
                });

            if (error) {
                console.error('error', error);
                return;
            }

            const { error: errorProfileImg } = await supabase
                .from('users')
                .update({
                    avatar_url: decodeUriProfileImg,
                    updated_at: formatDateTypeDefaultInput(new Date()),
                })
                .eq('id', user?.id);

            if (errorProfileImg) {
                console.error('errorProfileImg update', errorProfileImg);
                return;
            }

            setProfileImg(SupabaseProps.BASE_AVATARS_URL + decodeUriProfileImg);
        };

        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) {
            return;
        }

        updateProfile(fileObj);
        event.target.files = null;
    };

    useEffect(() => {
        setProfileImg_(profileImg ?? COMMON.PROFILE_IMG);
    }, [profileImg]);

    return (
        <section className="relative flex w-full bg-[url('/assets/home/bg-home.webp')] bg-auto bg-repeat bg-top max-w-[1530px] m-auto">
            <Sidebar sidebarLinks={sidebarLinks} />

            <section className="h-full w-full">
                {profileImg_ && (
                    <>
                        {/* Background Image */}
                        <section
                            className="relative h-full w-full bg-bear-alvine border-b-8 border-cerv-coal shadow-lg"
                            aria-label="Custom Header"
                        >
                            <Image
                                className="max-h-[20vh] w-full object-cover md:max-h-[25vh]"
                                width={1260}
                                height={240}
                                src={'/assets/consumer_layout_bg.jpg'}
                                alt={'background custom image'}
                            />

                            {/* Profile Image */}
                            <section
                                className="absolute bottom-28 w-48 space-x-2 pl-10 sm:w-64 sm:pl-24"
                                aria-label="Logo"
                            >
                                <figure
                                    className="relative"
                                    onClick={() => handleClick()}
                                >
                                    <DisplayImageProfile
                                        imgSrc={profileImg_}
                                        class={
                                            'absolute h-24 w-24 rounded-full sm:h-36 sm:w-36'
                                        }
                                    />

                                    {/* Gamification experiencie  */}
                                    <div className="absolute -left-2 flex h-10 w-10 items-center justify-center rounded-full bg-beer-dark sm:-left-4 sm:-top-4 sm:h-14 sm:w-14 border-2">
                                        <div className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-beer-blonde sm:h-10 sm:w-10">
                                            <p className="text-md font-semibold text-white">
                                                1
                                            </p>
                                        </div>
                                    </div>

                                    <div className="group absolute flex h-24 w-24 cursor-pointer items-center justify-center rounded-full opacity-60 transition duration-500 hover:bg-gray-200 sm:h-36 sm:w-36">
                                        <FontAwesomeIcon
                                            icon={faUpload}
                                            style={{ color: 'beer-dark' }}
                                            // onMouseEnter={() => setHoverColor("filled")}
                                            // onMouseLeave={() => setHoverColor("unfilled")}
                                            title={'profile'}
                                            width={60}
                                            height={60}
                                        />
                                        <input
                                            style={{ display: 'none' }}
                                            ref={inputRef}
                                            type="file"
                                            accept="image/gif, image/jpeg, image/png, image/webp"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </figure>
                            </section>

                            {/* Username and experience level */}
                            <section className="absolute bottom-4 right-10 flex flex-col items-center justify-center gap-4 rounded-xl bg-beer-draft bg-opacity-90 sm:-bottom-4 sm:left-[50%] sm:right-[50%] sm:w-[10rem] sm:-translate-x-[5rem] sm:p-4 border-2 p-4 border-beer-softFoam shadow-lg">
                                <p className="text-md font-semibold text-white p2">
                                    {user?.username}
                                </p>
                                <p className="font-semibold text-white text-2xl">
                                    {user?.gamification?.score} XP
                                </p>
                            </section>
                        </section>

                        <div
                            className="w-full bg-cerv-coffee bg-[url('/assets/madera-account.webp')] bg-auto bg-top bg-repeat sm:pt-[5vh] md:overflow-hidden md:pt-[5vh] lg:col-span-4 rounded-b-2xl"
                            aria-label="Container Consumer settings"
                        >
                            {children}
                        </div>
                    </>
                )}
            </section>
        </section>
    );
}
