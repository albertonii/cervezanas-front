import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useLocale } from 'next-intl';
import { ICPMobile } from '../../../../../../lib/types';
import { COMMON } from '../../../../../../constants';
import { formatDateString } from '../../../../../../utils/formatDate';

interface CPMobileProps {
  cp: ICPMobile;
  eventId: string;
}

export default function CPMobile({ cp, eventId }: CPMobileProps) {
  const locale = useLocale();
  console.log(cp);
  return (
    <tr
      key={cp.id}
      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <td className=" hidden space-x-2 px-6 py-4 sm:block">
        <Image
          src={cp.logo_url ?? COMMON.PROFILE_IMG}
          alt={cp.cp_name}
          width={64}
          height={64}
        />
      </td>

      <td className=" text-md space-x-2 px-2 py-4 font-semibold text-beer-blonde hover:cursor-pointer hover:text-beer-draft sm:text-lg">
        <Link href={`/events/${eventId}/mobile/${cp.id}`} locale={locale}>
          {cp.cp_name}
        </Link>
      </td>

      <td className="space-x-2 px-2 py-4">
        {formatDateString(cp.start_date)} - {formatDateString(cp.end_date)}
      </td>
      <td className="space-x-2 px-6 py-4">{cp.status}</td>
    </tr>
  );
}
