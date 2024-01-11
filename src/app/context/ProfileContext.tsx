"use client";

import React, { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { useAuth } from "../[locale]/Auth/useAuth";
import { SupabaseProps } from "../../constants";

interface IProfile {
  bgImg?: string;
  setBgImg: (newBgImg: string) => void;
  profileImg?: string;
  setProfileImg: (newBgImg: string) => void;
}

const ProfileContext = createContext<IProfile>({
  bgImg: "",
  profileImg: "",
  setBgImg: () => void {},
  setProfileImg: () => void {},
});

interface Props {
  [propName: string]: any;
}

export default function ProfileContexProvider(props: Props) {
  const [bgImg, setBgImg] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const { user, supabase } = useAuth();

  const value = {
    bgImg,
    setBgImg,
    profileImg,
    setProfileImg,
  };

  useEffect(() => {
    if (user) {
      const getProfileImg = async () => {
        const decodeUriCustomImg = `${SupabaseProps.CUSTOM_BG_URL}${user?.id}/img`;
        const decodeUriProfileImg = `${SupabaseProps.PROFILE_PHOTO_URL}${user?.id}/img`;

        const { data: bgImgData } = await supabase.storage
          .from("avatars")
          .getPublicUrl(decodeUriCustomImg);

        setBgImg(bgImgData?.publicUrl ?? "");

        const { data: profileImgData } = await supabase.storage
          .from("avatars")
          .getPublicUrl(decodeUriProfileImg);

        setProfileImg(profileImgData?.publicUrl ?? "");
      };

      getProfileImg();
    }
  }, [user]);

  return <ProfileContext.Provider value={value} {...props} />;
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileContextProvider.");
  }

  return context;
};
