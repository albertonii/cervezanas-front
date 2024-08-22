import DisplayImageProfile from '@/app/[locale]/components/common/DisplayImageProfile';
import { IUserTable } from '@/lib/types/types';
import { formatDateString } from '@/utils/formatDate';
import React from 'react';

interface Props {
    user: IUserTable;
}

const UserProfileCard = ({ user }: Props) => {
    const accountCreatedDate = formatDateString(user.created_at);

    const profileImg = `${user.avatar_url}`;

    return (
        <div className="rounded-lg border-t-4 border-beer-gold bg-white p-4 shadow-lg">
            <div className="image overflow-hidden rounded-full border border-gray-200">
                <DisplayImageProfile
                    imgSrc={profileImg}
                    class={'w-full h-auto rounded-full'}
                />
            </div>

            <h1 className="my-2 text-2xl font-bold text-center text-gray-900">
                {user.username}
            </h1>

            <p className="text-sm text-center text-gray-500 hover:text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Reprehenderit, eligendi dolorum sequi illum qui unde aspernatur
                non deserunt
            </p>

            <ul className="mt-4 divide-y rounded-lg bg-gray-100 p-3 text-gray-700 shadow-sm hover:text-gray-800 hover:shadow-lg">
                <li className="flex items-center justify-between py-3">
                    <span>Status</span>
                    <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-semibold text-white">
                        Active
                    </span>
                </li>
                <li className="flex flex-col items-start py-3">
                    <span>Member since</span>
                    <span className="text-sm text-gray-600">
                        <i>{accountCreatedDate}</i>
                    </span>
                </li>
            </ul>
        </div>
    );
};

export default UserProfileCard;
