import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useOnClickOutside from "../../hooks/useOnOutsideClickDOM";
import { useAppContext } from "../Context/AppContext";

type Props = {
  parentCallback: (menuOption: string) => void;
  role: string;
};

export function Sidebar({ parentCallback, role }: Props) {
  const { sidebar } = useAppContext();

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const handleCallback = (option: string) => {
    parentCallback(option);
  };

  const showHiddenSidebar = () => {
    if (open) {
      return "absolute h-screen w-64 bg-white z-10 top-0 left-0 ease-in-out duration-300";
    } else {
      return "hidden";
    }
  };

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

  const sidebarLinks =
    role === "admin"
      ? [
          {
            name: t("submitted_aps"),
            icon: "user",
            option: "submitted_aps",
          },
          {
            name: t("monthly_beers"),
            icon: "beer",
            option: "monthly_beers",
          },
        ]
      : [
          {
            name: t("profile"),
            icon: "user",
            option: "profile",
          },
          {
            name: t("products"),
            icon: "box",
            option: "products",
          },
          {
            name: t("campaigns"),
            icon: "gift",
            option: "campaigns",
          },
          {
            name: t("factories"),
            icon: "truck",
            option: "factories",
          },
          {
            name: t("orders"),
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
          {
            name: t("consumption_points"),
            icon: "location",
            option: "consumption_points",
          },
        ];

  return (
    <>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className={`inline-flex items-center p-2 mt-2 mx-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600`}
        onClick={() => {
          handleClick();
        }}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
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
      </button>
      {/* ${showHiddenSidebar()} sm:block sm:translate-x-0 transition-all translate-x-0 delay-150 ease-in-out duration-300`} */}

      <aside
        className={`
        ${
          open ? "translate-x-0" : "-translate-x-[100%] "
        } sm:block ease-in-out transform  absolute duration-300 h-screen bg-white z-10`}
        aria-label="Sidebar"
        id="default-sidebar"
        ref={sidebarRef}
      >
        <div
          className={`w-64 overflow-y-auto py-4 px-3 h-full bg-gray-50 rounded dark:bg-gray-800`}
        >
          <ul className="space-y-2 font-medium">
            {sidebarLinks.map((link) => (
              <li
                className={`
                hover:cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-beer-blonde dark:hover:bg-gray-700
                ${
                  sidebar === link.option
                    ? "bg-beer-softBlonde text-gray-700"
                    : "text-gray-600"
                } `}
                key={link.name}
                onClick={() => handleCallback(link.option)}
              >
                <span className="mx-4 font-medium">{t(link.name)}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
