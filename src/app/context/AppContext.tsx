'use client';

import React, { createContext, useEffect, useState } from 'react';
import { useContext } from 'react';
import { SupabaseProps } from '@/constants';
import { useAuth } from '../[locale]/(auth)/Context/useAuth';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
    ICustomizeSettings,
    IProduct,
    IRefProductLot,
} from '@/lib/types/types';

// Definir el tipo de datos para el objeto de imágenes
type ImageDataRecord = {
    [key: string]: File; // O el tipo adecuado para la información de la imagen
};

export interface FilterProps {
    category: string[];
    family: string[];
    ibu: number[];
    abv: number[];
    color: string[];
    price: number[];
    volume_can: string[];
    volume_bottle: string[];
    volume_keg: string[];
    region: string[];
    isPack: boolean;
    isAwardWinning: boolean;
    isOrganic: boolean;
    isNonAlcoholic: boolean;
    isGlutenFree: boolean;
}

type AppContextType = {
    filters: FilterProps;
    handleFilters: (newFilters: FilterProps) => void;
    clearFilters: () => void;
    bgImg?: string;
    setBgImg: (newBgImg: string) => void;
    profileImg?: string;
    setProfileImg: (newBgImg: string) => void;
    sidebar: string;
    changeSidebarActive: (select: string) => void;
    products: IProduct[];
    setProducts: (newProducts: IProduct[]) => void;
    lots: IRefProductLot[];
    setLots: (newLots: IRefProductLot[]) => void;
    customizeSettings: ICustomizeSettings;
    setCustomizeSettings: (newCustomizeSettings: ICustomizeSettings) => void;
    imageData: ImageDataRecord;
    addImage: (key: string, image: File) => void;
    removeImage: (key: string) => void;
};

const AppContext = createContext<AppContextType>({
    filters: {
        category: [],
        family: [],
        ibu: [0, 100],
        abv: [0, 20],
        color: [],
        price: [0, 500],
        volume_can: [],
        volume_bottle: [],
        volume_keg: [],
        region: [],
        isPack: false,
        isAwardWinning: false,
        isOrganic: false,
        isNonAlcoholic: false,
        isGlutenFree: false,
    },
    clearFilters: () => {},
    handleFilters: () => void {},
    bgImg: '',
    setBgImg: () => void {},
    profileImg: '',
    setProfileImg: () => void {},
    sidebar: '',
    changeSidebarActive: () => void {},
    products: [],
    setProducts: () => void {},
    lots: [],
    setLots: () => void {},
    customizeSettings: {
        id: '',
        created_at: '',
        colors: [],
        family_styles: [],
        owner_id: '',
    },
    setCustomizeSettings: () => void {},
    imageData: {},
    addImage: (key: string, image: File) => void {},
    removeImage: (key: string) => void {},
});

interface Props {
    children: React.ReactNode;
    [propName: string]: any;
}

export function AppContextProvider(props: Props) {
    const { user, provider } = useAuth();

    const [filters, setFilters] = useState<FilterProps>({
        category: [],
        family: [],
        ibu: [0, 100],
        abv: [0, 20],
        color: [],
        price: [0, 500],
        volume_bottle: [],
        volume_can: [],
        volume_keg: [],
        region: [],
        isPack: false,
        isAwardWinning: false,
        isOrganic: false,
        isNonAlcoholic: false,
        isGlutenFree: false,
    });

    const [customizeSettings, setCustomizeSettings] =
        useState<ICustomizeSettings>({
            id: '',
            created_at: '',
            colors: [],
            family_styles: [],
            owner_id: '',
        });

    const [products, setProducts] = useState<IProduct[]>([]);
    const [lots, setLots] = useState<IRefProductLot[]>([]);
    const [imageData, setImageData] = useState<ImageDataRecord>({});

    const customUrl = `${SupabaseProps.CUSTOM_BG_URL}`;
    const profilePhotoUrl = `${SupabaseProps.PROFILE_PHOTO_URL}`;
    const fullCustomUrl = `${SupabaseProps.BASE_AVATARS_URL}${customUrl}`;
    // const fullProfilePhotoUrl = `${SupabaseProps.BASE_AVATARS_URL}${profilePhotoUrl}`;

    const [bgImg, setBgImg] = useState('');
    const [profileImg, setProfileImg] = useState('');
    const [sidebar, setSidebar] = useLocalStorage<string>(
        'sidebar-option',
        'settings',
    );

    useEffect(() => {
        if (!user?.avatar_url) {
            setProfileImg(profilePhotoUrl);
        } else {
            // const decodeUriProfileImg = provider
            //   ? user.avatar_url
            //   : decodeURIComponent(`${fullProfilePhotoUrl}${user?.id}/img`);
            // setProfileImg(decodeUriProfileImg);

            setProfileImg(user?.avatar_url);
        }

        if (!user?.bg_url) {
            setBgImg(customUrl);
        } else {
            const decodeUriCustomImg = provider
                ? user.bg_url
                : decodeURIComponent(`${fullCustomUrl}${user?.id}`);

            setBgImg(decodeUriCustomImg);
        }
    }, [user]);

    const addImage = (key: string, image: File) => {
        setImageData({ ...imageData, [key]: image });
    };

    const removeImage = (key: string) => {
        const { [key]: _, ...rest } = imageData;
        setImageData(rest);
    };

    const changeSidebarActive = (select: string) => {
        setSidebar(select);
    };

    const handleFilters = (newFilters: FilterProps) => {
        setFilters((prevFilters: FilterProps) => {
            return { ...prevFilters, ...newFilters };
        });
    };

    const clearFilters = () => {
        setFilters({
            category: [],
            family: [],
            ibu: [0, 100],
            abv: [0, 20],
            color: [],
            price: [0, 500],
            volume_can: [],
            volume_bottle: [],
            volume_keg: [],
            region: [],
            isPack: false,
            isAwardWinning: false,
            isOrganic: false,
            isNonAlcoholic: false,
            isGlutenFree: false,
        });
    };

    const value = {
        filters,
        handleFilters,
        clearFilters,
        bgImg,
        setBgImg,
        profileImg,
        setProfileImg,
        sidebar,
        changeSidebarActive,
        products,
        setProducts,
        lots,
        setLots,
        customizeSettings,
        setCustomizeSettings,
        imageData,
        addImage,
        removeImage,
    };

    return (
        <AppContext.Provider value={value} {...props}>
            {props.children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error(
            'useAppContext must be used within a AppContextProvider.',
        );
    }

    return context;
};
