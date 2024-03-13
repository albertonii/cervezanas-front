'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { INotification } from '../../../lib/types/types';
import { useAppContext } from '../../context/AppContext';
import Button from './common/Button';
import { NotificationPopup } from './NotificationPopup';

interface Props {
  notifications: INotification[];
}

export function DeviceScreenNotification({ notifications }: Props) {
  const { openNotification, setOpenNotification } = useAppContext();

  const [animateNotifications, setAnimateNotifications] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimateNotifications(true);
      setTimeout(() => {
        setAnimateNotifications(false);
      }, 600);
    }, 300);
  }, [notifications]);

  const handleClickBell = () => {
    setOpenNotification(true);
  };

  return (
    <li className={`relative flex w-[50px] items-center`}>
      <Button
        class={`
          ${animateNotifications && 'animate-wiggle'}
          border-none transition-all hover:scale-110 hover:cursor-pointer hover:bg-transparent
        `}
        onClick={() => handleClickBell()}
        title={''}
      >
        <section className="relative rounded-full">
          <Image
            alt={'Notification bell'}
            className={'rounded-full'}
            width={0}
            height={0}
            style={{ width: '45px', height: '45px' }}
            src={'/icons/notification-icon.svg'}
          />
          <h2 className="white absolute bottom-0 right-0 flex h-6 w-6 translate-x-2 translate-y-2 items-center justify-center rounded-full bg-beer-blonde">
            {notifications?.length ?? 0}
          </h2>
        </section>
      </Button>

      {/* Notification popup  */}
      <NotificationPopup
        notifications={notifications}
        open={openNotification}
        setOpen={setOpenNotification}
      />
    </li>
  );
}
