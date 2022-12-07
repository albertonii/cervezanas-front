import { Button } from "@supabase/ui";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function SecretDataForm() {
  const { t } = useTranslation();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  return (
    <div
      id="account_secret_data"
      className="container px-6 py-4  bg-white space-y-3 mb-4"
    >
      <div id="password" className="text-2xl">
        {t("password")}
      </div>

      <div className="flex w-full flex-row space-x-3 ">
        <div className="w-full ">
          <label htmlFor="actual_password" className="text-sm text-gray-600">
            {t("actual_password")}
          </label>
          <input
            type="password"
            id="old_password"
            placeholder="**********"
            required
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="flex w-full flex-row space-x-3 mb-4">
        <div className="w-full ">
          <label htmlFor="newPassword" className="text-sm text-gray-600">
            {t("new_password")}
          </label>
          <input
            type="password"
            id="new_password_1"
            placeholder="**********"
            required
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="w-full space-y">
          <label htmlFor="newPassword2" className="text-sm text-gray-600">
            {t("confirm_password")}
          </label>
          <input
            type="password"
            id="new_password_2"
            placeholder="**********"
            required
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-row items-end">
        <div className="pl-0">
          <Button size="medium"> {t("save")}</Button>
        </div>
      </div>
    </div>
  );
}
