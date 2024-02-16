import React, { useEffect, useMemo, useState } from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { ICPMobile, ICPM_events } from '../../../../../../lib/types';
import InputSearch from '../../../../components/common/InputSearch';

interface Props {
  experienceId: string;
  cpsMobile: ICPMobile[];
  form: UseFormReturn<any, any>;
  checkedCPs?: ICPM_events[];
  selectedEventId?: string;
}

export function SearchCheckboxExperiencesCPMobiles({
  cpsMobile,
  form,
  checkedCPs,
  selectedEventId,
  experienceId,
}: Props) {
  const [query, setQuery] = useState('');
  const { register, setValue, control } = form;

  const [checkedCPsState, setCheckedCPsState] = useState<ICPM_events[]>(
    checkedCPs ?? [],
  );

  const { fields, append, insert, remove } = useFieldArray({
    name: 'event_experiences',
    control,
  });

  useEffect(() => {
    console.log(fields);
  }, [fields]);

  const handleCheckboxChange = (
    cpId: string,
    index: number,
    isChecked: boolean,
  ) => {
    if (isChecked) {
      const cpExperience: { cp_mobile_id: string; experience_id: string } = {
        cp_mobile_id: cpId,
        experience_id: experienceId,
      };

      append(cpExperience);

      // setValue(`event_experiences.${index}.cp_mobile_id`, cpId);
      // setValue(`event_experiences.${index}.experience_id`, experienceId);

      // Verify if the CP is already in the array
      if (checkedCPsState.some((item) => item.cp_id === cpId)) return;

      const cp_check: ICPM_events = {
        cp_id: cpId,
        event_id: selectedEventId ?? '',
        is_active: false,
      };
      setCheckedCPsState([...checkedCPsState, cp_check]);
    } else {
      remove(index);

      // setValue(`event_experiences.${index}.cp_mobile_id`, '');
      // setValue(`event_experiences.${index}.experience_id`, '');

      setCheckedCPsState(checkedCPsState.filter((item) => item.cp_id !== cpId));
    }
  };

  // useEffect(() => {
  //   setValue('cps_mobile', checkedCPsState);
  // }, [checkedCPsState]);

  const filteredItemsByCPName = useMemo(() => {
    if (!cpsMobile) return [];
    return cpsMobile.filter((cp) => {
      return cp.cp_name.toLowerCase().includes(query.toLowerCase());
    });
  }, [cpsMobile, query]);

  return (
    <section className="my-6 w-full">
      <div className=" z-10 w-full rounded bg-white shadow dark:bg-gray-700">
        <InputSearch
          query={query}
          setQuery={setQuery}
          searchPlaceholder={'search_cp_mobile_by_name'}
        />

        <ul
          className="h-36 overflow-y-auto px-3 pb-3 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownSearchButton"
        >
          {filteredItemsByCPName.map((cp: ICPMobile, index: number) => {
            return (
              <li
                key={cp.id}
                className="flex items-center justify-between rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                {/* Checkbox Name  */}
                <input
                  id={`checkbox-item-${cp.id}`}
                  type="checkbox"
                  {...register(`event_experiences.${index}.cp_mobile_id`)}
                  checked={checkedCPsState?.some(
                    (cps_event) => cps_event.cp_id === cp.id,
                  )}
                  onChange={(e) =>
                    handleCheckboxChange(cp.id, index, e.target.checked)
                  }
                  value={cp.id}
                  className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                />
                <label
                  htmlFor={`checkbox-item-${cp.id}`}
                  className="hover:cursor-pointer ml-2 w-full rounded text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {cp.cp_name}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
