import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { ChangeEvent, useRef } from "react";
import { SupabaseProps } from "../../constants";
import { supabase } from "../../utils/supabaseClient";
import { useAuth } from "../Auth";
import { useAppContext } from "../Context/AppContext";

type Props = {
  children: JSX.Element;
};

const profilePhotoUrl = `${SupabaseProps.PROFILE_PHOTO_URL}`;
// const customUrl = `${SupabaseProps.CUSTOM_BG_URL}`;
// const fullCustomUrl = `${SupabaseProps.BASE_AVATARS_URL}${customUrl}`;
// const fullProfilePhotoUrl = `${SupabaseProps.BASE_AVATARS_URL}${profilePhotoUrl}`;

export function ClientContainerLayout({ children }: Props) {
  const { bgImg, profileImg, setProfileImg } = useAppContext();

  const { user } = useAuth();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    // 👇️ open file input box on click of other element
    inputRef.current!.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const updateProfile = async (file: File) => {
      const encodeUriProfileImg = encodeURIComponent(
        `${profilePhotoUrl}${user?.id}/img`
      );
      const decodeUriProfileImg = decodeURIComponent(
        `${profilePhotoUrl}${user?.id}/img`
      );

      const { error: errorDelete } = await supabase.storage
        .from("avatars")
        .remove([encodeUriProfileImg]);

      if (errorDelete) {
        console.log("errorDelete", errorDelete);
        return;
      }

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(encodeUriProfileImg, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.log("error", error);
        return;
      }
      setProfileImg(SupabaseProps.BASE_AVATARS_URL + decodeUriProfileImg);
    };

    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }

    updateProfile(fileObj);

    // console.log("fileObj is", fileObj);

    // 👇️ reset file input
    event.target.files = null;

    // 👇️ is now empty
    // console.log(event.target.files);

    // 👇️ can still access file object here
    // console.log(fileObj);
    // console.log(fileObj.name);
  };

  return (
    <>
      {bgImg && profileImg ? (
        <div className="container ">
          {/* Background Image */}
          <div className=" bg-bear-alvine " aria-label="Custom Header">
            <Image
              className="max-h-[20vh] md:max-h-[40vh] w-full object-cover"
              width={1260}
              height={240}
              src={bgImg}
              alt={"background custom image"}
            />

            {/* Profile Image */}
            <div className="space-x-2 relative pl-24" aria-label="Logo">
              <div className="bottom-20 absolute">
                <div className="w-64  ">
                  <div className="relative" onClick={() => handleClick()}>
                    <Image
                      className="w-36 h-36 rounded-full absolute"
                      src={profileImg}
                      alt=""
                      width={240}
                      height={240}
                    />
                    <div className="w-36 h-36 group hover:bg-gray-200 opacity-60 rounded-full absolute flex justify-center items-center cursor-pointer transition duration-500">
                      <FontAwesomeIcon
                        icon={faUpload}
                        style={{ color: "bear-dark" }}
                        // onMouseEnter={() => setHoverColor("filled")}
                        // onMouseLeave={() => setHoverColor("unfilled")}
                        title={"profile"}
                        width={60}
                        height={60}
                      />
                      <input
                        style={{ display: "none" }}
                        ref={inputRef}
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div
            className="bg-beer-softFoam h-full pt-[5vh] md:pt-[5vh] sm:"
            aria-label="Container Client Information"
          >
            {children}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
