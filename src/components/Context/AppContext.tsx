import React, { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { SupabaseProps } from "../../constants";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { supabase } from "../../utils/supabaseClient";

interface IProfile {
  bgImg?: string;
  setBgImg: (newBgImg: string) => void;
  profileImg?: string;
  setProfileImg: (newBgImg: string) => void;
  sidebar: string;
  changeSidebarActive: (select: string) => void;
}

const AppContext = createContext<IProfile>({
  bgImg: "",
  setBgImg: () => {},
  profileImg: "",
  setProfileImg: () => {},
  sidebar: "",
  changeSidebarActive: () => {},
});

interface Props {
  [propName: string]: any;
}

export function AppContextProvider(props: Props) {
  const customUrl = `${SupabaseProps.CUSTOM_BG_URL}`;
  const profilePhotoUrl = `${SupabaseProps.PROFILE_PHOTO_URL}`;
  const fullCustomUrl = `${SupabaseProps.BASE_AVATARS_URL}${customUrl}`;
  const fullProfilePhotoUrl = `${SupabaseProps.BASE_AVATARS_URL}${profilePhotoUrl}`;

  const decodeUriProfileImg = decodeURIComponent(
    `${fullProfilePhotoUrl}${supabase.auth.user()?.id}`
  );

  const decodeUriCustomImg = decodeURIComponent(
    `${fullCustomUrl}${supabase.auth.user()?.id}`
  );

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

  const changeSidebarActive = (select: string) => {
    setSidebar(select);
  };

  const value = {
    bgImg,
    setBgImg,
    profileImg,
    setProfileImg,
    sidebar,
    changeSidebarActive,
  };

  return <AppContext.Provider value={value} {...props} />;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a AppContextProvider.");
  }

  return context;
};
