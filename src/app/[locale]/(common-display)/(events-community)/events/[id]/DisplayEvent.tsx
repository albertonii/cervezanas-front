"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { COMMON } from "../../../../../../constants";
import { ICPMobile, IEvent } from "../../../../../../lib/types.d";
import { formatDateString } from "../../../../../../utils/formatDate";

interface Props {
  event: IEvent;
}

export default function DisplayEvent({ event }: Props) {
  const t = useTranslations();

  const cpMobile: ICPMobile[] = event.cp_mobile;

  return (
    <div className="relative h-full w-full rounded-lg bg-white p-8 shadow-md">
      <div className="absolute right-0 top-0 m-4 rounded-md bg-beer-gold px-4 py-2">
        <span
          className={`text-lg font-medium text-white ${
            event.status === "active" ? "text-green-500" : "text-red-500"
          }`}
        >
          {event.status === "active" ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Display all the information inside the Mobile Consumption Point */}
      <h1 className="mb-2 text-2xl font-bold">{event.name}</h1>
      <h2 className="mb-4 text-lg text-gray-500">{event.description}</h2>

      <div className="mb-4">
        {/* Start and End date */}
        <span className="text-gray-500">
          {t("start_date")}: {formatDateString(event.start_date)}
        </span>
        <span className="ml-4 text-gray-500">
          {t("end_date")}: {formatDateString(event.end_date)}
        </span>
      </div>

      {/* Organizer information */}
      {/* <div className="mb-4">
        <span className="text-gray-500">
          Organizer: {event.organizer_name} {event.organizer_lastname}
        </span>
        <span className="ml-4 text-gray-500">
          Email: {event.organizer_email}
        </span>
        <span className="ml-4 text-gray-500">
          Phone: {event.organizer_phone}
        </span>
      </div> */}

      {/* Products linked to this Mobile Consumption Point */}
      <div className="mt-8">
        {cpMobile.length > 0 ? (
          <div className="overflow-x-auto">
            <h3 className="mb-2 text-xl font-bold">{t("cp_mobile")}</h3>

            <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3 ">
                    {t("logo_header")}
                  </th>

                  <th scope="col" className="px-6 py-3 ">
                    {t("name_header")}
                  </th>

                  <th scope="col" className="hidden px-6 py-3 md:block">
                    {t("description_header")}
                  </th>

                  <th scope="col" className="px-6 py-3 ">
                    {t("address_header")}
                  </th>

                  <th scope="col" className="px-6 py-3 ">
                    {t("date_header")}
                  </th>

                  <th scope="col" className="px-6 py-3 ">
                    {t("status_header")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {cpMobile.map((cp) => (
                  <CPMobile key={cp.id} cp={cp} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            <h3 className="mb-2 text-xl font-bold">{t("cp_mobile")}</h3>
            <p className="text-gray-500">{t("no_cp_mobile")}</p>
          </>
        )}
      </div>
    </div>
  );
}

interface CPMobileProps {
  cp: ICPMobile;
}

const CPMobile = ({ cp }: CPMobileProps) => {
  const locale = useLocale();
  return (
    <tr
      key={cp.id}
      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <td className=" space-x-2 px-6 py-4">
        <Image
          src={cp.logo_url ?? COMMON.PROFILE_IMG}
          alt={cp.cp_name}
          width={64}
          height={64}
        />
      </td>

      <td className=" space-x-2 px-6 py-4 font-semibold hover:cursor-pointer hover:text-beer-draft">
        <Link href={`/consumption_points/mobile/${cp.id}`} locale={locale}>
          {cp.cp_name}
        </Link>
      </td>
      <td className="hidden space-x-2 px-6 py-4 md:block">
        {cp.cp_description}
      </td>
      <td className="space-x-2 px-6 py-4 font-medium ">{cp.address}</td>
      <td className="space-x-2 px-6 py-4">
        {formatDateString(cp.start_date)} - {formatDateString(cp.end_date)}
      </td>
      <td className="space-x-2 px-6 py-4">{cp.status}</td>
    </tr>
  );
};
