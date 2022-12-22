import React, { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { SupabaseProps } from "../../constants";
import { supabase } from "../../utils/supabaseClient";
import { useUser } from "../Auth/UserContext";

interface IProfile {
  bgImg?: string;
  setBgImg: (newBgImg: string) => void;
  profileImg?: string;
  setProfileImg: (newBgImg: string) => void;
}

const ProfileContext = createContext<IProfile>({
  bgImg: "",
  setBgImg: () => {},
  profileImg: "",
  setProfileImg: () => {},
});

interface Props {
  [propName: string]: any;
}

export default function ProfileContexProvider(props: Props) {
  const [bgImg, setBgImg] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const { user } = useUser();

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
        const decodeUriProfileImg = `${SupabaseProps.CUSTOM_BG_URL}${user?.id}/img`;

        const { data: bgImgData, error: bgError } = await supabase.storage
          .from("avatars")
          .getPublicUrl(decodeUriCustomImg);

        if (bgError) throw bgError;
        setBgImg(bgImgData?.publicURL!);

        const { data: profileImgData, error: profileError } =
          await supabase.storage
            .from("avatars")
            .getPublicUrl(decodeUriProfileImg);

        if (profileError) throw profileError;
        setProfileImg(profileImgData?.publicURL!);
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
