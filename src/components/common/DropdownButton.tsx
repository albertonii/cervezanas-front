import React, { useRef, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useOutsideClick } from "../../hooks/useOnOutsideClick";

interface DropdownProps {
  options: string[];
}

const DropdownButton = (props: DropdownProps) => {
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
        <span className="w-4 h-auto logo block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-beer-dark md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
          <FontAwesomeIcon
            icon={faUser}
            style={{ color: "bear-dark" }}
            // onClick={() => setOpen(true)}
            // onMouseEnter={() => setHoverColor("filled")}
            // onMouseLeave={() => setHoverColor("unfilled")}
            title={"profile"}
          />
        </span>
        <BiChevronDown size={20} className={`${open && "rotate-180"}`} />
      </div>

      {/* Dropdow */}
      <div className="absolute right-0 inset-y-8 z-10 divide-y divide-gray-100  w-44 dark:bg-gray-700 ">
        <ul
          className={`bg-white mt-2 overflow-y-auto rounded-lg shadow ${
            open ? "max-h-60" : "max-h-0"
          }
           text-sm text-gray-700 dark:text-gray-200 `}
        >
          {options?.map((option: string, idx: number) => (
            <li
              key={idx}
              className={`p-2 text-sm hover:bg-beer-softBlond hover:text-white bg-white-600 text-white `}
            >
              <Link href={`/${option}`}>
                <span
                  className="block py-2 pr-4 pl-3 text-white rounded md:bg-transparent md:text-beer-dark md:p-0 dark:text-white"
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
};

export default DropdownButton;