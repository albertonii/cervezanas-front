'use client';

import Image from 'next/image';
import React from 'react';
import { INotification } from '../../../lib/types/types';
import { useAppContext } from '../../context/AppContext';
import Button from './common/Button';
import { NotificationPopup } from './notificationPopup/NotificationPopup';

interface Props {
    notifications: INotification[];
}

export function DeviceScreenNotification({ notifications }: Props) {
    const { openNotification, setOpenNotification } = useAppContext();

    return (
        <>
            <Button
                class={
                    'border-none transition-all hover:scale-110 hover:cursor-pointer hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent'
                }
                onClick={() => setOpenNotification(true)}
                title={''}
            >
                <div className="relative rounded-full">
                    <Image
                        alt={'Notification bell'}
                        className={'rounded-full'}
                        width={0}
                        height={0}
                        style={{ width: '50px', height: '50px' }}
                        src={'/icons/notification-icon.svg'}
                    />
                    <div className="white absolute bottom-0 right-0 flex h-6 w-6 translate-x-2 translate-y-2 items-center justify-center rounded-full bg-beer-blonde">
                        {notifications?.length || 0}
                    </div>
                </div>
            </Button>

            <NotificationPopup
                open={openNotification}
                setOpen={setOpenNotification}
                notifications={notifications}
            />
        </>
    );
}
