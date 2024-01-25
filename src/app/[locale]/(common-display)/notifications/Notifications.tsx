import React from "react";
import { INotification } from "../../../../lib/types";
import { NotificationList } from "./NotificationList";

interface Props {
  notifications: INotification[];
}

export default function Notifications({ notifications }: Props) {
  return (
    <section className="px-4 py-6" aria-label="Notifications">
      <NotificationList notifications={notifications} />
    </section>
  );
}
