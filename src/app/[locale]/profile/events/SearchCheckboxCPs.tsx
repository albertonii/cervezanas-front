import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { ICPMobile, ICPM_events } from "../../../../lib/types.d";

interface Props {
  cpsMobile: ICPMobile[];
  form: UseFormReturn<any, any>;
  checkedCPs: ICPM_events[];
  selectedEventId: string;
}

export function SearchCheckboxCPs({
  cpsMobile,
  form,
  checkedCPs,
  selectedEventId,
}: Props) {
  const t = useTranslations();

  const { register, setValue } = form;

  const [checkedCPsState, setCheckedCPsState] =
    useState<ICPM_events[]>(checkedCPs);

  const handleCheckboxChange = (cpId: string, isChecked: boolean) => {
    if (!checkedCPs) return;

    if (isChecked) {
      // Verify if the CP is already in the array
      if (checkedCPsState.some((item) => item.cp_id === cpId)) return;

      const cp_check: ICPM_events = {
        cp_id: cpId,
        event_id: selectedEventId,
        is_active: false,
      };
      setCheckedCPsState([...checkedCPsState, cp_check]);
    } else {
      setCheckedCPsState(checkedCPsState.filter((item) => item.cp_id !== cpId));
    }
  };

  useEffect(() => {
    setCheckedCPsState(checkedCPs);
  }, [checkedCPs]);

  useEffect(() => {
    setValue("cps_mobile", checkedCPsState);
  }, [checkedCPsState]);

  return (
    <>
      <div className="my-6 w-full">
        <div className=" z-10 w-full rounded bg-white shadow dark:bg-gray-700">
          <div className="p-3">
            <label className="sr-only">{t("search")}</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>

              <input
                type="text"
                id="input-group-search"
                className="mb-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-beer-blonde focus:ring-beer-blonde  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder={t("search_cp") ?? "Search consumption point"}
              />
            </div>
          </div>

          <ul
            className="h-48 overflow-y-auto px-3 pb-3 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownSearchButton"
          >
            {cpsMobile &&
              cpsMobile.map((cp: ICPMobile, index) => {
                return (
                  <li key={cp.id}>
                    <div className="flex items-center justify-between rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                      {/* Checkbox Name  */}
                      <div>
                        <input
                          id="checkbox-item-11"
                          type="checkbox"
                          {...register(`cps_mobile.${index}.id`)}
                          checked={checkedCPsState?.some(
                            (cps_event) => cps_event.cp_id === cp.id
                          )}
                          onChange={(e) =>
                            handleCheckboxChange(cp.id, e.target.checked)
                          }
                          value={cp.id}
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                        />
                        <label
                          htmlFor={`cps_mobile.${index}.value`}
                          className="ml-2 w-full rounded text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {cp.cp_name}
                        </label>
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
}
