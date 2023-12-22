"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import useDeviceDetection from "../../hooks/useDeviceDetection";
import { INotification } from "../../lib/types";
import { useAuth } from "./Auth/useAuth";

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
    <header className="header absolute w-full bg-beer-foam bg-transparent">
      <nav>
        {device === "Mobile"
          ? (() => {
              const DynamicMobileMenu = dynamic(() => import("./MobileMenu"), {
                loading: () => <p>Loading...</p>,
              });
              return <DynamicMobileMenu notifications={notificationState} />;
            })()
          : (() => {
              const DynamicScreenMenu = dynamic(() => import("./ScreenMenu"), {
                loading: () => <p>Loading...</p>,
              });
              return <DynamicScreenMenu notifications={notificationState} />;
            })()}
      </nav>
    </header>
  );
}
