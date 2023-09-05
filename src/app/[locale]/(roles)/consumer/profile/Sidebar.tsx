"use client";

import useOnClickOutside from "../../../../../hooks/useOnOutsideClickDOM";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "../../../../../components/Auth";
import { Button } from "../../../../../components/common";
import { useAppContext } from "../../../../../components/Context";

export function Sidebar() {
  const { sidebar, changeSidebarActive } = useAppContext();

  const { role } = useAuth();
  const t = useTranslations();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(sidebarRef, () => handleClickOutsideCallback());

  const handleClickOutsideCallback = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  // handle what happens on key press
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const handleClose = () => {
      setOpen(false);
    };

    if (event.key === "Escape") handleClose();
  }, []);

  useEffect(() => {
    if (open) {
      // attach the event listener if the modal is shown
      document.addEventListener("keydown", handleKeyPress);
      // remove the event listener
      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [handleKeyPress, open]);

  const sidebarLinks = [
    {
      name: t("profile"),
      icon: "user",
      option: "settings",
    },
    {
      name: t("event_orders"),
      icon: "shopping-cart",
      option: "event_orders",
    },
    {
      name: t("online_orders"),
      icon: "shopping-cart",
      option: "orders",
    },
    {
      name: t("reviews"),
      icon: "review",
      option: "reviews",
    },
    {
      name: t("watchlist"),
      icon: "watchlist",
      option: "likes_history",
    },
  ];

  return (
    <>
      <Button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        btnType="button"
        class={`mx-2 mt-2 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 lg:hidden`}
        onClick={() => {
          handleClick();
        }}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="h-6 w-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </Button>

      <aside
        className={`
        ${
          open ? "translate-x-0" : "-translate-x-[100%] lg:translate-x-0 "
        } absolute z-10 h-full transform bg-white duration-300 ease-in-out sm:min-h-[50vh] lg:relative lg:block
        `}
        aria-label="Sidebar"
        id="default-sidebar"
        ref={sidebarRef}
      >
        <div
          className={`h-full w-56 overflow-y-auto rounded bg-gray-50 px-3 py-4 dark:bg-gray-800`}
        >
          <ul className="space-y-2 font-medium">
            {sidebarLinks.map((link) => (
              <li
                className={`
                flex items-center rounded-lg text-base font-normal text-gray-900 hover:cursor-pointer hover:bg-beer-blonde dark:text-white dark:hover:bg-gray-700
                ${
                  sidebar === link.option
                    ? "bg-beer-softBlonde text-gray-700"
                    : "text-gray-600"
                } `}
                key={link.name}
              >
                <Link
                  href={{ pathname: link.option }}
                  className="w-full p-2 px-4 font-medium"
                  locale={locale}
                  onClick={() => {
                    if (link.option !== sidebar) {
                      changeSidebarActive(link.option);
                    }
                  }}
                >
                  {t(link.name)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
