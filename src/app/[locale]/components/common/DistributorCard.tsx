import { IBusinessOrder } from '@/lib/types/types';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';
import DisplayImageProfile from './DisplayImageProfile';

interface Props {
    bOrder: IBusinessOrder;
}

const DistributorCard = ({ bOrder }: Props) => {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <fieldset className="grid grid-cols-1 justify-between gap-2 rounded-lg border border-gray-200 sm:space-x-4 sm:p-4 lg:grid-cols-2 lg:space-x-2 lg:p-6 ">
            <legend className="text-lg">{t('distributor_information')}</legend>

            <section className="flex space-x-4">
                <figure className="aspect-w-1  aspect-h-1 sm:aspect-none col-span-2 h-20 w-auto flex-shrink-0 justify-center overflow-hidden rounded-lg md:col-span-1 lg:h-32 ">
                    <DisplayImageProfile
                        width={100}
                        height={100}
                        imgSrc={
                            bOrder.distributor_user?.users?.avatar_url ?? ''
                        }
                        class={''}
                    />
                </figure>

                <div className="col-span-2 flex flex-col md:col-span-1">
                    <span className="space-y-1">
                        <p className="text-sm text-gray-500">{t('username')}</p>

                        <p className="text-medium truncate font-bold text-gray-900 hover:text-beer-draft ">
                            <Link
                                href={`/user-info/${bOrder.distributor_id}`}
                                locale={locale}
                                target={'_blank'}
                            >
                                {bOrder.distributor_user?.users?.username}
                            </Link>
                        </p>
                    </span>

                    <span className="space-y-1">
                        <p className="text-sm text-gray-500">{t('fullname')}</p>
                        <p className="truncate">
                            {bOrder.distributor_user?.users?.name}
                        </p>
                        <p className="truncate ">
                            {bOrder.distributor_user?.users?.lastname}
                        </p>
                    </span>

                    <span className="space-y-1">
                        <p className="text-sm text-gray-500">{t('email')}</p>
                        <p className="truncate">
                            {bOrder.distributor_user?.users?.email}
                        </p>
                    </span>
                </div>
            </section>
        </fieldset>
    );
};

export default DistributorCard;
