import React, { useEffect, useMemo, useState } from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { useAuth } from '../../../../../(auth)/Context/useAuth';
import useFetchEventExperiencesByEventIdAndCPMobileId from '../../../../../../../hooks/useFetchEventExperiencesByEventIdAndCPId';
import useFetchExperiencesByProducerId from '../../../../../../../hooks/useFetchExperiencesByProducerId';
import {
    IEventExperience,
    IExperience,
} from '../../../../../../../lib/types/quiz';
import InputSearch from '../../../../../components/common/InputSearch';

interface Props {
    eventId: string;
    cpMobileId: string;
    form: UseFormReturn<any, any>;
}

export type IExperienceSearchCheckbox = {
    id: string;
    created_at: string;
    name: string;
    description: string;
    producer_id: string;
    type: string;
    price: number;
    eventExperienceId: string;
};

// TODO: Error -> Sabemos que existe un error al momento de añadir elementos a checkedExperiencesState
// En la función handleCheckboxChange. Se pueden añadir y eliminar los elementos sin mayor problema. Pero si analizamos
// el estado checkedExperiencesState, este no se actualiza correctamente. Por lo que al momento de añadir un nuevo elemento
// y se añade undefined
export function SearchCheckboxExperiences({
    eventId,
    cpMobileId,
    form,
}: Props) {
    const [query, setQuery] = useState('');
    const { getValues, setValue, control } = form;
    const { isLoggedIn } = useAuth();

    const { isError, isLoading, refetch } = useFetchExperiencesByProducerId();
    const {
        isError: isEventExperienceError,
        isLoading: isEventExperienceLoading,
        refetch: refetchEventExperience,
    } = useFetchEventExperiencesByEventIdAndCPMobileId(eventId, cpMobileId);

    const [experiences, setExperiences] = useState<IExperience[]>([]);

    const [eventExperiences, setEventExperiences] = useState<
        IEventExperience[]
    >([]);

    const [checkedExperiencesState, setCheckedExperiencesState] = useState<
        IExperienceSearchCheckbox[]
    >([]);

    const { fields, append, insert, remove } = useFieldArray({
        name: 'event_experiences',
        control,
    });

    useEffect(() => {
        if (isLoggedIn) {
            refetch().then((res: any) => {
                const experiencesData = res.data as IExperience[];
                setExperiences(experiencesData);
            });

            // Aquí obtengo todas las experiencias que el usuario ya tiene seleccionadas
            // de esta manera podremos saber si el CP ya tiene una experiencia seleccionada
            refetchEventExperience().then((res: any) => {
                const eventExperiencesData = res.data as IEventExperience[];
                setEventExperiences(eventExperiencesData);
            });
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (eventExperiences.length > 0) {
            const experiencesData = eventExperiences.map((eventExperience) => {
                const experience: IExperience | undefined = experiences.find(
                    (experience) =>
                        experience.id === eventExperience.experience_id,
                );

                if (experience === undefined) return;

                const experienceCombined: IExperience & {
                    eventExperienceId: string;
                } = {
                    ...experience,
                    eventExperienceId: eventExperience.id,
                };

                return experienceCombined;
            }) as [
                IExperience & {
                    eventExperienceId: string;
                },
            ];

            setCheckedExperiencesState(experiencesData);
        }
    }, [eventExperiences]);

    useEffect(() => {
        const eventExperiencesState: IEventExperience[] =
            checkedExperiencesState.map((experience) => {
                const eventExperience = {
                    id: experience?.eventExperienceId,
                    created_at: '',
                    cp_fixed_id: '',
                    cp_mobile_id: cpMobileId,
                    event_id: eventId,
                    experience_id: experience?.id,
                };
                return eventExperience;
            });

        setValue('event_experiences', eventExperiencesState);
    }, [checkedExperiencesState]);

    const handleCheckboxChange = (
        experience: IExperience,
        index: number,
        isChecked: boolean,
    ) => {
        if (isChecked) {
            // Verify if the Experience is already in the array
            if (
                checkedExperiencesState.some(
                    (item) => item.id === experience.id,
                )
            )
                return;

            const experience = filteredItemsByExperienceName[index];

            if (experience) {
                setCheckedExperiencesState([
                    ...checkedExperiencesState,
                    experience as IExperienceSearchCheckbox,
                ]);

                // Si existe en la lista de experiencias eliminadas, eliminarlo
                const removedEventExperiences = getValues(
                    'removed_event_experiences',
                );

                const experienceModified:
                    | IExperienceSearchCheckbox
                    | undefined = checkedExperiencesState.find(
                    (item) => item.id === experience.id,
                );

                if (experienceModified) {
                    setValue(
                        'removed_event_experiences',
                        removedEventExperiences.filter(
                            (item: any) => item.id !== experienceModified.id,
                        ),
                    );
                }
            }
        } else {
            const experienceModified: IExperienceSearchCheckbox | undefined =
                checkedExperiencesState.find(
                    (item) => item.id === experience.id,
                );

            setCheckedExperiencesState(
                checkedExperiencesState.filter(
                    (item) => item.id !== experience.id,
                ),
            );

            if (experienceModified) {
                // Añadir a la lista de experiencias eliminadas
                const removedEventExperiences = getValues(
                    'removed_event_experiences',
                );

                setValue('removed_event_experiences', [
                    ...removedEventExperiences,
                    {
                        id: experienceModified?.eventExperienceId,
                    },
                ]);
            }
        }
    };

    // TODO: Error -> Descomentar esto para ver el error comentado.
    // useEffect(() => {
    //     console.log(getValues('removed_event_experiences'));
    // }, [getValues('removed_event_experiences')]);

    const filteredItemsByExperienceName = useMemo(() => {
        if (!experiences) return [];
        return experiences.filter((ex) => {
            return ex.name.toLowerCase().includes(query.toLowerCase());
        });
    }, [experiences, query]);

    return (
        <section className="my-6 w-full">
            <div className=" z-10 w-full rounded bg-white shadow dark:bg-gray-700">
                <InputSearch
                    query={query}
                    setQuery={setQuery}
                    searchPlaceholder={'search_experiences_by_name'}
                />

                <ul
                    className="h-36 overflow-y-auto px-3 pb-3 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownSearchButton"
                >
                    {filteredItemsByExperienceName.map(
                        (experience: IExperience, index: number) => {
                            return (
                                <li
                                    key={experience.id}
                                    className="flex items-center justify-between rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    {/* Checkbox Name  */}
                                    <input
                                        id={`checkbox-item-${experience.id}`}
                                        type="checkbox"
                                        checked={checkedExperiencesState?.some(
                                            (ex) => ex?.id === experience.id,
                                        )}
                                        onChange={(e) =>
                                            handleCheckboxChange(
                                                experience,
                                                index,
                                                e.target.checked,
                                            )
                                        }
                                        value={experience.id}
                                        className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                                    />
                                    <label
                                        htmlFor={`checkbox-item-${experience.id}`}
                                        className="hover:cursor-pointer ml-2 w-full rounded text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                        {experience.name}
                                    </label>
                                </li>
                            );
                        },
                    )}
                </ul>
            </div>
        </section>
    );
}
