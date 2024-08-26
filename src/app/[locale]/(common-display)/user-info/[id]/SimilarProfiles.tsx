import DisplayImageProfile from '@/app/[locale]/components/common/DisplayImageProfile';
import React from 'react';

const SimilarProfiles = () => {
    return (
        <div className="rounded-lg border-t-4 border-beer-gold bg-white p-4 shadow-lg">
            <div className="flex items-center space-x-3 text-xl font-semibold text-gray-900">
                <span className=" text-beer-gold">
                    <svg
                        className="h-5 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                </span>
                <span>Similar Profiles</span>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:grid-cols-2">
                <div className="text-center">
                    <DisplayImageProfile
                        imgSrc={''}
                        class={
                            'mx-auto h-16 w-16 rounded-full border border-gray-300'
                        }
                    />
                    <a
                        href="#"
                        className="block mt-2 text-main-color text-sm font-semibold"
                    >
                        Kojstantin
                    </a>
                </div>
                <div className="my-2 text-center">
                    <DisplayImageProfile
                        imgSrc={''}
                        class={'mx-auto h-16 w-16 rounded-full'}
                    />
                    <a
                        href="#"
                        className="block mt-2 text-main-color text-sm font-semibold"
                    >
                        James
                    </a>
                </div>
                <div className="my-2 text-center">
                    <DisplayImageProfile
                        imgSrc={''}
                        class={'mx-auto h-16 w-16 rounded-full'}
                    />
                    <a
                        href="#"
                        className="block mt-2 text-main-color text-sm font-semibold"
                    >
                        Natie
                    </a>
                </div>
                <div className="my-2 text-center">
                    <DisplayImageProfile
                        imgSrc={''}
                        class={'mx-auto h-16 w-16 rounded-full'}
                    />
                    <a
                        href="#"
                        className="block mt-2 text-main-color text-sm font-semibold"
                    >
                        Casey
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SimilarProfiles;
