'use client';

import React, { createContext, useEffect, useState } from 'react';
import { useContext } from 'react';
import { useAuth } from '../[locale]/(auth)/Context/useAuth';
import { SupabaseProps } from '../../constants';
import { getPublicFileUrl } from '../../utils/utils';

interface IProfile {
  bgImg?: string;
  setBgImg: (newBgImg: string) => void;
  profileImg?: string;
  setProfileImg: (newBgImg: string) => void;
}

const ProfileContext = createContext<IProfile>({
  bgImg: '',
  profileImg: '',
  setBgImg: () => void {},
  setProfileImg: () => void {},
});

interface Props {
  [propName: string]: any;
}

export default function ProfileContexProvider(props: Props) {
  const [bgImg, setBgImg] = useState('');
  const [profileImg, setProfileImg] = useState('');
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

        const bgImgDataUrl = await getPublicFileUrl(
          supabase,
          'avatars',
          decodeUriCustomImg,
        );

        const profileImgDataUrl = await getPublicFileUrl(
          supabase,
          'avatars',
          decodeUriProfileImg,
        );

        setBgImg(bgImgDataUrl);
        setProfileImg(profileImgDataUrl);
      };

      getProfileImg();
    }
  }, [user]);

  return <ProfileContext.Provider value={value} {...props} />;
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileContextProvider.');
  }

  return context;
};
