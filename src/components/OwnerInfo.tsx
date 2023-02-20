import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";
import { User } from "../lib/interfaces";

interface Props {
  user: User;
}

export default function OwnerInfo({ user }: Props) {
  const { t } = useTranslation();
  return (
    <>
      {user && (
        <div className="flex items-center mb-4 space-x-4">
          <Image
            className="w-10 h-10 rounded-full"
            src="/marketplace_product_default.png"
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
