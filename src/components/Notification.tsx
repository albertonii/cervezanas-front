import Image from "next/image";
import useOnClickOutside from "../hooks/useOnOutsideClickDOM";
import React, { useRef } from "react";
import { useRouter } from "next/router";
import { INotification } from "../lib/types";
import { supabase } from "../utils/supabaseClient";
import { useAppContext } from "./Context";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Notification({ open, setOpen }: Props) {
  const notificationRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { notifications } = useAppContext();
  if (!open) return null;

  useOnClickOutside(notificationRef, () => handleClickOutsideCallback());

  const handleOnClick = (notification: INotification) => {
    {
      // Cambiar estado de la notificación ha es leído si se presiona en ella
      supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notification.id)
        .then(() => {
          router.push(notification.link);
        });
    }
  };

  const handleClickOutsideCallback = () => {
    setOpen(false);
  };

  if (!notifications) return <></>;

  return (
    <div ref={notificationRef}>
      {notifications?.length === 0 && (
        <div
          className="absolute -left-[14rem] top-10 z-50 h-auto max-h-[35vh] w-[40vw] overflow-y-scroll 
        rounded-md border-2 border-beer-gold bg-beer-softFoam p-4 lg:-left-40 lg:w-[25vw]"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between rounded-lg bg-white/30 py-6 px-4">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm">No tienes notificaciones</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {notifications.length > 0 && (
        <div
          className="absolute top-10 -left-[14rem] z-50 h-auto max-h-[35vh] w-[40vw] overflow-y-scroll rounded-md border-2
         border-beer-gold bg-beer-softFoam p-4 lg:-left-40 lg:w-[25vw]"
        >
          <div className="flex flex-col space-y-4">
            {notifications?.map((notification) => (
              <div
                className="flex justify-between rounded-lg bg-white/30 py-6 px-4 hover:cursor-pointer hover:bg-beer-softBlondeBubble"
                onClick={() => handleOnClick(notification)}
                key={notification.id}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm">{notification.message}</span>
                  </div>
                </div>

                <div className="flex flex-col ">
                  <span className="flex items-center justify-center font-bold">
                    <Image
                      width={36}
                      height={36}
                      src={"/icons/watch-icon.png"}
                      alt="read notification"
                      className="rounded-sm"
                    />
                  </span>

                  <div className="text-stone-600 flex-none px-4 py-2 text-xs md:text-sm">
                    17m ago
                  </div>
                </div>

                {/* <div className="flex items-center space-x-4">
                <Image
                  width={100}
                  height={100}
                  alt={""}
                  src="/assets/hero.png"
                  className="rounded-full h-14 w-14"
                />
                <div className="flex flex-col space-y-1">
                  <span className="font-bold">{notification.source.name}</span>
                  <span className="text-sm">
                    Yeah same question here too 🔥
                  </span>
                </div>
              </div>
              <div className="flex-none px-4 py-2 text-stone-600 text-xs md:text-sm">
                17m ago
              </div> */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
