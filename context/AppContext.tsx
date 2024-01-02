"use client";

import React, { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { SupabaseProps } from "../src/constants";
import { useLocalStorage } from "../src/hooks/useLocalStorage";
import { ICustomizeSettings, IProduct, IRefProductLot } from "../src/lib/types";
import { useAuth } from "../src/app/[locale]/Auth/useAuth";

// Definir el tipo de datos para el objeto de imágenes
type ImageDataRecord = {
  [key: string]: File; // O el tipo adecuado para la información de la imagen
};

type AppContextType = {
  filters: any;
  setFilters: (newFilters: any) => void;
  bgImg?: string;
  setBgImg: (newBgImg: string) => void;
  profileImg?: string;
  setProfileImg: (newBgImg: string) => void;
  sidebar: string;
  changeSidebarActive: (select: string) => void;
  openNotification: boolean;
  setOpenNotification: (open: boolean) => void;
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
  filters: { category: "all", minPrice: 0 },
  setFilters: () => void {},
  bgImg: "",
  setBgImg: () => void {},
  profileImg: "",
  setProfileImg: () => void {},
  sidebar: "",
  changeSidebarActive: () => void {},
  openNotification: false,
  setOpenNotification: () => void {},
  products: [],
  setProducts: () => void {},
  lots: [],
  setLots: () => void {},
  customizeSettings: {
    id: "",
    created_at: "",
    colors: [],
    family_styles: [],
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
  const { user, provider, isLoggedIn } = useAuth();

  const [filters, setFilters] = useState({
    category: "all",
    minPrice: 0,
  });

  const [customizeSettings, setCustomizeSettings] =
    useState<ICustomizeSettings>({
      id: "",
      created_at: "",
      colors: [],
      family_styles: [],
    });

  const [products, setProducts] = useState<IProduct[]>([]);
  const [lots, setLots] = useState<IRefProductLot[]>([]);
  const [imageData, setImageData] = useState<ImageDataRecord>({});
  const [openNotification, setOpenNotification] = useState(false);

  const customUrl = `${SupabaseProps.CUSTOM_BG_URL}`;
  const profilePhotoUrl = `${SupabaseProps.PROFILE_PHOTO_URL}`;
  const fullCustomUrl = `${SupabaseProps.BASE_AVATARS_URL}${customUrl}`;
  const fullProfilePhotoUrl = `${SupabaseProps.BASE_AVATARS_URL}${profilePhotoUrl}`;

  const [bgImg, setBgImg] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [sidebar, setSidebar] = useLocalStorage<string>(
    "sidebar-option",
    "settings"
  );

  useEffect(() => {
    if (!user?.avatar_url) {
      setProfileImg(profilePhotoUrl);
    } else {
      const decodeUriProfileImg = provider
        ? user.avatar_url
        : decodeURIComponent(`${fullProfilePhotoUrl}${user?.id}/img`);

      setProfileImg(decodeUriProfileImg);
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

  if (!isLoggedIn) return <>{props.children}</>;

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

  const value = {
    filters,
    setFilters,
    bgImg,
    setBgImg,
    profileImg,
    setProfileImg,
    sidebar,
    changeSidebarActive,
    openNotification,
    setOpenNotification,
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
    throw new Error("useProfile must be used within a AppContextProvider.");
  }

  return context;
};
