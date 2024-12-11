'use client';

import Image from 'next/image';
import DisplayImageProfile from './DisplayImageProfile';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { COMMON, SupabaseProps } from '@/constants';
import { useAuth } from '../../(auth)/Context/useAuth';
import { useAppContext } from '@/app/context/AppContext';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { formatDateTypeDefaultInput } from '@/utils/formatDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

const profilePhotoUrl = `${SupabaseProps.PROFILE_PHOTO_URL}`;

interface Props {
    children: React.ReactNode;
    sidebarLinks: { name: string; icon: IconDefinition; option: string }[];
}

const ProfileSidebarLayout = ({ children, sidebarLinks }: Props) => {
    const { user, supabase } = useAuth();
    const { profileImg, setProfileImg } = useAppContext();
    const [profileImg_, setProfileImg_] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);

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
            {sidebarLinks && <Sidebar sidebarLinks={sidebarLinks} />}

            <section className="h-full w-full">
                {/* Background Image */}
                <section
                    className="relative h-full w-full bg-bear-alvine"
                    aria-label="Custom Header"
                >
                    <Image
                        className="max-h-[20vh] w-full object-cover md:max-h-[25vh] border-b-8 border-cerv-titlehigh"
                        width={1260}
                        height={240}
                        src={'/assets/producer_layout_bg.jpg'}
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
                            {profileImg_ && (
                                <DisplayImageProfile
                                    imgSrc={profileImg_}
                                    class={
                                        'absolute h-24 w-24 rounded-full sm:h-36 sm:w-36'
                                    }
                                />
                            )}

                            {/* Gamification experiencie  */}
                            <div className="absolute -left-2 flex h-10 w-10 items-center justify-center rounded-full bg-beer-dark sm:-left-4 sm:-top-4 sm:h-14 sm:w-14">
                                <div className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-beer-blonde sm:h-10 sm:w-10">
                                    <p className="text-md font-semibold text-white">
                                        1
                                    </p>
                                </div>
                            </div>

                            <div className="group absolute flex h-24 w-24 cursor-pointer items-center justify-center rounded-full opacity-60 transition duration-500 hover:bg-gray-200 sm:h-36 sm:w-36">
                                <FontAwesomeIcon
                                    icon={faUpload}
                                    style={{ color: 'bear-dark' }}
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
                    <section className="relative m-auto w-[200px] -bottom-6 rounded-t-full bg-beer-draft bg-opacity-90 p-2 max-h-[100px] -mt-28">
                        <div className="border-beer-blonde border-t-2 border-dashed rounded-t-full justify-center flex flex-col items-center gap-1 p-3 bg-cerv-titlehigh bg-opacity-30">
                            <p className="text-lg font-semibold text-white">
                                {user?.gamification?.score} XP
                            </p>
                            <p className="text-md font-semibold text-white px-5 py-2 bg-beer-dark rounded-lg border-beer-blonde border-b-2">
                                {user?.username}
                            </p>
                        </div>
                    </section>
                </section>

                <div
                    className="w-full bg-[url('/assets/madera-account.webp')] bg-auto bg-top bg-repeat sm:pt-[5vh] md:pt-[5vh] rounded-b-2xl pt-10"
                    aria-label="Container settings"
                >
                    {children}
                </div>
            </section>
        </section>
    );
};

export default ProfileSidebarLayout;
