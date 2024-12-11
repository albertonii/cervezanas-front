import ExperienceAccordion from './ExperienceAccordion';
import InputSearch from '@/app/[locale]/components/form/InputSearch';
import useFetchExperiencesByProducerId from '../../../../../../hooks/useFetchExperiencesByProducerId';
import React, { useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IExperience } from '@/lib/types/types';
import { IConsumptionPoint } from '@/lib/types/consumptionPoints';

interface Props {
    cps: IConsumptionPoint[];
    form: UseFormReturn<any, any>;
}

export default function ExperienceForm({ form, cps }: Props) {
    const [query, setQuery] = useState('');
    const { data, error } = useFetchExperiencesByProducerId();

    const [checkedExperiencesState, setCheckedExperiencesState] = useState<
        IExperience[]
    >([]);

    const filteredExperiencesByName = useMemo(() => {
        if (!data) return [];
        return data.filter((experience: IExperience) => {
            return experience.name.toLowerCase().includes(query.toLowerCase());
        });
    }, [data, query]);

    if (error) {
        return <div>Error</div>;
    }

    return (
        <section className="z-10 my-6 w-full space-y-4 rounded bg-white shadow dark:bg-gray-700">
            <InputSearch
                query={query}
                setQuery={setQuery}
                searchPlaceholder={'search_by_name'}
            />

            <ul
                className="overflow-y-auto px-3 pb-3 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownSearchButton"
            >
                <ExperienceAccordion
                    form={form}
                    experiences={filteredExperiencesByName}
                    cps={cps}
                />
            </ul>
        </section>
    );
}
