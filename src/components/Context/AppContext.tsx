import useFetchNotifications from "../../hooks/useFetchNotifications";
import React, { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { SupabaseProps } from "../../constants";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { INotification } from "../../lib/types.d";
import { useAuth } from "../Auth";

type AppContextType = {
  bgImg?: string;
  setBgImg: (newBgImg: string) => void;
  profileImg?: string;
  setProfileImg: (newBgImg: string) => void;
  sidebar: string;
  changeSidebarActive: (select: string) => void;
  notifications?: INotification[];
  openNotification: boolean;
  setOpenNotification: (open: boolean) => void;
};

const AppContext = createContext<AppContextType>({
  bgImg: "",
  setBgImg: () => void {},
  profileImg: "",
  setProfileImg: () => void {},
  sidebar: "",
  changeSidebarActive: () => void {},
  notifications: [],
  openNotification: false,
  setOpenNotification: () => void {},
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
    "profile"
  );

  const [notifications, setNotifications] = useState<INotification[]>([]);

  const changeSidebarActive = (select: string) => {
    setSidebar(select);
  };

  useEffect(() => {
    if (!user?.id) return;
    refetch().then((res) => {
      setNotifications(res.data as INotification[]);
    });
  }, []);

  const value = {
    bgImg,
    setBgImg,
    profileImg,
    setProfileImg,
    sidebar,
    changeSidebarActive,
    notifications,
    openNotification,
    setOpenNotification,
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
