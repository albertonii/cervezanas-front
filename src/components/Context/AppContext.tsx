"use client";

import useFetchNotifications from "../../hooks/useFetchNotifications";
import React, { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { SupabaseProps } from "../../constants";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
  ICustomizeSettings,
  INotification,
  IProduct,
  IRefProductLot,
} from "../../lib/types.d";
import { useAuth } from "../Auth";

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
  notifications?: INotification[];
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
  notifications: [],
  openNotification: false,
  setOpenNotification: () => void {},
  products: [],
  setProducts: () => void {},
  lots: [],
  setLots: () => void {},
  customizeSettings: {
    id: "",
    created_at: new Date(),
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
  const customUrl = `${SupabaseProps.CUSTOM_BG_URL}`;
  const profilePhotoUrl = `${SupabaseProps.PROFILE_PHOTO_URL}`;
  const fullCustomUrl = `${SupabaseProps.BASE_AVATARS_URL}${customUrl}`;
  const fullProfilePhotoUrl = `${SupabaseProps.BASE_AVATARS_URL}${profilePhotoUrl}`;

  const [filters, setFilters] = useState({
    category: "all",
    minPrice: 0,
  });

  const [products, setProducts] = useState<IProduct[]>([]);
  const [lots, setLots] = useState<IRefProductLot[]>([]);
  const [customizeSettings, setCustomizeSettings] =
    useState<ICustomizeSettings>({
      id: "",
      created_at: new Date(),
      colors: [],
      family_styles: [],
    });

  const [imageData, setImageData] = useState<ImageDataRecord>({});

  const addImage = (key: string, image: File) => {
    setImageData({ ...imageData, [key]: image });
  };

  const removeImage = (key: string) => {
    const { [key]: _, ...rest } = imageData;
    setImageData(rest);
  };

  const { user } = useAuth();

  const { refetch } = useFetchNotifications(user?.id ?? "");

  const [openNotification, setOpenNotification] = useState(false);

  const decodeUriProfileImg = decodeURIComponent(
    `${fullProfilePhotoUrl}${user?.id}`
  );

  const decodeUriCustomImg = decodeURIComponent(`${fullCustomUrl}${user?.id}`);

  const [bgImg, setBgImg] = useState(
    decodeUriCustomImg ?? `/icons/profile-240.png`
  );
  const [profileImg, setProfileImg] = useState(
    decodeUriProfileImg ?? `/icons/profile-240.png`
  );
  const [sidebar, setSidebar] = useLocalStorage<string>(
    "sidebar-option",
    "settings"
  );

  const [notifications, setNotifications] = useState<INotification[]>([]);

  const changeSidebarActive = (select: string) => {
    setSidebar(select);
  };

  useEffect(() => {
    if (!user?.id) return;
    refetch().then(() => {
      // TODO: VOLVER AQUI!
      // const notifications: INotification[] = res.data;
      // setNotifications(notifications);
    });
  }, []);

  const value = {
    filters,
    setFilters,
    bgImg,
    setBgImg,
    profileImg,
    setProfileImg,
    sidebar,
    changeSidebarActive,
    notifications,
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
