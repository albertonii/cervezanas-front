import React, { createContext, useState } from "react";
import { useContext } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

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
  const [bgImg, setBgImg] = useState(`/icons/bg-240.png`);
  const [profileImg, setProfileImg] = useState(`/icons/profile-240.png`);
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
