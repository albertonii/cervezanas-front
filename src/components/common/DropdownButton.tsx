import React, { useRef, useState } from "react";
import { faChevronCircleDown, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useOutsideClick } from "../../hooks/useOnOutsideClick";

interface DropdownProps {
  options: string[];
}

export function DropdownButton(props: DropdownProps) {
  const { options } = props;

  const [open, setOpen] = useState(false);
  const dropdown = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const handleOpenCallback = () => {
    setOpen(false);
  };

  useOutsideClick(() => handleOpenCallback(), dropdown);

  return (
    <div
      className="w-12 h-full font-medium relative hover:cursor-pointer"
      id="profile-dropdown"
      ref={dropdown}
    >
      <div
        className={`absolute bg-beer-blonde w-full p-2 flex items-center justify-between rounded ${"text-gray-700"}`}
        onClick={() => setOpen(!open)}
      >
        <span className="w-4 h-auto block py-2 pr-4 pl-3 text-beer-dark rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 hover:text-beer-draft md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
          <FontAwesomeIcon
            icon={faUser}
            style={{ color: "bear-dark" }}
            // onClick={() => setOpen(true)}
            // onMouseEnter={() => setHoverColor("filled")}
            // onMouseLeave={() => setHoverColor("unfilled")}
            title={"profile"}
          />
        </span>
        <FontAwesomeIcon
          icon={faChevronCircleDown}
          style={{ color: "#432a14" }}
          title={"chevron_circle_down"}
          width={20}
          height={20}
          className={`${open && "rotate-180"}`}
        />
      </div>

      {/* Dropdow */}
      <div className="absolute right-0 inset-y-8 z-10 divide-y divide-gray-100  w-44 dark:bg-gray-700 ">
        <ul
          className={`bg-white mt-2 overflow-y-auto rounded-lg shadow ${
            open ? "max-h-60" : "max-h-0"
          }
            dark:text-gray-200 `}
        >
          {options?.map((option: string, idx: number) => (
            <li
              key={idx}
              className={`p-2 text-sm hover:bg-beer-softBlond hover:text-white bg-white-600 text-white hover:bg-beer-softBlondeBubble`}
            >
              <Link href={`/${option}`}>
                <span
                  className="block py-2 pr-4 pl-3 text-md text-beer-dark hover:text-beer-draft  md:bg-transparent  md:p-0 dark:text-white"
                  aria-current="page"
                >
                  {t(option)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
