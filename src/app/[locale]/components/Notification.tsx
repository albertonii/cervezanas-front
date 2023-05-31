"use client";

import Image from "next/image";
import useOnClickOutside from "../../../hooks/useOnOutsideClickDOM";
import React, { ComponentProps, useRef } from "react";
import { useRouter } from "next/navigation";
import { INotification } from "../../../lib/types.d";
import { useAppContext } from "../../../components/Context";
import { useLocale, useTranslations } from "next-intl";
import { getTimeElapsed } from "../../../utils";
import { useSupabase } from "../../../components/Context/SupabaseProvider";

interface Props {
  open: boolean;
  setOpen: ComponentProps<any>;
}

export function Notification({ open, setOpen }: Props) {
  const { supabase } = useSupabase();

  const t = useTranslations();
  const locale = useLocale();
  const notificationRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(notificationRef, () => handleClickOutsideCallback());

  const router = useRouter();
  const { notifications } = useAppContext();
  if (!open) return null;

  const handleOnClick = (notification: INotification) => {
    supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notification?.id)
      .then(() => {
        router.push(`/${locale}${notification.link}`);
      });
  };

  const handleClickOutsideCallback = () => {
    setOpen(false);
  };

  if (!notifications) return <></>;

  return (
    <div ref={notificationRef}>
      <div className="absolute -right-10 top-10 z-50 flex items-center justify-center">
        <div className="w-80 overflow-hidden rounded-lg bg-white shadow-lg lg:w-[35vw]">
          <div className="bg-beer-softFoam p-4">
            <h3 className="text-2xl font-bold">{t("notifications")}</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {notifications.length === 0 ? (
              <div className="p-4 text-gray-500">{t("no_notifications")}</div>
            ) : (
              notifications.map((notification) => (
                <div
                  className="cursor-pointer px-4 py-2 hover:bg-beer-softBlondeBubble"
                  onClick={() => handleOnClick(notification)}
                  key={notification.id}
                >
                  <div className="flex items-center justify-between  space-x-4">
                    <div className="flex items-center space-x-4">
                      <Image
                        width={36}
                        height={36}
                        src={"/icons/watch-icon.png"}
                        alt="read notification"
                        className="rounded-full"
                      />
                      <span className="text-lg font-medium">
                        {notification.message}
                      </span>
                    </div>

                    <span className="text-sm text-gray-500">
                      {getTimeElapsed(notification.created_at)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
