'use client';

import Image from 'next/image';
import DisplayImageProfile from '@/app/[locale]/components/ui/DisplayImageProfile';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { COMMON, SupabaseProps } from '@/constants';
import { useAppContext } from '@/app/context/AppContext';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { formatDateTypeDefaultInput } from '@/utils/formatDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Sidebar } from '@/app/[locale]/components/layout/Sidebar';
import {
    faUpload,
    faUser,
    faBox,
    faTruck,
    faMapMarkerAlt,
    faStar,
    faShoppingCart,
    faBell,
    faIndustry,
    faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';
import ProfileSidebarLayout from '@/app/[locale]/components/ui/ProfileSidebarLayout';

type LayoutProps = {
    children: React.ReactNode;
};

const profilePhotoUrl = `${SupabaseProps.PROFILE_PHOTO_URL}`;

export default function layout({ children }: LayoutProps) {
    const sidebarLinks = [
        { name: 'profile', icon: faUser, option: 'settings' },
        { name: 'products', icon: faBox, option: 'products' },
        {
            name: 'distributors_associated',
            icon: faTruck,
            option: 'distributors_associated',
        },
        { name: 'events', icon: faMapMarkerAlt, option: 'events' },
        {
            name: 'consumption_points',
            icon: faMapMarkerAlt,
            option: 'consumption_points',
        },
        {
            name: 'breweries',
            icon: faIndustry,
            option: 'breweries',
        },
        {
            name: 'invoice_module.title',
            icon: faMoneyBill,
            option: 'invoice_module',
        },
        { name: 'experiences', icon: faStar, option: 'experiences' },
        { name: 'reviews', icon: faStar, option: 'reviews' },
        {
            name: 'online_orders',
            icon: faShoppingCart,
            option: 'online_orders',
        },
        { name: 'event_orders', icon: faShoppingCart, option: 'event_orders' },
        { name: 'notifications.label', icon: faBell, option: 'notifications' },
    ];

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

    if (!user) return null;

    return (
        <ProfileSidebarLayout sidebarLinks={sidebarLinks}>
            {children}
        </ProfileSidebarLayout>
    );
}
