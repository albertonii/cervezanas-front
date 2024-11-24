import useNotifications from '@/hooks/useNotifications';
import React, { createContext, useContext } from 'react';
import { INotification } from '@/lib/types/types';

interface NotificationsContextProps {
    notifications: INotification[];
    setNotifications: React.Dispatch<React.SetStateAction<INotification[]>>;
    openNotification: boolean;
    setOpenNotification: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
    markAsRead: (notificationId: string) => Promise<void>;
}

const NotificationsContext = createContext<
    NotificationsContextProps | undefined
>(undefined);

export const useNotificationsContext = () => {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error(
            'useNotificationsContext must be used within a NotificationsProvider',
        );
    }
    return context;
};

export default NotificationsContext;

interface NotificationsProviderProps {
    children: React.ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({
    children,
}) => {
    const notificationsData = useNotifications();

    return (
        <NotificationsContext.Provider value={notificationsData}>
            {children}
        </NotificationsContext.Provider>
    );
};
