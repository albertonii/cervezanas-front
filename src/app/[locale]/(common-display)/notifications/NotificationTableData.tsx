"use client";

import React, { useState } from "react";
import { INotification } from "../../../../lib/types";
import { formatDateString } from "../../../../utils/formatDate";
import {
  faChevronCircleDown,
  faEnvelope,
  faEnvelopeOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../Auth/useAuth";

interface Props {
  notification: INotification;
  key: string;
}

export default function NotificationTableData({ notification, key }: Props) {
  if (!notification) return null;
  const [showAccordion, setShowAccordion] = useState(false);
  const { supabase } = useAuth();

  const [notificationState, setNotification] =
    useState<INotification>(notification);

  const updateIsRead = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notification.id)
      .select(
        `
        *,
        source_user:users!notifications_source_fkey (
            username
        )
        `
      )
      .single();
    if (error) throw error;

    if (!data) return;
    setNotification(data as INotification);
  };

  const openMessage = async () => {
    await updateIsRead();
    setShowAccordion(!showAccordion);
  };

  return (
    <>
      <tr
        key={key}
        className="cursor-pointer border-b bg-white dark:border-gray-700 dark:bg-gray-800"
        onClick={() => openMessage()}
      >
        <td className="px-6">
          {notificationState.read ? (
            <span className="inline-flex rounded-full bg-green-100 px-2 py-2 text-xs font-semibold leading-5 text-green-800">
              <FontAwesomeIcon
                icon={faEnvelopeOpen}
                title={""}
                width={40}
                height={40}
                className={`h-4`}
              />
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-red-100 p-2 px-2 text-xs font-semibold leading-5 text-red-800">
              <FontAwesomeIcon
                icon={faEnvelope}
                title={""}
                width={40}
                height={40}
                className={`h-4`}
              />
            </span>
          )}
        </td>

        <td className="px-6 py-4">{notificationState.source_user?.username}</td>

        <td className="px-6 py-4">{notificationState.link}</td>

        <td className="px-6 py-4">
          {formatDateString(notificationState.created_at)}
        </td>

        <td className="item-center flex justify-center px-6 py-4">
          <div
            className={`${
              showAccordion ? "bg-gray-100 text-beer-draft" : "text-beer-gold"
            } flex  justify-between px-6 py-4 text-lg `}
          >
            <div className="flex items-center justify-center space-x-2">
              <FontAwesomeIcon
                icon={faChevronCircleDown}
                style={{ color: showAccordion ? "#90470b" : "#EE9900" }}
                title={"chevron_circle_down"}
                width={20}
                height={20}
                className={`${showAccordion && "rotate-180"}`}
              />
            </div>
          </div>
        </td>
      </tr>

      <tr
        className={`${
          showAccordion
            ? "border-b bg-bear-alvine dark:border-gray-700 dark:bg-gray-800"
            : "hidden"
        }`}
      >
        <td
          colSpan={5}
          className={`duration-800 col-span-2 overflow-hidden px-6 py-4 pt-4 transition-all ease-in-out`}
        >
          <span className="mb-2  text-base text-gray-500 dark:text-gray-400">
            {notificationState.message}
          </span>
        </td>
      </tr>
    </>
  );
}
