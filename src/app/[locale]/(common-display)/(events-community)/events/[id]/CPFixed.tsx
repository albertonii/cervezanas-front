import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useLocale } from 'next-intl';
import { COMMON } from '../../../../../../constants';
import { ICPFixed } from '../../../../../../lib/types/types';
import { formatDateString } from '../../../../../../utils/formatDate';

interface CPFixedProps {
  cp: ICPFixed;
  eventId: string;
}

export default function CPFixed({ cp, eventId }: CPFixedProps) {
  const locale = useLocale();

  return (
    <tr key={cp.id} className="">
      <td className=" space-x-2 px-6 py-4">
        <Image
          src={cp.logo_url ?? COMMON.PROFILE_IMG}
          alt={cp.cp_name}
          width={64}
          height={64}
        />
      </td>

      <td className=" text-md space-x-2 px-2 py-4 font-semibold text-beer-blonde hover:cursor-pointer hover:text-beer-draft sm:text-lg">
        <Link href={`/events/${eventId}/fixed/${cp.id}`} locale={locale}>
          {cp.cp_name}
        </Link>
      </td>
      <td className="space-x-2 px-6 py-4">
        {formatDateString(cp.start_date)} - {formatDateString(cp.end_date)}
      </td>
      <td className="space-x-2 px-2 py-4">{cp.status}</td>
    </tr>
  );
}