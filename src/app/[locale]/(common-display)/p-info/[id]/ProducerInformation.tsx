"use client";

import React from "react";
import DisplayImageProfile from "../../../components/common/DisplayImageProfile";
import { IProducerUser } from "../../../../../lib/types";
import { useTranslations } from "next-intl";
import { formatDateString } from "../../../../../utils/formatDate";
import { SupabaseProps } from "../../../../../constants";

interface Props {
  producer: IProducerUser;
}

export default function ProducerInformation({ producer }: Props) {
  const t = useTranslations();
  const accountCreatedDate = formatDateString(producer.created_at);

  const profileImg = `${producer.users?.avatar_url}`;

  return (
    <section className="container mx-auto my-5 p-5">
      <div className="no-wrap md:-mx-2 md:flex ">
        {/*  Left Side  */}
        <div className="w-full md:mx-2 md:w-3/12">
          {/*  Profile Card  */}
          <div className="rounded-md border-t-4 border-beer-gold bg-white p-3 shadow-md">
            <div className="image overflow-hidden">
              <DisplayImageProfile imgSrc={profileImg} class={"w-full"} />
            </div>

            <h1 className="my-1 text-xl font-bold leading-8 text-gray-900">
              {producer.users?.username}
            </h1>

            <h3 className="font-lg text-semibold leading-6 text-gray-600">
              {/* {producer.producer_user.company_name} */}
            </h3>

            <p className="text-sm leading-6 text-gray-500 hover:text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Reprehenderit, eligendi dolorum sequi illum qui unde aspernatur
              non deserunt
            </p>

            <ul className="mt-3 divide-y rounded bg-gray-100 px-3 py-2 text-gray-600 shadow-sm hover:text-gray-700 hover:shadow">
              <li className="flex items-center py-3">
                <span>Status</span>
                <span className="ml-auto">
                  <span className="rounded bg-green-500 px-2 py-1 text-sm text-white">
                    Active
                  </span>
                </span>
              </li>
              <li className="flex flex-col items-start py-3">
                <span>Member since</span>
                <span className="">
                  <i>{accountCreatedDate}</i>
                </span>
              </li>
            </ul>
          </div>
          {/* End of profile card */}

          <div className="my-4"></div>

          {/*  Friends card  */}
          <div className="rounded-md border-t-4 border-beer-gold bg-white p-3 shadow-md">
            <div className="flex items-center space-x-3 text-xl font-semibold leading-8 text-gray-900">
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
            <div className="grid grid-cols-3 sm:grid-cols-2">
              <div className="my-2 text-center">
                <DisplayImageProfile
                  imgSrc={""}
                  class={"mx-auto h-16 w-16 rounded-full"}
                />
                <a href="#" className="text-main-color">
                  Kojstantin
                </a>
              </div>
              <div className="my-2 text-center">
                <DisplayImageProfile
                  imgSrc={""}
                  class={"mx-auto h-16 w-16 rounded-full"}
                />
                <a href="#" className="text-main-color">
                  James
                </a>
              </div>
              <div className="my-2 text-center">
                <DisplayImageProfile
                  imgSrc={""}
                  class={"mx-auto h-16 w-16 rounded-full"}
                />
                <a href="#" className="text-main-color">
                  Natie
                </a>
              </div>
              <div className="my-2 text-center">
                <DisplayImageProfile
                  imgSrc={""}
                  class={"mx-auto h-16 w-16 rounded-full"}
                />
                <a href="#" className="text-main-color">
                  Casey
                </a>
              </div>
            </div>
          </div>
          {/*  End of friends card  */}
        </div>

        {/*  Right Side  */}
        <div className="mx-2 h-64 w-full md:w-9/12">
          {/*  Profile tab -->
                 About Section  */}
          <div className="rounded-sm bg-white p-3 shadow-sm">
            <div className="flex items-center space-x-2 font-semibold leading-8 text-gray-900">
              <span className=" text-beer-gold">
                <svg
                  className="h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <span className="tracking-wide">About</span>
            </div>
            <div className="text-gray-700">
              <div className="grid text-sm md:grid-cols-2">
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">{t("name")}</div>
                  <div className="px-4 py-2">{producer.users?.name}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">{t("lastname")}</div>
                  <div className="px-4 py-2">{producer.users?.lastname}</div>
                </div>

                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">{t("phone")}</div>
                  <div className="px-4 py-2">+11 998001001</div>
                </div>

                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">{t("address")}</div>
                  <div className="px-4 py-2">
                    {/* {producer.profile_location[0].address_1 ??
                      "" + " " + producer.profile_location[0].address_2 ??
                      ""}

                    <br />

                    {producer.profile_location[0].town ??
                      "" + ", " + producer.profile_location[0].province ??
                      "" + ", " + producer.profile_location[0].country ??
                      ""}

                    <br />

                    {producer.profile_location[0].postalcode ?? ""} */}
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">
                    Permanant Address
                  </div>
                  <div className="px-4 py-2">
                    Arlington Heights, IL, Illinois
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">{t("email")}</div>
                  <div className="px-4 py-2">
                    <a
                      className="text-beer-gold hover:text-beer-darkGold"
                      href={`mailto:${producer.users?.email}`}
                    >
                      {producer.users?.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <button className="focus:shadow-outline hover:shadow-xs my-4 block w-full rounded-lg p-3 text-sm font-semibold text-beer-gold hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
              Show Full Information
            </button>
          </div>
          {/*  End of about section  */}

          <div className="my-4"></div>

          {/*  Experience and education  */}
          <div className="rounded-sm bg-white p-3 shadow-sm">
            <div className="grid grid-cols-2">
              <div>
                <div className="mb-3 flex items-center space-x-2 font-semibold leading-8 text-gray-900">
                  <span className=" text-beer-gold">
                    <svg
                      className="h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </span>
                  <span className="tracking-wide">Experience</span>
                </div>
                <ul className="list-inside space-y-2">
                  <li>
                    <div className="text-beer-draft">
                      Owner at Her Company Inc.
                    </div>
                    <div className="text-xs text-gray-500">
                      March 2020 - Now
                    </div>
                  </li>
                  <li>
                    <div className="text-beer-draft">
                      Owner at Her Company Inc.
                    </div>
                    <div className="text-xs text-gray-500">
                      March 2020 - Now
                    </div>
                  </li>
                  <li>
                    <div className="text-beer-draft">
                      Owner at Her Company Inc.
                    </div>
                    <div className="text-xs text-gray-500">
                      March 2020 - Now
                    </div>
                  </li>
                  <li>
                    <div className="text-beer-draft">
                      Owner at Her Company Inc.
                    </div>
                    <div className="text-xs text-gray-500">
                      March 2020 - Now
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <div className="mb-3 flex items-center space-x-2 font-semibold leading-8 text-gray-900">
                  <span className=" text-beer-gold">
                    <svg
                      className="h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path
                        fill="#fff"
                        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                      />
                    </svg>
                  </span>
                  <span className="tracking-wide">Education</span>
                </div>
                <ul className="list-inside space-y-2">
                  <li>
                    <div className="text-beer-draft">
                      Masters Degree in Oxford
                    </div>
                    <div className="text-xs text-gray-500">
                      March 2020 - Now
                    </div>
                  </li>
                  <li>
                    <div className="text-beer-draft">
                      Bachelors Degreen in LPU
                    </div>
                    <div className="text-xs text-gray-500">
                      March 2020 - Now
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            {/*  End of Experience and education grid  */}
          </div>
          {/*  End of profile tab  */}
        </div>
      </div>
    </section>
  );
}
