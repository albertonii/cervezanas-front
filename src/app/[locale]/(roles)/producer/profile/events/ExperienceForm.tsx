import React, { useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import useFetchExperiencesByProducerId from '../../../../../../hooks/useFetchExperiencesByProducerId';
import { IExperience } from '../../../../../../lib/types';
import InputSearch from '../../../../components/common/InputSearch';

interface Props {
  form: UseFormReturn<any, any>;
}

export default function ExperienceForm({ form }: Props) {
  const [query, setQuery] = useState('');
  const { register, setValue } = form;
  const { data, error } = useFetchExperiencesByProducerId();

  const [checkedExperiencesState, setCheckedExperiencesState] = useState<
    IExperience[]
  >([]);

  const filteredItemsByName = useMemo(() => {
    if (!data) return [];
    return data.filter((experience: IExperience) => {
      return experience.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [data, query]);

  if (error) {
    return <div>Error</div>;
  }

  const handleCheckboxChange = (experienceId: string, isChecked: boolean) => {
    if (isChecked) {
      console.log(isChecked);
      // Verify if the CP is already in the array
      if (checkedExperiencesState.some((item) => item.id === experienceId))
        return;

      //   const experience_check: ICPM_events = {
      //     cp_id: cpId,
      //     event_id: selectedEventId ?? '',
      //     is_active: false,
      //   };
      //   setCheckedExperiencesState([...checkedExperiencesState, cp_check]);
    } else {
      setCheckedExperiencesState(
        checkedExperiencesState.filter((item) => item.id !== experienceId),
      );
    }
  };

  return (
    <section className="z-10 my-6 w-full space-y-4 rounded bg-white shadow dark:bg-gray-700">
      <InputSearch
        query={query}
        setQuery={setQuery}
        searchPlaceholder={'search_by_name'}
      />

      <ul
        className="h-48 overflow-y-auto px-3 pb-3 text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownSearchButton"
      >
        {filteredItemsByName.map((ex: IExperience) => {
          return (
            <>
              <li
                key={ex.id}
                className="flex items-center justify-between rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <input
                  id={`checkbox-item-${ex.id}`}
                  type="checkbox"
                  {...register(`experience.${ex.id}.cp_id`)}
                  // checked={checkedCPsState?.some(
                  //   (cps_event) => cps_event.cp_id === cp.id,
                  // )}
                  onChange={(e) =>
                    handleCheckboxChange(ex.id, e.target.checked)
                  }
                  value={ex.id}
                  className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                />
                <label
                  htmlFor={`checkbox-item-${ex.id}`}
                  className="hover:cursor-pointer  ml-2 w-full rounded text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {ex.name}
                </label>
              </li>

              {/* Si el checkbox se ha seleccionado, aparecerá un desplegable con los puntos de consumo que podremos marcar/seleccionar para indicar que contiene esa experiencia */}
              {checkedExperiencesState?.some(
                (experience) => experience.id === ex.id,
              ) && (
                <h1> Prueba </h1>
                // <CPDropdown
                //     cpId={cp.id}
                //     cpsFixed={cpsFixed}
                //     register={register}
                //     setValue={setValue}
                // />
              )}
            </>
          );
        })}
      </ul>
    </section>
  );
}
