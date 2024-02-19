'use client';

import Link from 'next/link';
import { useAuth } from '../../(auth)/Context/useAuth';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '../../components/common/Button';
import { useAppContext } from '../../../context/AppContext';
import useOnClickOutside from '../../../../hooks/useOnOutsideClickDOM';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { generateLink } from '../../../../utils/utils';
import useDeviceDetection from '../../../../hooks/useDeviceDetection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';

type Props = {
  sidebarLinks: { name: string; icon: string; option: string }[];
};

export function Sidebar({ sidebarLinks }: Props) {
  const sLinks = sidebarLinks;
  const { sidebar, changeSidebarActive } = useAppContext();
  const { role } = useAuth();
  const device = useDeviceDetection();

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

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const handleClose = () => {
      setOpen(false);
    };

    if (event.key === 'Escape') handleClose();
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyPress);

      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [handleKeyPress, open]);

  return (
    <>
      {device === 'Mobile' && (
        <>
          <Button
            data-drawer-target="default-sidebar"
            data-drawer-toggle="default-sidebar"
            aria-controls="default-sidebar"
            btnType="button"
            class={`absolute -top-16 mx-2 mt-2 h-6 w-6 rounded-full p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600`}
            onClick={() => {
              handleClick();
            }}
          >
            {open ? (
              <FontAwesomeIcon
                icon={faCircleChevronLeft}
                style={{ color: '#432a14' }}
                title={'chevron_circle_down'}
                width={20}
                height={20}
                className={`absolute bottom-0 right-0 h-full`}
              />
            ) : (
              <FontAwesomeIcon
                icon={faCircleChevronLeft}
                style={{ color: '#432a14' }}
                title={'chevron_circle_down'}
                width={20}
                height={20}
                className={`absolute bottom-0 right-0 h-full rotate-180`}
              />
            )}
          </Button>
        </>
      )}

      <Button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        btnType="button"
        class={`sticky top-20 mx-2 mt-2 h-6 w-6 rounded-full p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 lg:hidden`}
        onClick={() => {
          handleClick();
        }}
      >
        {open ? (
          <FontAwesomeIcon
            icon={faCircleChevronLeft}
            style={{ color: '#432a14' }}
            title={'chevron_circle_down'}
            width={20}
            height={20}
            className={`absolute bottom-0 right-0 h-full`}
          />
        ) : (
          <FontAwesomeIcon
            icon={faCircleChevronLeft}
            style={{ color: '#432a14' }}
            title={'chevron_circle_down'}
            width={20}
            height={20}
            className={`absolute bottom-0 right-0 h-full rotate-180`}
          />
        )}
      </Button>

      {role && (
        <aside
          className={`
        ${
          open ? 'translate-x-0' : '-translate-x-[100%] lg:translate-x-0'
        } absolute z-10 h-full transform bg-white duration-300 ease-in-out sm:min-h-[50vh] lg:relative lg:block bg-[url('/assets/rec-graf4b.png')] bg-repeat bg-top bg-auto
        `}
          aria-label="Sidebar"
          id="default-sidebar"
          ref={sidebarRef}
        >
          <div
            className={`h-full w-56 overflow-y-auto rounded bg-gray-100 px-3 py-4 dark:bg-gray-800`}
          >
            <ul className="space-y-2 font-medium">
              {sLinks.map((link) => (
                <li
                  className={`
                flex items-center uppercase rounded-lg text-sm font-normal text-gray-600 hover:cursor-pointer hover:bg-beer-blonde dark:text-white dark:hover:bg-gray-700
                ${
                  sidebar === link.option
                    ? 'bg-beer-softBlonde text-gray-700'
                    : 'text-gray-600'
                } `}
                  key={link.name}
                >
                  <Link
                    href={generateLink(role, link.option)}
                    className="w-full p-2 px-4 font-semibold tracking-wide"
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
      )}
    </>
  );
}
