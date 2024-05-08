import React from 'react';

export default function SidebarSkeleton() {
    return (
        <aside
            className={`
                   sm:top-0 absolute z-10 h-full transform bg-white duration-300 ease-in-out sm:min-h-[50vh] lg:relative lg:block bg-[url('/assets/rec-graf4b.png')] bg-repeat bg-top bg-auto
                    `}
            aria-label="Sidebar"
            id="default-sidebar"
        >
            <div
                className={`h-full w-56 overflow-y-auto rounded bg-gray-100 px-3 py-4 dark:bg-gray-800 bg-opacity-80`}
            >
                <ul className="space-y-2 font-medium">
                    <li
                        className={`
                            flex items-center uppercase rounded-lg text-sm font-normal text-gray-600  dark:text-white
                        `}
                    >
                        <div className="flex items-center justify-between animate-pulse">
                            <div>
                                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                        </div>
                    </li>
                    <li
                        className={`
                            flex items-center uppercase rounded-lg text-sm font-normal text-gray-600  dark:text-white
                        `}
                    >
                        <div className="flex items-center justify-between animate-pulse">
                            <div>
                                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                        </div>
                    </li>
                    <li
                        className={`
                            flex items-center uppercase rounded-lg text-sm font-normal text-gray-600  dark:text-white
                        `}
                    >
                        <div className="flex items-center justify-between animate-pulse">
                            <div>
                                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                                <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </aside>
    );
}
