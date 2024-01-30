"use client";

import { useEffect, useState } from "react";
import useDeviceDetection from "../../hooks/useDeviceDetection";
import { INotification } from "../../lib/types";
import { useAuth } from "./Auth/useAuth";
import MobileMenu from "./MobileMenu";
import ScreenMenu from "./ScreenMenu";

interface Props {
  notifications: INotification[];
}

export default function Header({ notifications }: Props) {
  const device = useDeviceDetection();
  const { supabase } = useAuth();

  const [notificationState, setNotificationState] =
    useState<INotification[]>(notifications);

  useEffect(() => {
    supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          setNotificationState((prevState) => [
            ...prevState,
            payload.new as INotification,
          ]);
        }
      )
      .subscribe();
  }, [supabase, notificationState, setNotificationState]);

  return (
    <header className="header relative w-full bg-beer-foam bg-transparent">
      <nav>
        {device === "Mobile" ? (
          <MobileMenu notifications={notificationState} />
        ) : (
          <ScreenMenu notifications={notificationState} />
        )}
      </nav>
    </header>
  );
}
