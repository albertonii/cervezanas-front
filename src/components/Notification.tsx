import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { INotification } from "../lib/types";
import { supabase } from "../utils/supabaseClient";
import { useAppContext } from "./Context";

interface Props {
  open: boolean;
}

export function Notification({ open }: Props) {
  const router = useRouter();
  const { notifications } = useAppContext();
  if (!open) return null;

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

  return (
    <>
      <div className="absolute top-10 -left-[14rem] lg:-left-40 w-[40vw] lg:w-[25vw] h-auto max-h-[35vh] overflow-y-scroll rounded-md border-2 border-beer-gold bg-beer-softFoam p-4 z-50">
        {notifications?.length === 0 && (
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between py-6 px-4 bg-white/30 rounded-lg hover:bg-beer-softBlondeBubble hover:cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm">No tienes notificaciones</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {notifications?.length === 0 && (
          <div className="flex flex-col space-y-4">
            {notifications?.map((notification) => (
              <div
                className="flex justify-between py-6 px-4 bg-white/30 rounded-lg hover:bg-beer-softBlondeBubble hover:cursor-pointer"
                onClick={() => handleOnClick(notification)}
                key={notification.id}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm">{notification.message}</span>
                  </div>
                </div>

                <div className="flex flex-col ">
                  <span className="font-bold flex items-center justify-center">
                    <Image
                      width={36}
                      height={36}
                      src={"/icons/watch-icon.png"}
                      alt="read notification"
                      className="rounded-sm"
                    />
                  </span>

                  <div className="flex-none px-4 py-2 text-stone-600 text-xs md:text-sm">
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
        )}
      </div>
    </>
  );
}
