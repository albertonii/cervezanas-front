"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { useOutsideClick } from "../hooks/useOnOutsideClick";
import { useAppContext } from "./Context";

interface DropdownProps {
  options: string[];
}

export function HeaderDropdownButton(props: DropdownProps) {
  const { options } = props;

  const [open, setOpen] = useState(false);
  const dropdown = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const { changeSidebarActive } = useAppContext();

  const handleOpenCallback = () => {
    setOpen(false);
  };

  useOutsideClick(() => handleOpenCallback(), dropdown);

  const handleDropdownButton = (option: string) => {
    switch (option) {
      case "profile":
        return (
          <Link href={{ pathname: `/${option}` }}>
            <span
              className="text-md block py-2 pr-4 pl-3 text-beer-dark hover:text-beer-draft  dark:text-white  md:bg-transparent md:p-0"
              aria-current="page"
            >
              {t(option)}
            </span>
          </Link>
        );

      case "orders":
        return (
          <Link href={{ pathname: `/profile` }}>
            <span
              className="text-md block py-2 pr-4 pl-3 text-beer-dark hover:text-beer-draft  dark:text-white  md:bg-transparent md:p-0"
              aria-current="page"
            >
              {t(option)}
            </span>
          </Link>
        );

      case "signout":
        return (
          <Link href={{ pathname: `/${option}` }}>
            <span
              className="text-md block py-2 pr-4 pl-3 text-beer-dark hover:text-beer-draft  dark:text-white  md:bg-transparent md:p-0"
              aria-current="page"
            >
              {t(option)}
            </span>
          </Link>
        );

      case "submitted_aps":
        return (
          <Link href={{ pathname: `/profile`, query: { a: `submitted_aps` } }}>
            <span
              className="text-md block py-2 pr-4 pl-3 text-beer-dark hover:text-beer-draft  dark:text-white  md:bg-transparent md:p-0"
              aria-current="page"
            >
              {t(option)}
            </span>
          </Link>
        );

      case "monthly_products":
        return (
          <Link
            href={{ pathname: `/profile`, query: { a: `monthly_products` } }}
          >
            <span
              className="text-md block py-2 pr-4 pl-3 text-beer-dark hover:text-beer-draft  dark:text-white  md:bg-transparent md:p-0"
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
      className="relative flex h-full w-12 items-center justify-center font-medium hover:cursor-pointer"
      id="profile-dropdown"
      ref={dropdown}
    >
      <div onClick={() => setOpen(!open)} className="relative">
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
      <div className="absolute inset-y-8 right-0 z-40 w-44 divide-y divide-gray-100 dark:bg-gray-700 ">
        <ul
          className={`mt-2 overflow-y-auto rounded-lg  bg-white shadow ${
            open ? "max-h-60 border-2 border-beer-blonde" : "max-h-0"
          }
            dark:text-gray-200 `}
        >
          {options?.map((option: string, idx: number) => (
            <li
              key={idx}
              className={`hover:bg-beer-softBlond bg-white-600 p-2 text-sm text-white hover:bg-beer-softBlondeBubble hover:text-white`}
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
