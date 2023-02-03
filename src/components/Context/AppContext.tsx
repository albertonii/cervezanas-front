import React, { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { SupabaseProps } from "../../constants";
import { supabase } from "../../utils/supabaseClient";
import { useAuth } from "../Auth/useAuth";

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

export default function AppContextProvider(props: Props) {
  const [bgImg, setBgImg] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [sidebar, setSidebar] = useState("profile");

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const getProfileImg = async () => {
        const decodeUriCustomImg = `${SupabaseProps.CUSTOM_BG_URL}${user?.id}/img`;
        const decodeUriProfileImg = `${SupabaseProps.PROFILE_PHOTO_URL}${user?.id}/img`;

        const { data: bgImgData, error: bgError } = supabase.storage
          .from("avatars")
          .getPublicUrl(decodeUriCustomImg);

        if (bgError) {
          throw bgError;
        } else setBgImg(bgImgData?.publicURL!);

        const { data: profileImgData, error: profileError } = supabase.storage
          .from("avatars")
          .getPublicUrl(decodeUriProfileImg);

        if (profileError) throw profileError;
        setProfileImg(profileImgData?.publicURL!);
      };

      getProfileImg();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => {
      setBgImg("");
      setProfileImg("");
    };
  }, [user]);

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
