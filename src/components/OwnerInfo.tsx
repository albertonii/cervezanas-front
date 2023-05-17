"use client";

import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";
import { COMMON } from "../constants";
import { IUser } from "../lib/types.d";

interface Props {
  user?: IUser;
}

export function OwnerInfo({ user }: Props) {
  const { t } = useTranslation();
  return (
    <>
      {user && (
        <div className="mb-4 flex items-center space-x-4">
          <Image
            className="h-10 w-10 rounded-full"
            src={`/${COMMON.MARKETPLACE_PRODUCT}`}
            alt=""
            width={40}
            height={40}
          />
          <div className="space-y-1 font-medium dark:text-white">
            <p>
              {user.username}
              <time
                dateTime="2014-08-16 19:00"
                className="block text-sm text-gray-500 dark:text-gray-400"
              >
                {t("joined_on")} {user.created_at}
              </time>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
