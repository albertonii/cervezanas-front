"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocale, useTranslations } from "next-intl";
import { useOutsideClick } from "../../hooks/useOnOutsideClick";
import { useAuth } from "./Auth/useAuth";
import { useAppContext } from "../../../context/AppContext";

interface DropdownProps {
  options: string[];
}

export function HeaderDropdownButton({ options }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const { role, signOut, user } = useAuth();

  const dropdown = useRef<HTMLDivElement>(null);

  const t = useTranslations();
  const locale = useLocale();

  const { changeSidebarActive } = useAppContext();

  const handleOpenCallback = () => {
    setOpen(false);
  };

  useOutsideClick(() => handleOpenCallback(), dropdown);

  const generateLink = (option: string) => {
    switch (option) {
      case "profile":
        return `/${role}/profile/settings`;

      case "products":
        return `/${role}/profile/products`;

      case "events":
        return `/${role}/profile/events`;

      case "online_orders":
        return `/${role}/profile/orders`;

      case "event_orders":
        return `/${role}/profile/${option}`;

      case "campaigns":
        return `/${role}/profile/${option}`;

      case "signout":
        return `${role}/profile/${option}`;

      case "submitted_aps":
        return `${role}/profile`;

      case "monthly_products":
        return `${role}/profile`;

      case "logistics":
        return `${role}/profile/logistics`;

      default:
        return `${role}/profile/settings`;
    }
  };

  const handleDropdownButton = (option: string) => {
    switch (option) {
      case "profile":
        return (
          <Link href={generateLink(option)} locale={locale}>
            <span
              className="text-md block py-2 pl-3 pr-4 text-beer-dark hover:text-beer-draft  dark:text-white  md:bg-transparent md:p-0"
              aria-current="page"
            >
              {t(option)}
            </span>
          </Link>
        );

      case "products":
        return (
          <Link href={generateLink(option)} locale={locale}>
            <span
              className="text-md block py-2 pl-3 pr-4 text-beer-dark hover:text-beer-draft  dark:text-white  md:bg-transparent md:p-0"
              aria-current="page"
            >
              {t(option)}
            </span>
          </Link>
        );

      case "events":
        return (
          <Link href={generateLink(option)} locale={locale}>
            <span
              className="text-md block py-2 pl-3 pr-4 text-beer-dark hover:text-beer-draft  dark:text-white  md:bg-transparent md:p-0"
              aria-current="page"
            >
              {t(option)}
            </span>
          </Link>
        );

      case "online_orders":
        return (
          <Link href={generateLink(option)} locale={locale}>
            <span
              className="text-md block py-2 pl-3 pr-4 text-beer-dark hover:text-beer-draft  dark:text-white  md:bg-transparent md:p-0"
              aria-current="page"
            >
              {t(option)}
            </span>
          </Link>
        );

      case "event_orders":
        return (
          <Link href={generateLink(option)} locale={locale}>
            <span
              className="text-md block py-2 pl-3 pr-4 text-beer-dark hover:text-beer-draft  dark:text-white  md:bg-transparent md:p-0"
              aria-current="page"
            >
              {t(option)}
            </span>
          </Link>
        );

      case "campaigns":
        return (
          <Link href={generateLink(option)} locale={locale}>
            <span
              className="text-md block py-2 pl-3 pr-4 text-beer-dark hover:text-beer-draft  dark:text-white  md:bg-transparent md:p-0"
              aria-current="page"
            >
              {t(option)}
            </span>
          </Link>
        );

      case "signout":
        return (
          <>
            <hr />
            <span
              className="text-md mt-4 block py-2 pl-3 pr-4 text-beer-dark hover:text-beer-draft  dark:text-white  md:bg-transparent md:p-0"
              aria-current="page"
              onClick={() => signOut()}
            >
              {t(option)}
            </span>
          </>
        );

      case "submitted_aps":
        return (
          <Link href={generateLink(option)} locale={locale}>
            <span
              className="text-md block py-2 pl-3 pr-4 text-beer-dark hover:text-beer-draft  dark:text-white  md:bg-transparent md:p-0"
              aria-current="page"
            >
              {t(option)}
            </span>
          </Link>
        );

      case "monthly_products":
        return (
          <Link href={generateLink(option)} locale={locale}>
            <span
              className="text-md block py-2 pl-3 pr-4 text-beer-dark hover:text-beer-draft  dark:text-white  md:bg-transparent md:p-0"
              aria-current="page"
            >
              {t(option)}
            </span>
          </Link>
        );

      case "logistics":
        return (
          <Link href={generateLink(option)} locale={locale}>
            <span
              className="text-md block py-2 pl-3 pr-4 text-beer-dark hover:text-beer-draft  dark:text-white  md:bg-transparent md:p-0"
              aria-current="page"
            >
              {t(option)}
            </span>
          </Link>
        );
    }
  };

  return (
    <div
      className="relative flex h-full w-12 items-center justify-center font-medium hover:cursor-pointer "
      id="profile-dropdown"
      ref={dropdown}
    >
      <div onClick={() => setOpen(!open)} className="">
        <Image
          src={"/icons/user-profile.svg"}
          width={45}
          height={45}
          alt={"Go to Shopping cart"}
          className={"rounded-full"}
        />

        <FontAwesomeIcon
          icon={faChevronCircleDown}
          style={{ color: "#432a14" }}
          title={"chevron_circle_down"}
          width={20}
          height={20}
          className={`absolute bottom-0 right-0 ${open && "rotate-180"}`}
        />
      </div>

      {/* Dropdow */}
      <div
        className={`absolute inset-y-8 right-0 z-40 w-44 border-collapse space-y-2 divide-y divide-gray-100 shadow-lg dark:bg-gray-700
        ${open ? "block " : "hidden"}`}
      >
        {/* Little container with username photo and username  */}
        <figure className="flex items-center justify-center bg-beer-softBlonde p-1">
          <Image
            src={"/icons/user-profile.svg"}
            width={45}
            height={45}
            alt={"Go to Shopping cart"}
            className={"rounded-full"}
          />

          <span className="ml-2 text-sm font-medium text-beer-dark dark:text-white">
            <Link href={generateLink("profile")} locale={locale}>
              {user?.username}
            </Link>
          </span>
        </figure>

        <ul
          className={`overflow-y-auto rounded-lg border-4 shadow
            dark:text-gray-200 `}
        >
          {options?.map((option: string, idx: number) => (
            <li
              key={idx}
              className={`hover:bg-beer-softBlond bg-beer-foam p-2 text-sm text-white hover:bg-beer-softBlondeBubble hover:text-white`}
              onClick={() => changeSidebarActive(option)}
            >
              {handleDropdownButton(option)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
